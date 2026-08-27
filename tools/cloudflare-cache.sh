#!/usr/bin/env bash
# Règles de cache Cloudflare pour leo-et-moi.com (exécuté par GitHub Actions).
# - HTML/JSON : jamais en cache edge (déploiements visibles immédiatement)
# - MP3 : cache long 30 j (rapidité pour les élèves ; ?v=N pour remplacer)
# Idempotent. Jeton : secret CLOUDFLARE_API_TOKEN (variable d'env CF).
set +e
R="tools/cloudflare-cache-result.json"
API="https://api.cloudflare.com/client/v4"
AUTH="Authorization: Bearer $CF"
fin(){ echo "$1" > "$R"; }

VERIF=$(curl -s "$API/user/tokens/verify" -H "$AUTH")
Z=$(curl -s "$API/zones?name=leo-et-moi.com" -H "$AUTH")
ZID=$(echo "$Z" | jq -r '.result[0].id // empty')
if [ -z "$ZID" ]; then
  ALL=$(curl -s "$API/zones" -H "$AUTH")
  ZID=$(echo "$ALL" | jq -r '.result[0].id // empty')
  ZNOM=$(echo "$ALL" | jq -r '.result[0].name // empty')
  if [ -n "$ZID" ] && [ "$ZNOM" != "leo-et-moi.com" ]; then ZID=""; fi
fi
if [ -z "$ZID" ]; then
  fin "$(jq -nc \
    --arg jeton "$(echo "$VERIF" | jq -r '.result.status // "inconnu"')" \
    --argjson jetonErr "$(echo "$VERIF" | jq -c '.errors // []')" \
    --arg zonesOk "$(echo "$Z" | jq -r '.success')" \
    --arg nb "$(echo "$Z" | jq -r '.result | length')" \
    --argjson zonesErr "$(echo "$Z" | jq -c '.errors // []')" \
    '{ok:false,etape:"zone",jeton:$jeton,jetonErreurs:$jetonErr,listeZonesSucces:$zonesOk,zonesVisibles:($nb|tonumber),erreurs:$zonesErr,
      diagnostic:"si jeton=active et zonesVisibles=0 : il manque la permission Zone→Zone→Read sur le jeton"}')"
  exit 0
fi

EXIST=$(curl -s "$API/zones/$ZID/rulesets/phases/http_request_cache_settings/entrypoint" -H "$AUTH")
RULES=$(echo "$EXIST" | jq -c '[.result.rules[]? | select(.description != "leo-et-moi: audio en cache long" and .description != "leo-et-moi: HTML et donnees toujours frais")] | map(del(.id,.ref,.version,.last_updated))' 2>/dev/null)
{ [ -z "$RULES" ] || [ "$RULES" = "null" ]; } && RULES='[]'

NEW=$(jq -nc --argjson ex "$RULES" '$ex + [
  {description:"leo-et-moi: audio en cache long",
   expression:"(http.request.uri.path.extension eq \"mp3\")",
   action:"set_cache_settings", enabled:true,
   action_parameters:{cache:true,
     edge_ttl:{mode:"override_origin",default:2592000},
     browser_ttl:{mode:"respect_origin"}}},
  {description:"leo-et-moi: HTML et donnees toujours frais",
   expression:"(http.request.uri.path.extension in {\"html\" \"json\"}) or (http.request.uri.path.extension eq \"\")",
   action:"set_cache_settings", enabled:true,
   action_parameters:{cache:false}}
]')

PUT=$(curl -s -X PUT "$API/zones/$ZID/rulesets/phases/http_request_cache_settings/entrypoint" \
  -H "$AUTH" -H "Content-Type: application/json" --data "{\"rules\": $NEW}")
OK=$(echo "$PUT" | jq -r '.success')

PURGE=$(curl -s -X POST "$API/zones/$ZID/purge_cache" \
  -H "$AUTH" -H "Content-Type: application/json" --data '{"purge_everything":true}')

fin "$(jq -nc \
  --arg ok "$OK" \
  --arg zone "${ZID:0:8}…" \
  --argjson regles "$(echo "$PUT" | jq -c '[.result.rules[]?.description] // []')" \
  --argjson erreurs "$(echo "$PUT" | jq -c '.errors // []')" \
  --arg purge "$(echo "$PURGE" | jq -r '.success')" \
  --arg quand "$(date -u +%FT%TZ)" \
  '{ok:($ok=="true"),zone:$zone,regles:$regles,erreurs:$erreurs,purge:($purge=="true"),quand:$quand}')"
