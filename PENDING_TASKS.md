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

### ↑ Mise à jour (Eric, 13/07) — approche simplifiée préférée
Remplacer les points 2 (Firestore) et 3 (tableau prof) par : **envoyer une COPIE de l'écran de revue par e-mail au professeur**, sur le modèle du « 📤 Soumettre à mon professeur » des rédactions.
- **Réutiliser le circuit e-mail existant** (`LEM.submitWriting`/EmailJS) et **le template d'écriture actuel** (`EMAILJS.templateWriting`) — corps du mail = la revue (par question : réponse choisie, ✓/✗, bonne réponse). **Pas de 3ᵉ template** (plan gratuit = 2 max).
- Placement : bouton « Soumettre » au niveau de la dernière question **OU** (recommandé Opus) envoi **automatique** à la fin du test avec le score, plus fiable qu'un clic que l'élève peut oublier — à trancher par Eric.
- Bénéfice : **aucun changement du modèle Firestore ni du tableau prof**, chantier limité à `js/test.js`.

### ✅ Décision d'Eric (13/07) — verrouillée
Revue de test = **envoi AUTOMATIQUE à la fin du test, avec le score** (pas de bouton « Soumettre »). Reste : réutiliser `submitWriting`/EmailJS + template d'écriture, corps = la revue par question (choix, ✓/✗, bonne réponse). Chantier `js/test.js` uniquement.

## 🔧 Pour Fable — valider la répartition des rôles (demande d'Eric, via Opus, 14/07)

Opus a créé **`DIRECTIVES_CREATION_SONNET.md`** (à la racine du dépôt) : rôle de **Sonnet** = concevoir le brouillon pédagogique d'un cours (audio-first, bilingue, profil de Leo) et le **transférer à Opus** pour intégration/déploiement ; Sonnet ne touche ni au code, ni au catalogue, ni aux gabarits.
**Eric te demande de valider ou amender** la répartition des rôles **Opus / Sonnet / Fable**, et d'**ajouter/corriger** ce que tu juges utile dans ce fichier (et, si besoin, dans `DIRECTIVES_ASSISTANT_CONTENU.md`). Tu es libre d'intervenir.
