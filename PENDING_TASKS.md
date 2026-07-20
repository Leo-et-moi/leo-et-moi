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

## ⏳ En attente

_(aucune)_

## 🔧 Pour Fable — série « Dialogue » : dossier distinct par niveau (demande d'Eric, via Opus, 14/07)

« Dialogue » est une **série évolutive** qui couvrira progressivement tous les niveaux (A1→C2). Elle doit être **nettement distinguée** de la liste des exercices, sur **chaque niveau**.

**Spécification (GO d'Eric ; décisions prises) :**
1. **Catalogue** : ajouter un champ optionnel sur l'exercice, ex. `"serie": "Dialogue"` (+ éventuel ordre interne `"serieOrdre"`). Tout exercice marqué appartient à la série. *(Opus taguera `A1-E-005` — 1er de la série — dès le champ disponible.)*
2. **Page de niveau** (`js/niveau.js`) : **exclure** les exercices `serie` de la liste normale ; **après la section 📝 Tests**, afficher un **dossier « 💬 Dialogue <Niveau> »**, dans une **couleur distincte**.
3. **Clic → page de série dédiée** (décision Eric : le mécanisme **le plus adapté au smartphone**) : `french/dialogue/<niveau>.html`, **générée depuis le catalogue**, listant tous les dialogues de ce niveau (grandes cartes, retour simple). Pas d'accordéon (moins bon sur mobile).
4. **Couleur** : accent **distinct des couleurs CEFR et du corail/or** — proposition : **violet / indigo** (ex. `#6C5CE7`), à ajuster par Fable pour rester dans l'harmonie Bleu & Corail.
5. **Sur tous les niveaux** : le dossier apparaît sur chaque page A1→C2 ; il n'apparaît que si le niveau a au moins un dialogue publié.
6. **Lien aux leçons** : **optionnel** par exercice (à discuter au cas par cas) — le bandeau « revois la leçon » n'apparaît déjà que si une leçon est rattachée, donc aucun changement nécessaire de ce côté.

## 🔧 Pour Fable — déploiement Pages cassé (corrigé par Opus, 16/07)

**Symptôme** : e-mails « pages build and deployment: Run failed » (commits 1f6ffdd, cd09474…) → **aucun commit récent n'était mis en ligne** (site figé, anciens audios servis).
**Cause** : pas de `.nojekyll` à la racine → GitHub Pages lançait **Jekyll** sur un site 100 % statique (230 Mo, 688 MP3), build en échec.
**Correctif appliqué par Opus** : ajout de **`.nojekyll`** (commit 2ea3fdd) → publication statique directe, sans Jekyll.
**À surveiller / décider (Fable)** :
- Confirmer que les builds repassent au vert et vérifier les réglages Pages (source = branche `main`, déploiement statique).
- **Poids** : 230 Mo / 688 MP3 et ça grimpe vite → la bascule vers un **hébergement audio externe** (Cloudflare R2, champ `audioBase` du catalogue) devient prioritaire avant d'approcher la limite ~1 Go de Pages.

## 🎚️ Nouveau standard audio — décidé par Eric (20/07/2026)

**Tous les nouveaux MP3 du site : 128 kbps, MONO.**

Contexte : aucun standard n'avait jamais été fixé. Les 688 fichiers en ligne sont à ~230 kbps **stéréo** (défaut WavePad), soit ~112 Mo — alors que la voix est une source mono, donc un canal sur deux est une copie inutile.

- Appliqué pour la 1re fois à **B1-E-003** (Kessel) : 117 fichiers, 33 Mo → **14 Mo**, sans perte perceptible.
- **Les fichiers existants ne sont pas retouchés** : les remplacer ne récupérerait aucun espace dans l'historique Git et ne ferait qu'alourdir le dépôt.
- Archive maître des originaux conservée dans OneDrive `_TRANSFERTS_SONNET/instr` → la décision reste réversible.

**🔧 Pour Fable** : inscrire cette règle dans `docs/GUIDE_LEO-ET-MOI.md` §3 et dans `docs/DIRECTIVES_CREATION_SONNET.md` §2 (nommage/format audio). Elle divise par ~2 la vitesse à laquelle l'audio approche la limite ~1 Go de Pages, en attendant l'hébergement externe.
