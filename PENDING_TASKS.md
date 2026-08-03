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
- ~~Changer le niveau d'un élève depuis le tableau prof~~ : **fait le 26/07** (sélecteur A1-C2 par élève, écriture directe, feedback ✓ — plus besoin d'ouvrir la console Firestore). Reste côté Eric : **désactiver l'auto-inscription** (console Firebase → Authentication → Settings → décocher « Enable create (sign-up) ») et supprimer les comptes en double.
- **Révision du vocabulaire personnel** (quiz sur `vocab[]`).
- **Jalons & diplômes** (validé, à activer plus tard) : design Bleu & Corail, formulation neutre, pas de couleurs/prétention CECRL.

## 4. Décisions à prendre

- **Volume des MP3 (constat Eric 26/07 : trop faibles en classe)** : « Mode classe 📢 » livré (amplification ×2,2 + compresseur, bouton prof, par appareil) ; nouveaux enregistrements normalisés à la source (WavePad) ; **normalisation en lot des ~1010 fichiers existants à coupler à la migration R2** (éviter +140 Mo d'historique Git).
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

## ✅ Traitées (suite — 25/07 par Fable)

- **25/07 — Séries génériques (recommandation d'Opus validée)** : section `series` du catalogue (titre, emoji, couleur, dossier, unite, ordre) ; `niveau.js` rend les dossiers en boucle ; `js/serie.js` unique remplace dialogue.js/prononciation.js ; 12 pages régénérées sur le modèle générique ; `check_site` valide séries et pages. **Créer une série = catalogue + 6 pages minces, zéro code** (mode d'emploi : DIRECTIVES §2bis).
- **25/07 — Bouton « ✅ Exercice terminé » standard (demande d'Eric)** : `js/terminer.js` inclus sur les 17 pages de contenu + modèles — s'affiche automatiquement quand la page n'a aucun déclencheur de complétion (détection setLesson/submitWriting), état « déjà terminé », clé = progressId ou ID (leçons incluses), titres lisibles dans la notification (auth-guard) et au tableau prof (leçons résolues). Le bouton local d'A1-E-007 reste (détecté, pas de doublon).

## ✅ Traitées (suite — 26/07 par Fable : audit de cohérence des directives Sonnet, demandé par Eric)

- **Copies OneDrive périmées (constat)** : la copie Sonnet avait 21 lignes de retard et la copie Prononciation **78 lignes** (tout le §9 réplication absent !). Copies rafraîchies avec bandeau « copie de lecture — maître = dépôt » ; règle de synchronisation ajoutée aux directives d'Opus (§1b).
- **`lvl-tag`/`panel-head`** : la directive « barre unique » promettait ces classes dans `site.css` — elles y sont désormais (généralisées : `--lvl`).
- **Titre d'exercice** : la règle « le titre mentionne le niveau » contredisait le standard 25/07 (titres simples, niveau porté par la pastille) — corrigée.
- **Bilingue §2 vs §3** : reformulé pour ne plus promettre un bouton EN systématique (câblé seulement quand le fichier existe).
- **Tableau des séries actives** ajouté (§4b) : Dialogue, PRO-NON-CIA-TION, Théâtre — modèles de référence et particularités, pour que Sonnet ne reparte plus de zéro.

## ✅ Traitées (suite — 26/07 : notifications de nouveautés, demande Eric)

- **Cloche 🔔 vivante (option A)** : nouveautés du catalogue (< 21 jours, champ `ajoute`) filtrées par le niveau de l'élève (le prof voit tout) ; pastille rouge = non-vus (marqués vus à l'ouverture du panneau, `lastSeenNews`) ; branchée sur accueil, menu des niveaux et les 6 pages de niveau. Badges **🆕** sur les cartes des pages de niveau/séries — **règle affinée par Eric (27/07) : sans limite de temps** — le badge reste tant que l'élève n'a pas terminé l'item, pour tout contenu ajouté **depuis la création de son compte** (un nouvel inscrit ne voit pas tout le site en 🆕) ; prof : repère d'actualité 21 j. 11 dates posées rétroactivement ; règle « date `ajoute` obligatoire » dans les directives d'Opus ; format validé par check_site.
- **Annonces e-mail (option B)** : bloc « 📣 Annoncer les nouveautés » au tableau prof — un bouton par niveau, ouvre le logiciel de courrier d'Eric avec les adresses du niveau en copie cachée et un brouillon listant les nouveautés récentes. Zéro quota EmailJS.

## ✅ Traitées (suite — 27/07 par Fable)

- **Sommaire des pages de niveau (validé Eric)** : chapitres repliables (leçon = chapitre contenant ses exercices), rangées compactes 1 ligne (numéro · titre · 🆕 · pictos compétences · statut ✓/▶ abrégé), bandeau de navigation collant avec compteurs, sections Autres exercices / Tests / Séries, plis mémorisés par appareil et **ouverture automatique du chapitre contenant le premier exercice non terminé**. Échelle : des centaines de contenus sans défilement sans fin.
- **Bouton 🖨️ (validé Eric : RÉSERVÉ AU PROFESSEUR)** : `js/imprimer.js` sur ~48 pages + modèles — visible uniquement en compte prof, feuille d'impression (nav/boutons/audio masqués, noir sur blanc). Philosophie actée : **l'impression est une décision du prof, le site doit suffire aux élèves.**

## ✅ Traitées (suite — 27/07 : sommaire v2, 9 retours d'Eric)

- Centaines (A1-E-008, A2-E-005/006) **rattachées à la leçon A1-L-003** (bandeau « revois la leçon » actif dans les deux sens).
- Nouveaux **groupes dépliables** (champ `groupe` du catalogue) : « Nombres » et « Les invitations » sur A2 — même mécanique de plis que les chapitres.
- **Dossiers de séries au format 1 ligne** (~48 px) sur les pages de niveau, et **pages de séries en rangées compactes**.
- Trois **nouvelles catégories** (mécanisme générique, 18 pages minces) : 📚 **La farandole des livres, poèmes et chansons ! (extraits)** (B1-E-003 Kessel) · 🌍 **Fada ! Les accents et mots francophones !** (Francine + Francis) · 🎖️ **Mon coach DLPT** (vide, **annoncée sur C2** via le nouveau champ `annoncer` — affiche « bientôt »).
- **Impression déroulée** : la feuille d'impression prof déplie désormais diaporamas/onglets/plis (une étape par page) — l'impression « page visible seulement » est corrigée pour les contenus à écrans multiples ; la version totalement **reformatée/repaginée** viendra avec le moteur du Cahier (spec en attente ci-dessous).

## ⏳ En attente

- **📓 Générateur de « Cahier d'exercices de la semaine » — SPEC VALIDÉE par Eric (27/07), à construire par Fable (2-3 sessions)** :
  - Outil sur le **tableau prof uniquement** (l'élève n'imprime pas) ; sélection **manuelle** des contenus de la semaine (ou pré-remplie depuis le parcours, ajustable).
  - **Couverture** : marque leo-et-moi + URL du site · « Exercices — semaine du xx/xx/xxxx » · **individualisé : prénom + nom de l'élève, niveau** · date d'impression · **QR code** vers la page audio compagnon (playlist des pistes numérotées de la semaine).
  - **Première page de consignes** : notamment la « Méthode de Lecture – Reading Method » (modèle Kessel B1-E-003) et la « Méthode d'écoute – Recall Protocol – Listening Method » (modèle Francine C1-E-001) — reprises telles quelles.
  - Corps : leçons en version lecture + exercices reconstruits en fiches papier depuis les banques `questions.json` (QCM à cocher, lignes d'écriture) + section révision ; **corrigé détachable** en fin (pour le prof).

_(rien d'autre)_



