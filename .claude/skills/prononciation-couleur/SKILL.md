---
name: prononciation-couleur
description: Applique le codage couleur de prononciation « Léo-et-moi » (système
  Mona) à un texte français choisi — mots, phrases, nombres, expressions.
  À utiliser quand Eric colle ou pointe un texte français et demande de le
  « coder », « baliser » ou « appliquer le codage couleur / prononciation »
  (leçons être, avoir, alphabet, série Prononciation, etc.). Norme de référence :
  français standard/international.
---

# Codage couleur de prononciation — Léo-et-moi (système Mona)

## Ce que je produis (format constant)
1. Le TEXTE BALISÉ en notation Léo-et-moi, ligne par ligne, prêt à coller dans
   le moteur du site (c'est lui qui applique les couleurs).
2. Une liste « ⚠️ À vérifier » — liaisons facultatives et finales incertaines,
   laissées NON marquées, pour qu'Eric tranche à l'oreille sur l'audio.
3. La liste des mots difficiles repérés, avec leur prononciation.

## Notation d'entrée (étapes, dans l'ordre)
1. Accents : vrais caractères « é è ê ë à â ù û ç » — ne rien baliser, le moteur
   colore selon le caractère.
2. Consonne finale muette → {x} (voir règle CaReFuL). JAMAIS le « e » muet final.
2bis. Consonne finale PRONONCÉE C/R/F/L → [x] (rouge, classe `.cf`). Voir CaReFuL.
2ter. Finale-EXCEPTION (ex. « but ») → classe `.exc` (rouge/gras + SOULIGNÉ).
   Voir « Glossaire des exceptions ».
3. Liaison → ^C‿^mot : la consonne de liaison ET la voyelle qui la reçoit passent
   en rouge/gras (voir « Couleur de la liaison » dans la section Liaisons).
4. Mot difficile → <mot|pro·non·cia·tion> (phonétique française simplifiée, PAS
   l'API ; syllabes séparées par « · »).
5. Cumul possible : « le^s‿^<yeux|zieu> ».

## Noms propres — JAMAIS codés
- Ne jamais baliser un nom propre : prénoms, noms de famille, marques, produits,
  entreprises, noms de villes/villages, de rues, avenues, boulevards, etc.
- Leur prononciation est idiosyncrasique — AUCUNE règle (CaReFuL, liaison, mot
  difficile) ne s'y applique. Les laisser exactement tels qu'écrits.
- Ex. « Dantès » (le « s » se prononce → PAS « Dantè{s} ») ; « Paris »,
  « Renault », « boulevard Haussmann » : non codés.
- Ne pas coder une liaison qui impliquerait un nom propre ; dans le doute → ⚠️.

## Lettres muettes — règle CaReFuL
- Finales le plus souvent MUETTES → marquer en vert {} : **D, P, S, T, X, Z**.
  Ex. « étudian{t} », « françai{s} », « deu{x} », « ne{z} », « profon{d} ».
- Finales prononcées **C, R, F, L** (mnémo : Ca-Re-Fu-L) → **MARQUER EN ROUGE**,
  classe `.cf`, notation `[x]` (décision d'Eric : montrer que ces finales SE
  PRONONCENT, comme dans les leçons). Ex. « ave[c] », « i[l] », « me[r] »,
  « cie[l] », « mouri[r] », « d'avoi[r] ».
  - **Seulement la DERNIÈRE lettre du mot.** Si le mot finit par une muette
    D/P/S/T/X/Z précédée d'un C/R/F/L prononcé, on marque la muette en vert et on
    ne colore PAS le C/R/F/L interne : « for{t} » (t muet, r prononcé non final),
    « ver{s} » (s muet). Un C/R/F/L devant « e » muet final n'est pas final non
    plus → non marqué (« encore », « terre », « obstacle »).
  - **Terminaisons d'INFINITIF (-er, -ir, -oir) : NON CODÉES** — ni vert muet, ni
    rouge CaReFuL → rester en NOIR (décision d'Eric). Leur prononciation est fixe
    et connue : -er = [é] (« avancer, succomber »), -ir = [iʁ] (« finir,
    mourir »), -oir = [waʁ] (« avoir »). Idem pour les noms en -er à r muet
    (« rocher, boulanger »). Le rouge CaReFuL ne vaut donc que pour un C/R/F/L
    final prononcé HORS terminaison d'infinitif : « me[r] », « pou[r] »,
    « ai[r] », « cie[l] », « i[l] ».
- « G » final = muet (« lon{g} », « san{g} ») ; ailleurs le g se prononce
  (gare, girafe, montagne) → ne pas marquer.
- Marquer TOUTES les finales muettes, y compris sur les petits mots
  grammaticaux : « Nou{s} », « Vou{s} », « Il{s} », « e{t} » (CaReFuL strict —
  décision d'Eric).
- **EXCEPTION — déterminants/possessifs en -es** (les, des, mes, tes, ses, ces) :
  finale « -s » **NON codée** → en NOIR. Ces mots se lisent comme un **bloc-son
  fixe** sur le son é/è ([le], [de], [se]…, comme le nom de la lettre « c » [se]) ;
  le « s » final n'est donc PAS une « lettre muette à repérer » (même logique que
  les terminaisons d'infinitif). Décision d'Eric. NB : ce « s » reparaît en
  **liaison [z]** devant voyelle/h muet (« le^s‿^amis », « se^s‿^enfants »,
  « ce^s‿^eaux ») — là on code la liaison (rouge), pas la muette.
- **Terminaisons verbales muettes de la 3e personne du pluriel** : marquer TOUTE
  la terminaison « -ent » (et « -aient »), pas seulement le « t ».
  Ex. « étai{ent} », « passai{ent} », « s'appell{ent} ».
- **Infinitifs (-er, -ir, -oir)** : terminaison NON codée → en noir (ni {r} vert,
  ni [r] rouge). Voir la sous-règle CaReFuL ci-dessus.
- Jamais le « e » muet final.
- « h » ne se prononce jamais.

## Glossaire des exceptions (à alimenter au fil de l'eau)
Mots qui DÉROGENT à la règle des finales (CaReFuL / muettes). On marque la lettre
exceptionnelle en **rouge/gras + SOULIGNÉE** (classe `.exc`) : le soulignement
signale l'exception et la distingue de la finale CaReFuL normale (rouge SANS
soulignement).
**Consigne** : dès qu'une exception est rencontrée, l'AJOUTER ici pour qu'elle
s'applique systématiquement aux textes futurs.
- **but** — le « t » final SE PRONONCE [byt] (alors qu'un T final est normalement
  muet) → « bu[t] » avec le t rouge/gras SOULIGNÉ (`.exc`).

## H muet vs h aspiré — listes de référence
- h MUET (liaison + élision NORMALES, « l' », liaison [z]) : homme, heure, hôtel,
  hôpital, habiter, heureux, histoire, hiver, honneur, hier, herbe, + huile,
  huître (hu- exceptionnels).
- h ASPIRÉ (liaison INTERDITE + PAS d'élision : « le », pas « l' ») : haricot,
  héros, honte, hibou, hockey, hache, hall, hamac, hamster, hasard, hauteur/haut,
  hérisson, hêtre, homard, hoquet, hors-d'œuvre, hurler.
  → Ex. « le{s} / haricot{s} » (pas de [z]) ; « le hibou » (pas « l'hibou »).
- « huit » et « onze » se comportent comme un h aspiré : « le huit mai »,
  « le onze » (pas d'élision, pas de liaison).
- Doute sur un mot en h- : vérifier (Wiktionnaire marque le h aspiré ; CNRTL
  donne l'étymologie).

## Liaisons — lesquelles coder + quel son
- Obligatoires (coder) : déterminant + nom (le^s‿^amis, un‿^ami) ; pronom sujet
  + verbe (nou^s‿^avon{s}, il^s‿^ont, o^n‿^a) ; **adjectif antéposé + nom, y
  compris devant un h muet** (de petit^s‿^enfants, haute^s‿^herbe{s}) ;
  préposition/adverbe monosyllabique + mot (e^n‿^échange, trè^s‿^aimable,
  che^z‿^eux, tan^t‿^attendu{s}).
- Interdites : après « et » (jamais) ; après un nom singulier ; devant un
  h aspiré ; après une ponctuation.
- Facultatives : après « être » (il est‿allé), verbe + complément → en cas de
  doute, NE PAS coder → « ⚠️ À vérifier ».
- Ne PAS coder l'enchaînement (consonne déjà prononcée) : « une ombre »,
  « elle arrive » ne sont pas des liaisons.
- **« cet » devant voyelle ou h muet** : le « t » final se prononce toujours
  /sɛt/ (ex. « dans cet espace », « cet homme »). **Le signaler visuellement
  comme la liaison t** (rouge, son [t]) → notation `ce^t‿^espace`,
  `ce^t‿^homme` (décision d'Eric : montrer l'enchaînement à l'élève). NE PAS le
  marquer muet. NB terminologie : c'est stricto sensu un **enchaînement
  consonantique** (le « t » fait partie de la graphie du démonstratif masculin
  devant voyelle, par opposition à « ce » devant consonne, ex. « ce livre »), et
  non une liaison au sens strict ; on réutilise seulement le marquage rouge de la
  liaison t. La voyelle reçue passe elle aussi en rouge (cet‿**e**space).
- Devant h muet : liaison faite (elle^s‿^son^t‿^heureuses, sur le t).
- Son de la liaison : S, X, Z → « z » (nou^s‿^avons [z]) · T, D → « t »
  (o^n‿^attend [t]) · N → « n » nasal (o^n‿^est [n]) · G → « k ».
- **Couleur de la liaison (décision d'Eric)** : la consonne de liaison ET la
  **voyelle qui la reçoit** (1re lettre du mot suivant) sont TOUTES DEUX en
  **rouge/gras**. Ex. cet‿**e**space, les‿**a**bîmes, un‿**o**bstacle. Si cette
  voyelle porte un accent, le rouge de liaison PRIME (les‿**é**toiles → é rouge).
  EXCEPTION : si le mot suivant est un **mot difficile** (oiseau, eaux, horizon…),
  il reste ORANGE d'un bloc et SEULE la consonne de liaison est rouge (pour ne pas
  fragmenter le mot difficile) : d'un‿oiseau, ce^s‿^eaux, ce^t‿^horizon.
- Règle d'or : ne coder que les liaisons réellement prononcées, seulement devant
  voyelle ou h muet ; trancher à l'oreille sur l'audio d'Eric.

## Mots difficiles — critères (les cas clairement trompeurs seulement)
Graphie qui trompe vraiment un lecteur A1 : yeux→zieu, sœur→seur,
aujourd'hui→o·jour·dwi, femme→fam, monsieur→me·sieu, second→se·gon,
oignon→o·gnon, paysage→pé·i·zaj. Viser ~1 mot difficile / 2–3 lignes ; ne pas
surcharger (laisser plain les mots seulement un peu irréguliers).
Nombres : mot difficile quand la prononciation dépend du contexte —
<six|sis> (isolé) vs liaison si^x‿^ · <vingt|vin> · <cinq|sink>.

## Répertoire des mots difficiles (à appliquer systématiquement)
Tout mot difficile repéré est INSCRIT ici ; dès qu'il réapparaît dans un texte
codé, on le rend visible (mot en orange `.diff` + respelling), sans se reposer la
question. **Consigne** : compléter ce répertoire au fil de l'eau.
- oiseau → wa·zo (oi = [wa], s intervocalique = [z])
- prodigieux → pro·di·jieu (gi = [j], -eux = [eu], x muet)
- horizon → o·ri·zon (h muet)
- eaux → o (e-a-u-x → [o])

## Respelling des mots difficiles — de l'IPA vers la phonétique simplifiée
Lire l'IPA d'un dictionnaire de référence (CNRTL/TLFi, Le Robert, Wiktionnaire),
puis réécrire en graphies françaises intuitives (syllabes séparées par « · ») :
  ø/œ → « eu » · ʒ → « j » · ʃ → « ch » · ɛ̃ → « in » · ɑ̃ → « an » · ɔ̃ → « on » ·
  ɲ → « gn » · j → « y/i » (yeux /jø/ → zieu) · z (liaison) → « z ».
Jamais l'API dans la sortie élève — seulement la phonétique simplifiée.

## Vérification (ne pas deviner)
- Finale douteuse (surtout une exception CaReFuL) ou mot difficile incertain →
  vérifier l'IPA dans un dictionnaire de référence AVANT de coder.
- Si le doute persiste → laisser NON marqué et lister sous « ⚠️ À vérifier ».

**Dictionnaires IPA de référence** (pour trancher une finale douteuse ou un mot
difficile avant de coder) :
- **CNRTL / TLFi** — https://www.cnrtl.fr (savant, gratuit ; IPA + étymologie,
  utile pour trancher un h aspiré).
- **Le Robert** — https://dictionnaire.lerobert.com (gratuit ; IPA + audio).
- **Wiktionnaire** — https://fr.wiktionary.org (large couverture ; IPA, souvent
  audio, marque le h aspiré).

**Audio natif / norme québécoise — PAS pour la vérification IPA** :
- **Forvo** — https://forvo.com (prononciations audio par des locuteurs ; pas d'IPA).
- **Usito** — https://usito.usherbrooke.ca et **Vitrine linguistique de l'OQLF** —
  https://vitrinelinguistique.oqlf.gouv.qc.ca (norme québécoise).

## Correspondance couleurs (appliquée par le moteur) + sons
aigu = jaune (é = son fermé « é ») · grave = rose (è, à) · circonflexe = turquoise
(ê, â) · tréma = violet (ë, ï) · cédille = orange (ç = « s ») · lettre muette =
vert gras · liaison = rouge gras · CaReFuL (C/R/F/L prononcé, .cf) = rouge gras ·
mot difficile = orange.
Variables : --aigu:#B8820A; --grave:#B5367A; --circ:#1A8A7A; --trema:#7B3FB5;
--cedille:#E8503A; --muet:#1E7B45; --liaison:#C0392B; --cf:#C0392B; --diff:#C4640A.

## Élision (déjà dans l'orthographe — non colorée)
je/ne/le/la/de/que + voyelle → j'/n'/l'/d'/qu' (j'ai, j'aime). Coder le texte
élidé tel qu'il s'écrit.

## Auto-contrôle avant de rendre
- [ ] Finales muettes D/P/S/T/X/Z en vert {} ; finales prononcées C/R/F/L
      (dernière lettre) en rouge .cf [] ; terminaisons d'infinitif -er/-ir/-oir
      NON codées (noir) ;
      « G » final muet ; « -ent »/« -aient » marqués en entier ; aucun « e » muet
      final.
- [ ] Liaisons codées devant voyelle/h muet ; aucune après « et » ; enchaînement
      non codé — SAUF « cet » + voyelle/h muet, dont le « t » est marqué comme
      liaison t (rouge ‿).
- [ ] Liaison : consonne ET voyelle reçue en rouge (accent surclassé ; mais un mot
      difficile qui suit reste orange d'un bloc).
- [ ] Exceptions du glossaire appliquées (rouge SOULIGNÉ, ex. but) ; mots du
      répertoire rendus visibles s'ils apparaissent dans le texte.
- [ ] Aucun nom propre balisé (prénoms, noms, marques, villes, rues, etc.).
- [ ] Chaque <mot|pron> vient de l'IPA, en syllabes « · », cas trompeurs seulement.
- [ ] Cas douteux listés sous « ⚠️ À vérifier ».
