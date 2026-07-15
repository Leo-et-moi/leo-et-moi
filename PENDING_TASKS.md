# Canal Opus → Fable (dépôt)

_Demandes de gabarits/architecture signalées par Opus. Fable les traite puis les archive ici._

## ✅ Traitées

- **13/07/2026 — Largeur de lecture** : colonne centrée 640 px par défaut dans `css/site.css` (`main`, `.main`, `.wrap`) + `_TEMPLATES` en `class="main"`. Correctifs locaux d'Opus retirés.
- **13/07/2026 — Classe `.consigne` partagée** : standard corail dans `css/site.css` (réf. A2-L-001), déployé rétroactivement sur 4 pages.
- **13/07/2026 — Standard « audio bilingue »** (socle) : classe **`.t-en`** partagée dans `css/site.css` (réf. A2-L-001) ; champ **`audioEn`** géré par `js/quiz.js`, `js/speaking.js` et `js/test.js` (le bouton 🔊 EN n'apparaît que si le champ est déclaré) ; `_TEMPLATES/exercice.html` documenté. **Côté contenu (Opus)** : déclarer `audioEn` dans les pages/banques **au fur et à mesure que les fichiers `<nom>_en.mp3` sont enregistrés** — ne pas déclarer de bouton sans fichier (bouton muet interdit). Le rétroactif de masse est suspendu à l'arbitrage d'Eric sur l'enregistrement (~centaines de fichiers EN) — priorité proposée : consignes d'abord.

## ⏳ En attente

- **Déploiement rétroactif des boutons 🔊 EN — décision d'Eric (13/07/2026), EN PAUSE jusqu'à son retour.** Plan arrêté : à son retour, (1) **lancer d'un coup les niveaux A1, A2 et B1** (déclaration des boutons EN + enregistrement des fichiers `<nom>_en.mp3` correspondants) ; (2) **reconsidérer avant décision** pour B2, C1 et C2. **Ne rien lancer d'ici là.** Le socle technique est prêt (commit 673b034).

## 🔧 Pour Fable — bug gabarit (signalé par Opus, 13/07)

**`_TEMPLATES/exercice.html`** pose `class="revoir-host"` **sur le `<main>`** → `bandeauRevoir()` (ui.js, mode `append`) ajoute le bandeau « revois la leçon » **en fin de page** au lieu du début. Corriger le modèle : mettre un **`<div class="revoir-host"></div>` dédié en tête de `<main>`** (comme les pages Être/Avoir), et laisser `<main class="main">`. *Opus a corrigé l'instance A2-E-004 ; le modèle et les éventuels exercices générés depuis lui restent à vérifier.*

## 🔧 Pour Fable — cache des audios remplacés (signalé par Opus, 13/07)

Notre workflow normal remplace un MP3 en **gardant le même nom** (GUIDE §2). Conséquence constatée (A2-E-004_q08) : le navigateur **ressert l'ancienne prise en cache** sur la page, alors que l'URL directe renvoie la bonne. Ctrl+Maj+R ne purge pas toujours l'audio chargé par `new Audio()`.
**À étudier au niveau du lecteur partagé `js/audio.js`** : une stratégie anti-cache pour les audios remplacés (ex. paramètre de version `?v=` sur l'URL, ou en-têtes de revalidation), **sans** re-télécharger inutilement les fichiers inchangés (connexion rurale de l'élève). Décision d'archi à toi.

## 🔧 Pour Fable — revue des erreurs de test (demande d'Eric, via Opus, 13/07)

**Besoin** : à la fin d'un test, l'élève voit **les bonnes réponses et ses erreurs** ; et le **prof** reçoit/consulte **le détail des erreurs** (pas seulement le score) pour faire retravailler les points faibles. Touche `js/test.js`, le modèle Firestore et `tableau-prof.html` → domaine Fable.

Proposition de design (à valider par Eric) :
1. **Écran de revue élève** (après le score) : liste des questions, réponse choisie + ✓/✗ + bonne réponse mise en évidence (au moins celles ratées). Bienveillant, non punitif.
2. **Données** : `setLesson(testId, {..., type:'test'})` inclut un tableau compact des items ratés — comme les tests tirent des questions **au hasard sans ID stable**, stocker le **texte de la question + réponse choisie + bonne réponse** au moment de la tentative (garder léger : uniquement les erreurs). Éventuellement un résumé **par source/compétence** (« Nombres : 3/7 erreurs ») pour le poids et la lisibilité.
3. **Tableau prof** : par tentative de test, afficher les erreurs (ou le résumé par thème) → cibler la remédiation. Option : résumé d'erreurs dans l'e-mail EmailJS de fin de test.
4. **Vigilance** : poids Firestore (stocker compact), pas de sauvegarde auto (export mensuel déjà prévu).
