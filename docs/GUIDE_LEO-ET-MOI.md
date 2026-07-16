# 📘 Guide Leo-et-moi — Mode d'emploi, standards & to-do

> Fichier de référence central du projet **leo-et-moi.com**.
> Mode d'emploi, architecture, standards de conception, to-do, infos techniques.
> Dernière mise à jour : **10 juillet 2026** (après la restructuration — voir `PLAN_RESTRUCTURATION.md`).

---

## 1. Comment on travaille

- **Répartition des rôles (Eric, 10-14/07/2026)** : **Fable** = architecture, gabarits, maintenance, amélioration · **Opus** = intégration des contenus, audios, catalogue, déploiement (`docs/DIRECTIVES_ASSISTANT_CONTENU.md`) · **Sonnet** = conception pédagogique des cours, livrés à Opus via `_TRANSFERTS_SONNET` (`docs/DIRECTIVES_CREATION_SONNET.md`). Les demandes techniques remontent à Fable via la section « 🔧 Pour Fable » du `PENDING_TASKS.md` à la racine du dépôt.
- Le site est **statique** (HTML/CSS/JS), hébergé sur **GitHub Pages**, servi via **Cloudflare** sur **leo-et-moi.com**. Back-end : **Firebase** (Auth + Firestore) et **EmailJS** (notifications au professeur).
- **GitHub est la source de vérité** (`github.com/Leo-et-moi/leo-et-moi`, branche `main`). La copie OneDrive est un espace de travail (audios, documents), pas un miroir du code.
- **Deux emplacements pour les audios :**
  - `_SOURCES\<NIVEAU>\<ID>-<slug>\audio\` (OneDrive) → **tes** enregistrements. Ex. : `_SOURCES\A1\A1-L-003-les-nombres\audio\`.
  - Sur GitHub → la **copie que le site lit** (dossier de la leçon, en général sous-dossier `audio/`).
  - ⚠️ Le site ne lit PAS `_SOURCES`. Un fichier n'est en ligne qu'une fois **déployé sur GitHub**.
- **Voie normale** : tu déposes/remplaces le MP3 dans `_SOURCES`, tu dis « déploie tel fichier » à l'assistant, il publie et vérifie.
- Les boutons audio sont câblés sur des **noms de fichiers fixes** : ré-enregistrer en gardant **exactement le même nom** ne demande aucune modification de code. **Renommer** un MP3 en ligne est interdit ; **remplacer** (même nom) est la routine.
- Après chaque déploiement : attendre **2-3 minutes** (publication + cache), puis recharger en **Ctrl + Shift + R**.

### Architecture (depuis la restructuration de juillet 2026)

Trois couches, trois fichiers de données à la racine du dépôt :

| Couche | Fichier | Rôle | Qui décide |
|---|---|---|---|
| **Catalogue** | `catalog.json` | La source de vérité du contenu : chaque leçon (`A1-L-001`), exercice (`A1-E-001`) et test (`A1-T-001`) avec titre, niveau, ordre, chemin, compétences, liens leçon↔exercices, banque de questions, clé de progression | Structure : l'assistant · contenu : Eric |
| **Gabarits** | `css/site.css`, `js/*.js`, `_TEMPLATES/` | Le code partagé : lecteur audio unique, moteur de QCM (mélange re-synchronisé), oral auto-évalué, minuterie, composants générés | l'assistant |
| **Parcours** | `parcours.json` | Le programme (39 semaines · 6 h/jour) : semaine par semaine, jour par jour, la liste des items. Pilote « 📅 Ma journée » | **Eric** (l'assistant propose, Eric valide) |

Tout le reste en découle automatiquement : compteurs des niveaux, listes de leçons/exercices/tests, bandeaux « 📖 revois la leçon » et « ✏️ exercices liés », carte « Ma journée », échauffement/révision adaptatifs, tableau de bord prof.

**Ajouter une leçon ou un exercice = 3 gestes :** copier le modèle `_TEMPLATES/` dans `french/<niveau>/<ID>-<slug>/`, remplir le contenu, ajouter l'entrée au `catalog.json`. Rien d'autre à toucher.

**Créer un test = 1 entrée** dans la section `tests` du catalogue (titre, sources, nombre de questions, durée ou non). Eric décide de la pédagogie ; le tirage, le score, le chrono et la notification sont automatiques.

**Avant chaque déploiement :** `python3 tools/check_site.py` — vérifie liens, audios, catalogue, parcours, banques de questions, absence de voix synthétique, fichiers complets.

### Outils & plateformes

| Outil | À quoi ça sert | Détails |
|---|---|---|
| **GitHub** (`Leo-et-moi/leo-et-moi`) | Code du site ; source de vérité | Déploiement = push sur `main` ; republication ~1-2 min |
| **GitHub Pages** | Publie le site | Cache ~10 min ; limite ~1 Go (à surveiller : audio) |
| **Cloudflare** | Domaine + DNS | `leo-et-moi.com`, enregistrements **DNS only**, HTTPS actif |
| **Firebase** (projet `leo-et-moi`) | Comptes + progrès | Auth (Google + e-mail) ; Firestore : `users/{uid}` et `progress/{uid}/lessons/{id}` (score, total, completed, **dureeSec**, writings) ; règles publiées (verrouillage par niveau) |
| **EmailJS** | E-mails au prof | 1re complétion d'un exercice/test + rédactions soumises ; 200/mois |
| **LanguageTool** | Correcteur orthographe | Bouton « Orthographe » des exercices d'écriture |

> 🔒 Jamais de mots de passe/jetons/clés dans les fichiers. Exercice d'enregistrement audio par l'élève = plan Firebase **Blaze + Cloud Storage** → à signaler avant de construire.

---

## 2. Mode d'emploi — Remplacer un audio soi-même (sans passer par l'assistant)

1. **github.com** → connexion (compte **Leo-et-moi**) → dépôt **Leo-et-moi/leo-et-moi**.
2. Naviguer jusqu'au dossier audio concerné (ex. `french/b2/interrogatifs/audio`).
3. **Add file → Upload files** → glisser le MP3 portant **exactement le même nom** que celui à remplacer (un nom identique écrase l'ancien).
4. **Commit changes** (directement sur `main`) → attendre ~2 min → **Ctrl + Shift + R**.

Points de vigilance : ne jamais changer le nom ; vérifier le bon dossier ; format MP3 ; pour *ajouter* un nouvel audio (nouveau bouton), passer par l'assistant (modification de code). Après un remplacement, l'ancienne prise peut rester en cache ~10 min chez ceux qui viennent de l'écouter ; pour une bascule immédiate, demande à Opus de « bumper » le `?v=` de ce fichier.

---

## 3. Nos standards de conception (obligatoires partout)

**Design « Bleu & Corail »** (tout est dans `css/site.css`)
- Arial ≥ 18 px, fond crème `#F5F0E8`, mobile-first, cibles tactiles ≥ 44 px.
- Couleurs : dark `#1B2845` · navyMid `#2C4A7C` · corail `#E8503A` · texte `#1A2733`.
- Couleurs CEFR : a1 `#C0392B` · a2 `#E07B39` · b1 `#D4920A` · b2 `#7CB82F` · c1 `#27AE60` · c2 `#1A5C38`.
- **Zéro saisie clavier** (tout au clic), **sauf** exercices de rédaction.

**Audio**
- **Uniquement des MP3 enregistrés** (voix d'Eric / TTS payant). **Jamais** de `speechSynthesis` — le script de contrôle le vérifie. (4 anciennes pages Référence/A2 encore tolérées, en attente de décision.)
- Chaque bouton 🔊 : re-clic = pause ; re-clic = reprise ; un autre bouton arrête le précédent ; jamais deux sons à la fois (`js/audio.js`).
- Nouveaux audios : nommés `<ID>_<usage><n>.mp3` (ex. `A1-E-003_q01.mp3`). Les anciens gardent leur nom pour toujours.
- **Audio bilingue (standard, 13/07/2026)** : chaque phrase peut avoir **deux boutons** — 🔊 français + petit bouton « 🔊 EN » (classe `.t-en`) pour la traduction, fichier `<nom>_en.mp3`. Le bouton EN n'est déclaré **que si le fichier existe** (jamais de bouton muet) ; déploiement page par page au rythme des enregistrements. Dans les exercices : champ `audioEn` des questions (`js/quiz.js`, `js/test.js`, `js/speaking.js`).

**Contenu**
- IDs immuables `<NIVEAU>-<L|E|T>-<numéro>` ; l'ordre pédagogique est le champ `ordre` du catalogue (par dizaines), jamais l'ID.
- Chaque exercice est étiqueté par **compétences** : 🎧 listening · 📖 reading · ✍️ writing · 🗣️ speaking.
- Bandeau « 📖 revois la leçon » et « ✏️ exercices liés » : **générés** depuis le catalogue — ne plus les écrire à la main.
- QCM : le mélange des options **re-synchronise toujours** l'index de la bonne réponse (`js/quiz.js` et `js/test.js` le font d'office).
- Textes bilingues : l'anglais en petit corps sous chaque phrase (classe `.en`).
- **Minuterie visible : réservée aux tests** (`data-timer="visible"`). Leçons et exercices : chronomètre silencieux seulement (durée enregistrée avec le score).

**Sections d'écriture « ✍️ À toi d'écrire »** — sous chaque zone de texte, dans l'ordre : ✓ Vocabulaire · 🔍 Orthographe (LanguageTool) · 📤 Soumettre à mon professeur (Firestore + e-mail + tableau de bord).

**Profil de Leo** : dyslexie + dysgraphie + TDAH → audio/oral d'abord, un seul focus par écran, feedback immédiat et encourageant, pas de cartes mentales ni tableaux denses, pas de compte à rebours imposé.

---

## 4. To-do / En attente

- **Audios à enregistrer** : `continue_instruction.mp3` (accueil — voir `_SOURCES\NOUVEAUX_AUDIOS_ACCUEIL.md`) et `a1_resume.mp3` + liste A1 nombres (voir `_SOURCES\A1\A1-L-003-les-nombres\NOUVEAUX_AUDIOS_A_ENREGISTRER.md`).
- **Voix synthétique restante (décision d'Eric)** : 3 pages Référence + A2 écoute-invitations — enregistrer les MP3 ou retirer les boutons.
- **Parcours** : valider/modifier la semaine 1 proposée dans `parcours.json`, puis construire les semaines suivantes au fil du contenu.
- **Banques de questions restantes** : lire-invitation, écoute-invitations, faire-part, Francine (formats spécifiques).
- **Contenu** : A2 leçons « Téléphone/e-mails/rues » et « Chiffres/monnaie/comptabilité » ; niveaux A2-C2 à remplir.
- Le reste du backlog vit dans `PENDING_TASKS.md`.

---

## 5. Où trouver quoi

**Depuis le 14/07/2026, les documents de coordination vivent dans le dépôt GitHub** (versionnés, visibles de tous les assistants). Les copies OneDrive sont de simples renvois.

- `docs/GUIDE_LEO-ET-MOI.md` (ce fichier) : mode d'emploi + standards + architecture.
- `PENDING_TASKS.md` (**racine du dépôt**) : backlog global + canal « 🔧 Pour Fable ».
- `docs/PLAN_RESTRUCTURATION.md` : plan de la restructuration et état d'avancement.
- `docs/DIRECTIVES_ASSISTANT_CONTENU.md` (Opus) · `docs/DIRECTIVES_CREATION_SONNET.md` (Sonnet).
- `docs/WEBSITE_PROJECT_HANDOFF.md` : passation historique (contexte d'origine).
- Côté OneDrive (espace de travail d'Eric) : `_SOURCES\` (scripts + enregistrements audio) · `_TRANSFERTS_SONNET\` (livraisons de Sonnet pour Opus).
- Dans le dépôt : `catalog.json` (contenu) · `parcours.json` (programme) · `data/programme/` (semaines) · `_TEMPLATES/` (modèles) · `tools/check_site.py` (contrôle) · `css/site.css` + `js/` (gabarits).

---

*Pour toute publication ou ajout de fonctionnalité, le plus simple et le plus sûr reste de demander à l'assistant : il publie, exécute le contrôle qualité et vérifie en ligne.*
