# Canal Opus → Fable (dépôt)

_Demandes de gabarits/architecture signalées par Opus. Fable les traite puis les archive ici._

## ✅ Traitées

- **13/07/2026 — Largeur de lecture** : colonne centrée 640 px par défaut dans `css/site.css` (`main`, `.main`, `.wrap`) + `_TEMPLATES` en `class="main"`. Correctifs locaux d'Opus retirés.
- **13/07/2026 — Classe `.consigne` partagée** : standard corail dans `css/site.css` (réf. A2-L-001), déployé rétroactivement sur 4 pages.
- **13/07/2026 — Standard « audio bilingue »** (socle) : classe **`.t-en`** partagée dans `css/site.css` (réf. A2-L-001) ; champ **`audioEn`** géré par `js/quiz.js`, `js/speaking.js` et `js/test.js` (le bouton 🔊 EN n'apparaît que si le champ est déclaré) ; `_TEMPLATES/exercice.html` documenté. **Côté contenu (Opus)** : déclarer `audioEn` dans les pages/banques **au fur et à mesure que les fichiers `<nom>_en.mp3` sont enregistrés** — ne pas déclarer de bouton sans fichier (bouton muet interdit). Le rétroactif de masse est suspendu à l'arbitrage d'Eric sur l'enregistrement (~centaines de fichiers EN) — priorité proposée : consignes d'abord.

## ⏳ En attente

- **Déploiement rétroactif des boutons 🔊 EN — décision d'Eric (13/07/2026), EN PAUSE jusqu'à son retour.** Plan arrêté : à son retour, (1) **lancer d'un coup les niveaux A1, A2 et B1** (déclaration des boutons EN + enregistrement des fichiers `<nom>_en.mp3` correspondants) ; (2) **reconsidérer avant décision** pour B2, C1 et C2. **Ne rien lancer d'ici là.** Le socle technique est prêt (commit 673b034).
