# _TEMPLATES — Modèles de page (Phase 1)

Point de départ de **tout nouveau contenu**. Copier le modèle dans
`french/<niveau>/<ID>-<slug>/`, remplacer les zones `<!-- À REMPLIR -->`,
ajouter l'entrée au `catalog.json`, puis exécuter `python3 tools/check_site.py`.

- `lecon.html` — page de leçon (vidéo YouTube ou contenu HTML + audio).
- `exercice.html` — exercices QCM/vrai-faux (moteur `js/quiz.js`).
- `exercice-speaking.html` — exercice d'oral auto-évalué (`js/speaking.js`).

Rappels (GUIDE §3) : MP3 enregistrés uniquement, zéro saisie clavier hors
rédaction, textes bilingues (anglais en petit corps à droite), Arial ≥ 18 px.
Les audios de la page vont dans son sous-dossier `audio/`.
