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

**Boutons — standard du 27/08/2026, obligatoire dans toute page issue d'ici.**
Employer les familles de `css/site.css` et rien d'autre : `.btn-primary` (une
seule action principale par écran), `.btn-secondary`, `.t-play` (audio FR),
`.t-en` (audio EN), `.opt` avec `.ok` / `.ng`, `.tab`, `.tree-btn`,
`.selfeval button`. **Ne redéfinis aucune de ces classes dans le `<style>` de
la page** et n'invente pas de nom pour un rôle déjà couvert : c'est ce qui a
produit les 105 noms de classes relevés le 27/08. `.good` / `.bad` sont des
alias dépréciés, réservés aux pages existantes. Un rôle réellement nouveau
s'ajoute à `site.css` par Fable, jamais dans la page.
Spécification complète : `docs/DIRECTIVES_FABLE.md` §3.
