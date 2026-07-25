# Leo-et-moi — PENDING (backlog global + canal 🔧 Pour Fable)

_Fichier unique depuis le 14/07/2026 (fusion du backlog OneDrive et du canal du dépôt). Dernière mise à jour : 14/07/2026 par Fable._

## 1. Contenu (le plus gros chantier)

- **Remplir les niveaux.** A1 : 3 leçons ; A2 : 1 leçon (impératif) ; le reste quasi vide. Pipeline : Sonnet (conception) → `_TRANSFERTS_SONNET` → Opus (intégration).
- **À intégrer (livraison Sonnet en attente dans `_TRANSFERTS_SONNET`)** : exercice A1 « Dialogue — Réagir » (+ script audio).
- **Leçons A2 « Nombres » (suite)** : Téléphone/e-mails/rues ; Chiffres/monnaie/comptabilité.
- **Leçons manquantes pour 4 exercices orphelins** : lire-invitation, écoute-invitations (A2), lire-faire-part (B1), Francine (C1).
- **Parcours** : valider la semaine 1 (`parcours.json`) — rappel automatique actif ; puis semaines suivantes + `data/programme/semaine-XX.json`.
- **Banques restantes** : lire-invitation, écoute-invitations, faire-part, Francine.

## 2. Audios à enregistrer (Eric)

- Accueil + Référence : `continue_instruction.mp3`, `ref_outils.mp3` (voir `_SOURCES\NOUVEAUX_AUDIOS_ACCUEIL.md`).
- Résumé leçon A1 nombres : `a1_resume.mp3` + `a1_res_01→09` (textes à réécrire par Eric).
- Leçon A2 impératif : le restant des `A2-L-001_*` (voir rapport `check_site.py`).
- **🔊 Audio bilingue EN — décision d'Eric (13/07), EN PAUSE jusqu'à son retour** : à son retour, (1) lancer d'un coup A1+A2+B1 (boutons EN + enregistrements `_en.mp3`) ; (2) reconsidérer pour B2/C1/C2. Socle technique prêt (`.t-en`, `audioEn`).

## 3. Fonctionnalités à construire

- **Exercices d'enregistrement élève** : Firebase Blaze + Cloud Storage — accord d'Eric requis avant construction.
- **Réinitialisation de mot de passe** (page de connexion).
- **Changer le niveau d'un élève depuis le tableau prof**.
- **Révision du vocabulaire personnel** (quiz sur `vocab[]`).
- **Jalons & diplômes** (validé, à activer plus tard) : design Bleu & Corail, formulation neutre, pas de couleurs/prétention CECRL.

## 4. Décisions à prendre

- **Stratégie audio à l'échelle** : voix clonée payante vs manuel ; hébergement externe (R2) avant la limite ~1 Go de Pages (`audioBase` prêt).
- **Notifications** : digest hebdomadaire quand les élèves seront plus nombreux (EmailJS 200/mois).
- **Correcteur d'orthographe** : LanguageTool conservé ; à reconsidérer si débit/confidentialité.

## 5. Technique / entretien

- **Rotation du jeton GitHub (PAT)** : à faire.
- **Export périodique Firestore** (`users` + `progress`).
- **Plus tard (validé)** : PWA hors-ligne ; statistiques par question.

## 6. Assurance qualité

- **Tester avec Leo** (audio d'abord, un focus par écran, « Ma journée »).
- **Mobiles réels** (tap 44 px, audio).
- `tools/check_site.py` avant **chaque** déploiement.

---

# Canal Opus → Fable

_Demandes de gabarits/architecture. Ajouter une section « 🔧 Pour Fable — <sujet> » ; Fable traite puis archive ici._

## ✅ Traitées

- **13/07 — Largeur de lecture** : colonne 640 px par défaut (`main`/`.main`/`.wrap`) + `_TEMPLATES` corrigés.
- **13/07 — Classe `.consigne`** : standard corail partagé, déployé rétroactivement sur 4 pages.
- **13/07 — Audio bilingue (socle)** : `.t-en` + champ `audioEn` (quiz/speaking/test) ; boutons EN déclarés seulement quand le fichier existe.
- **14/07 — Bug modèle `revoir-host`** : div dédié en tête de `<main>` dans les 2 modèles exercice (instance A2-E-004 déjà corrigée par Opus).
- **14/07 — Cache des audios remplacés** : convention `?v=N` **ciblée sur le fichier remplacé** (pas de re-téléchargement massif) ; `check_site.py` tolère le suffixe ; documentée (GUIDE §2, DIRECTIVES §3b). Rappel : expiration naturelle ~10 min pour les élèves.
- **14/07 — Revue de test (décision Eric verrouillée)** : écran de revue élève (erreurs + bonnes réponses, ton bienveillant) et **envoi automatique** de la copie au professeur à la fin du test via `submitWriting`/EmailJS (template d'écriture existant) — visible aussi au tableau prof via `writings`. Chantier limité à `js/test.js`.
- **14/07 — Répartition Opus/Sonnet/Fable** : validée par Fable ; `docs/DIRECTIVES_CREATION_SONNET.md` amendé (droits d'auteur, escalade Fable, boutons EN quand fichier existe, marquage `contexte`) ; DIRECTIVES Opus complétées (§1b Sonnet, §3b anti-cache).
- **14/07 — Versionnement des documents** : **tranché — les documents de coordination vivent dans `docs/` du dépôt** ; `PENDING_TASKS.md` unique à la racine (backlog + canal) ; copies OneDrive remplacées par des renvois ; `_SOURCES` et `_TRANSFERTS_SONNET` restent sur OneDrive (espace de travail d'Eric).

## ✅ Traitées (suite — 21/07 par Fable)

- **21/07 — Série « Dialogue »** : champ `serie`/`serieOrdre` au catalogue (A1-E-005 tagué), exercices de série exclus de la liste normale, **dossier 💬 Dialogue** après les Tests sur chaque page de niveau (visible seulement si ≥ 1 dialogue publié), pages dédiées `french/dialogue/<niveau>.html` ×6 générées du catalogue (grandes cartes, progression, retour simple — pensé smartphone), couleur `--dialogue: #6C5CE7`.
- **21/07 — Build Pages** : vérifié **au vert** (dernière page C1 Francis servie en ligne) ; `.nojekyll` d'Opus confirmé comme le bon correctif. Poids : rappel — l'**hébergement audio externe (R2)** est le prochain grand chantier à décider avec Eric (voir §4 Décisions), le passage en 128 kbps mono ayant acheté du temps.
- **21/07 — Standard audio 128 kbps MONO** : inscrit au GUIDE §3 et aux directives Sonnet §2.
- **21/07 — Pause audio robuste** : `js/audio.js` retrouve désormais le bouton via `window.event`/`activeElement` quand la page ne le transmet pas, et la bascule pause/reprise est **par fichier** — la pause fonctionne même sur les anciens appels sans 2ᵉ argument (les pages listées par Opus n'ont plus besoin d'être reprises pour ça).

## ⏳ En attente

_(aucune)_



## 🔧 Pour Fable — 2e série regroupée (PRO-NON-CIA-TION) ajoutée par Opus (25/07)

À la demande d'Eric, j'ai ajouté une 2e série colorée « PRO-NON-CIA-TION avec LÉO » sur le modèle exact de « Dialogue », ce qui a nécessité de toucher tes fichiers :
- `catalog.json` : A1-E-007 tagué `serie:"Prononciation"`, `serieOrdre:10`.
- `js/niveau.js` : bloc de section dupliqué (filtre `pron` + carte « 🗣️ PRO-NON-CIA-TION »).
- `css/site.css` : `--pronunciation:#0E7C86` + `.lesson-card.pronunciation`.
- `js/prononciation.js` (nouveau, calqué sur `dialogue.js`) + `french/prononciation/a1.html`.

**Recommandation** : rendre le mécanisme de séries **générique/data-driven** (piloté par le catalogue : nom, emoji, couleur, dossier) au lieu de blocs codés en dur dans `niveau.js` — pour que les prochaines séries ne demandent plus de code. Merci de valider/refactorer si tu le juges utile.

## 🔧 Pour Fable — bouton « Exercice terminé » générique (idée d'Eric, 25/07)

Constat : les exercices/leçons **sans quiz noté ni bouton Soumettre** (ex. A1-E-007 Ratatouille) n'envoient **aucune notification** de complétion au prof.
Solution ajoutée par Opus sur A1-E-007 : un bouton bilingue « ✅ Exercice terminé — clique ici / Exercise finished — click here » qui appelle `window.LEM.setLesson(progressId,{completed:true,...})` → déclenche la notification e-mail.

**Demande d'Eric** : en faire un **composant standard** proposé automatiquement à la fin de **toutes** les leçons/exercices qui n'ont pas déjà un déclencheur de complétion (quiz `setLesson` ou `submitWriting`). Idéalement injecté par un module partagé (comme la nav) pour ne pas le recopier page par page.
