# 🏗️ Plan de restructuration — leo-et-moi.com (v2)

> Document de travail à transmettre à l'assistant (Claude) chargé de l'exécution.
> v1 : 9 juillet 2026 · **v2 : 9 juillet 2026** (intégration des arbitrages d'Eric).
> Validé par Eric le : ____________
> **À lire avant :** `GUIDE_LEO-ET-MOI.md` (standards §3, obligatoires partout), `WEBSITE_PROJECT_HANDOFF.md`, `PENDING_TASKS.md`.

---

## 0. Pourquoi cette restructuration

Le site doit accueillir à terme **39 semaines de cours à 6 h/jour** (hors jours fériés), soit plusieurs centaines de leçons et d'exercices. Or aujourd'hui :

- Chaque page HTML est autonome et embarque son propre CSS/JS dupliqué → corriger un bug = le corriger dans chaque page.
- Tout ce qui relie les contenus (accueil, menus, liens « revois la leçon », compteurs) est écrit en dur dans plusieurs pages → chaque ajout demande de retoucher 4-5 fichiers de façon cohérente.
- Rien ne représente la notion de **programme** (semaines, calendrier), qui est pourtant la colonne vertébrale pédagogique du projet.

**Remède, en trois couches :**

1. **Catalogue** (`catalog.json`) : la source de vérité de tout le contenu (quoi).
2. **Gabarits partagés** (CSS/JS communs) : la fabrique des pages (comment).
3. **Parcours** (`parcours.json`) : le programme 39 semaines qui ordonne le contenu dans le temps (quand) — rédigé et décidé **par le professeur** ; le site l'affiche et suit l'avancement.

Le site est désormais assumé **« français uniquement »** : les matières Math/Science envisagées à l'origine sont abandonnées — supprimer leurs mentions du site et des documents.

### Principes non négociables

1. **GitHub est la source de vérité** (`github.com/Leo-et-moi/leo-et-moi`, branche `main`). La copie OneDrive est partielle — ne jamais travailler à partir d'elle pour le code.
2. **Phases déployables** : jamais de « big bang ». Chaque phase laisse le site 100 % fonctionnel et se vérifie avant la suivante.
3. **Écrire les fichiers entiers**, pas d'édition partielle. (Des troncatures ont eu lieu par le passé ; vérification faite le 9/07/2026 : les 27 pages HTML en ligne sont complètes, aucune séquelle. Le script de contrôle §4 le vérifiera systématiquement.)
4. **Ne jamais renommer un MP3 déjà en ligne** (les boutons audio sont câblés sur des noms fixes). **Remplacer** un MP3 par un nouveau portant **le même nom** est en revanche la voie normale (cf. GUIDE §2) et ne demande aucun changement de code. La convention de nommage §1 s'applique aux **nouveaux** fichiers uniquement.
5. Tous les **standards du GUIDE §3** s'appliquent (design Bleu & Corail, zéro saisie clavier hors rédaction, MP3 enregistrés uniquement — jamais de `speechSynthesis` —, textes bilingues, profil de Leo : audio d'abord).

---

## 1. Convention d'identifiants

Chaque leçon et chaque exercice reçoit un **ID immuable** :

```
<NIVEAU>-<TYPE>-<NUMÉRO>     ex. A1-L-001, A1-E-004, B1-E-002
```

- `NIVEAU` : A1, A2, B1, B2, C1, C2 (chaque niveau ≈ 6,5 semaines du programme).
- `TYPE` : `L` = leçon, `E` = exercice.
- `NUMÉRO` : 3 chiffres, ordre d'entrée au catalogue. Passer à 4 chiffres si besoin.
- **Pas d'espace** dans l'ID (URLs, noms de fichiers, clés Firestore).

**Ce que l'ID ne contient pas — et pourquoi (décision ferme, discutée avec Eric) :**

- **Pas de semaine dans l'ID.** Le contenu est créé au fil de l'eau et sera déplacé, intercalé, réutilisé (une leçon introduite en S3 peut être révisée en S8). Si l'ID contenait la semaine, chaque déplacement obligerait à renuméroter — et casserait liens, clés de progression Firestore et noms d'audio. La semaine est un **attribut du parcours** (§2b), modifiable à volonté.
- **Pas d'ordre pédagogique dans l'ID.** Même logique : l'ordre est le champ `ordre` du catalogue (numéroté par dizaines : 10, 20, 30… → insérer un item entre 30 et 40 = lui donner 35, zéro renumérotation). Insérer une leçon plus tard = prochain numéro libre (`A1-L-017`) + placement libre dans l'ordre et le parcours. **Le numéro d'ID ne reflétera donc pas l'ordre des leçons : c'est voulu, c'est le prix de la stabilité.** Un ID n'est jamais réattribué, même si un contenu est retiré.
- **Pas de compétence dans l'ID.** Les exercices sont classés selon les quatre compétences — **Listening 🎧, Reading 📖, Writing ✍️, Speaking 🗣️** — via un champ `competences` du catalogue (un exercice en combine souvent plusieurs, ex. écoute + lecture). Un champ se filtre (« tous les exercices d'écoute A2 »), un ID figé non. À l'affichage : badges sur chaque carte d'exercice.

Un exercice peut être lié à des leçons d'un **autre niveau** (ex. le quiz A2 des nombres → leçon A1 des nombres) : prévu et normal.

**Affichage élève** : « A1 · Leçon 1 — Le verbe être », « A1 · Exercice 4 — Le jeu des plaques » + badges de compétences. L'ID technique peut apparaître discrètement, le titre prime.

---

## 2. Le catalogue — `catalog.json` (racine du dépôt)

Source de vérité unique de tout le contenu. Schéma :

```json
{
  "version": 2,
  "misAJour": "2026-07-09",
  "lecons": [
    {
      "id": "A1-L-001",
      "niveau": "A1",
      "ordre": 10,
      "titre": "Le verbe être",
      "chemin": "french/a1/01-etre/index.html",
      "exercices": ["A1-E-001"],
      "publie": true
    }
  ],
  "exercices": [
    {
      "id": "A1-E-001",
      "niveau": "A1",
      "ordre": 10,
      "titre": "Exercices — Le verbe être",
      "chemin": "french/a1/01-etre/exercices.html",
      "lecons": ["A1-L-001"],
      "competences": ["listening", "reading"],
      "questions": null,
      "publie": true
    }
  ]
}
```

Notes :

- `exercices` (dans une leçon) et `lecons` (dans un exercice) portent la relation **plusieurs-à-plusieurs** ; les liens dans les deux sens se génèrent à partir de là (le script de contrôle vérifie la cohérence).
- `questions` : chemin vers le fichier JSON de questions (phase 6) ; `null` tant que non extrait.
- `publie: false` : contenu préparé mais non affiché.
- Compteurs « XX Leçons / XX Exercices » par niveau = comptage des entrées `publie: true`.
- Chargé côté client par `js/catalog.js` (`fetch()`) ; à ~500 entrées le fichier reste < 200 Ko, aucun back-end nécessaire.
- Champ futur `audioBase` (racine des URLs audio) pour pouvoir basculer l'audio vers un hébergement externe (§6) sans réécrire les pages.

### 2b. La couche parcours — `parcours.json` et données de programme

Le **programme 39 semaines**, séparé du catalogue. **C'est le professeur qui le décide** (avec l'aide de Claude pour le rédiger : Eric indique l'intention, Claude propose, Eric valide). Le site l'affiche et suit l'avancement ; la seule part automatique est le *contenu* des cases échauffement/révision (§ phase 6), jamais leur place.

```json
{
  "version": 1,
  "semaines": [
    {
      "numero": 1,
      "niveau": "A1",
      "titre": "Premiers pas — être, avoir",
      "jours": [
        { "jour": 1, "plan": ["echauffement", "A1-L-001", "A1-E-001", "revision"] },
        { "jour": 2, "plan": ["echauffement", "A1-L-002", "A1-E-002", "revision"] }
      ],
      "test": "A1-T-S01"
    }
  ]
}
```

- Les jours fériés se gèrent simplement : le parcours compte en « jour 1..n de la semaine », le calendrier réel appartient à l'élève/au prof.
- Un même ID peut apparaître dans plusieurs semaines (introduction puis révision) — c'est prévu.
- Le **format** est défini dès la Phase 0 ; son **exploitation** (page « Ma journée ») vient en Phase 9, quand du contenu remplit les premières semaines.

### 2c. Données hebdomadaires — `data/programme/semaine-01.json` … `semaine-39.json`

🎉 Phrase de la semaine, 📚 Vocabulaire (5 mots) et 🔬 Anatomie du mot deviennent des **données**, jour par jour, un fichier par semaine (~195 jours au total, produits progressivement) :

```json
{
  "semaine": 1,
  "jours": [
    {
      "jour": 1,
      "phrase": { "fr": "…", "en": "…", "audio": "…" },
      "vocabulaire": [ { "fr": "…", "en": "…", "audio": "…" } ],
      "anatomie": { "mot": "rapidement", "racine": "rapide", "suffixe": "-ment", "en": "…" }
    }
  ]
}
```

**Double usage voulu :** affichage quotidien sur l'accueil **et** banque de questions réutilisable pour les tests de fin de semaine, examens de fin de niveau et test de fin de programme (§ phase 7). Remplace la mise à jour manuelle hebdomadaire actuelle.

### 2d. Inventaire initial (mapping du contenu existant — à confirmer en lisant chaque page)

| Actuel | ID proposé | Nature | Compétences |
|---|---|---|---|
| `french/a1/01-etre/index.html` | A1-L-001 | Leçon | — |
| `french/a1/01-etre/exercices.html` | A1-E-001 | Exercice | à déterminer |
| `french/a1/02-avoir/index.html` | A1-L-002 | Leçon | — |
| `french/a1/02-avoir/exercices.html` | A1-E-002 | Exercice | à déterminer |
| `french/a1/les-nombres/index.html` | A1-L-003 | Leçon | — |
| `french/a1/les-nombres/exercices.html` | A1-E-003 | Exercice | à déterminer |
| `french/a1/les-nombres/plaques.html` | A1-E-004 | Exercice (jeu des plaques) | à déterminer |
| `french/a2/les-nombres/exercices.html` | A2-E-001 | Exercice (→ A1-L-003) | à déterminer |
| `french/a2/lire-invitation/index.html` | A2-E-002 | Exercice | reading |
| `french/a2/ecoute-invitations/index.html` | A2-E-003 | Exercice | listening, writing |
| `french/b1/interrogatifs/index.html` | B1-L-001 | Leçon | — |
| `french/b1/interrogatifs/exercices-b1.html` | B1-E-001 | Exercice | à déterminer |
| `french/b1/lire-faire-part/index.html` | B1-E-002 | Exercice | reading |
| `french/b2/interrogatifs/index.html` | B2-E-001 | Exercice (→ B1-L-001) | à déterminer |
| `french/c1/francine-gosselin/index.html` | C1-E-001 | Exercice | listening |

**On ne déplace aucun fichier existant** : le catalogue pointe vers les chemins actuels. Les nouveaux contenus adoptent la convention `french/<niveau>/<ID>-<slug>/` (ex. `french/a2/A2-L-001-telephone/`).

---

## 3. Gabarits partagés

Extraire le CSS/JS dupliqué vers des fichiers communs (à ce jour, seul `js/auth-guard.js` est partagé) :

| Fichier | Contenu |
|---|---|
| `css/site.css` | Design Bleu & Corail complet : variables couleurs, couleurs CEFR, Arial ≥18px, boutons, cartes, barre de progression, nav |
| `js/catalog.js` | Chargement + interrogation du catalogue et du parcours (listes par niveau, compteurs, liens L↔E, item suivant, plan du jour) |
| `js/audio.js` | Lecteur MP3 unique : pause/reprise au re-clic, arrêt de l'audio précédent, jamais deux sons simultanés |
| `js/quiz.js` | Moteur QCM/vrai-faux : mélange des options **avec re-synchronisation de l'index de la bonne réponse**, feedback immédiat, score, écriture Firestore |
| `js/speaking.js` | Exercices d'oral sans Blaze : audio modèle → l'élève répète à voix haute → **auto-évaluation en un clic (😕 / 🙂 / 😃)** enregistrée comme un score. Prêt à accueillir l'enregistrement réel le jour où Blaze/Cloud Storage arrive |
| `js/timer.js` | Minuterie optionnelle (phase 5) |
| `js/ui.js` | Composants communs : bandeau « 📖 revois la leçon », badges de compétences, en-tête, nav basse, note bilingue |

Migration des pages existantes **page par page** (une page migrée = un commit = une vérification), sans changement visuel. Modèles de page à fournir : `_TEMPLATES/lecon.html`, `_TEMPLATES/exercice.html`, `_TEMPLATES/exercice-speaking.html`.

---

## 4. Script de contrôle qualité — `tools/check_site.py`

À exécuter **avant chaque déploiement**. Vérifie au minimum :

1. Chaque `chemin` du catalogue et du parcours correspond à un fichier/ID existant.
2. Chaque exercice référence ≥ 1 leçon existante ; champs `exercices`/`lecons` cohérents entre eux ; chaque exercice a ≥ 1 compétence.
3. Chaque `src`/`href` interne des pages HTML pointe vers un fichier existant (liens et MP3).
4. Aucune occurrence de `speechSynthesis` / `SpeechSynthesisUtterance`.
5. IDs uniques et bien formés, fichiers UTF-8, chaque HTML complet (balise `</html>` finale).
6. (Phase 6+) fichiers de questions JSON valides : index de bonne réponse dans les bornes, champs requis présents.

Rapport clair, code d'erreur si échec. C'est le filet de sécurité de tout le reste.

---

## 5. Phases d'exécution

Chaque phase se termine par : `tools/check_site.py` sans erreur → push sur `main` → ~1 min → vérification manuelle sur **leo-et-moi.com** (Ctrl+Shift+R), connexion élève ET prof. Les phases 5, 8 et 10 sont indépendantes et peuvent être avancées si l'occasion s'y prête.

### Phase 0 — Fondation (aucun changement visible)
`catalog.json` (inventaire §2d complété et compétences déterminées en lisant les pages), format `parcours.json` documenté, `tools/check_site.py`, `js/catalog.js`. Corriger les checks qui échouent sur l'existant.
**Fini quand :** le script passe, le site est strictement identique.

### Phase 1 — Gabarits partagés
`css/site.css`, `js/audio.js`, `js/quiz.js`, `js/speaking.js`, `js/ui.js` ; migration page par page ; modèles `_TEMPLATES/`.
**Fini quand :** toutes les pages sur gabarits, aucune régression visuelle ni audio, scores Firestore OK.

### Phase 2 — Accueil et pages de niveau générés
Accès rapides : **Accueil / Tableau de bord (prof, visible aux profs seulement) / Niveaux A1 A2 · B1 B2 · C1 C2**. Par niveau : « XX Leçons » / « XX Exercices » (compteurs auto), items numérotés, ordonnés, badges de compétences. Phrase/Vocabulaire/Anatomie pilotés par `data/programme/semaine-XX.json` (§2c). **Supprimer « Mes matières »** et toute mention Math/Science. `mes-lecons.html` remplacé par les pages de niveau générées.
**Fini quand :** navigation complète, compteurs justes, accueil conforme, testé avec un élève de chaque niveau existant.

### Phase 3 — Liens leçon ↔ exercices automatiques
Bandeau « 📖 Avant de commencer, revois la leçon → » généré depuis le catalogue sur **tous** les exercices (résout le rétroactif en attente : A1 nombres + plaques, A2 quiz nombres, lire-invitation, écoute-invitations, C1 Francine). Chaque leçon affiche « ✏️ Exercices liés ».
**Fini quand :** liens présents dans les deux sens partout, vérifié par le script.

### Phase 4 — « Continuer » personnalisé
La carte « ▶ Continuer » se calcule : dernier exercice **non terminé** (Firestore `progress`), sinon prochain item de l'ordre du catalogue pour le niveau de l'élève. Supprime les placeholders A1 affichés à tous (priorité n°1 du backlog).
**Fini quand :** testé avec un compte A1 et un compte C1 — chacun voit son contenu réel.

### Phase 5 — Minuterie en composant optionnel
`js/timer.js` sur chaque leçon/exercice via les gabarits ; préférence dans `users/{uid}.timer`. Retirer le Pomodoro global de l'accueil.
**Fini quand :** un élève l'active et la retrouve partout ; un autre ne la voit pas.

### Phase 6 — Échauffement & révision adaptatifs
1. **Extraction des questions en JSON** (`questions.json` par exercice, référencé par le catalogue), progressif, un commit par extraction.
2. **Sélection adaptative** : « ⚡ Échauffement » et « Révision » tirent des questions du **niveau de l'élève connecté**, graine déterministe par date (**rotation 48 h** : `graine = jourDeLAnnée >> 1`), sans serveur. Révision → items déjà terminés (répétition espacée) ; échauffement → questions faciles (momentum). Remplace la « Question de la semaine » manuelle.
**Fini quand :** deux élèves de niveaux différents voient des questions différentes et adaptées, qui changent tous les 2 jours ; audio fonctionnel.

### Phase 7 — Tests de semaine, examens de niveau, test de fin de programme
S'appuie sur les banques de questions (phase 6) + les données hebdo (§2c). **Test de fin de semaine** = tirage dans les items de la semaine (+ phrase/vocab de la semaine). **Examen de fin de niveau** = tirage équilibré par compétence sur tout le niveau. **Test de fin de programme** = tirage sur les 39 semaines. Scores en Firestore, visibles au tableau prof, notification EmailJS.
**Temps (validé par Eric)** : (a) **chronomètre silencieux par défaut** — la durée est mesurée et enregistrée avec le score (visible au tableau prof ; l'élève voit après coup « 12 min — la dernière fois : 15 min », comparaison à soi-même, jamais punitive) ; (b) **temps limité optionnel** — champ `duree` dans la définition du test, décidé par le prof test par test ; à l'expiration on soumet ce qui est fait (pas de couperet) ; jamais activé par défaut (profil TDAH/dys : un compte à rebours visible peut dégrader la performance). Le chronomètre silencieux s'applique aussi aux exercices via `js/timer.js` (Phase 5).
**Fini quand :** un test de semaine et un examen de niveau fonctionnent de bout en bout sur le contenu existant.

### Phase 8 — Suivi par compétence (tableau de bord prof)
Par élève, une barre par compétence (🎧 📖 ✍️ 🗣️) calculée sur les scores, grâce au champ `competences`. Au passage : afficher le nom tiré de l'e-mail quand `displayName` est vide (backlog).
**Fini quand :** le prof voit d'un coup d'œil les forces/faiblesses par compétence de chaque élève.

### Phase 9 — Parcours & page « Ma journée »
Quand du contenu remplit les premières semaines : `parcours.json` rédigé par Eric (assisté), page « Ma journée » sur l'accueil — *aujourd'hui : échauffement → leçon → exercices → révision*, dans l'ordre, avec avancement. Un seul focus à la fois (profil TDAH : zéro paralysie du choix). Vue prof « où en est-on par rapport au plan ».
**Fini quand :** un élève connecté suit sa journée sans avoir à choisir ; le prof voit l'avancement vs le plan.

### Phase 10 — Harmonisation OneDrive & documentation
`_SOURCES/<NIVEAU>/<ID>-<slug>/audio/` (ex. `_SOURCES/A1/A1-L-003-les-nombres/audio/`) ; nouveaux audios `<ID>_<usage><n>.mp3` (ex. `A1-E-003_q01.mp3`) — **les MP3 en ligne gardent leur nom** (principe 4). Mettre à jour `GUIDE_LEO-ET-MOI.md` (catalogue, gabarits, parcours, purge Math/Science) et purger `PENDING_TASKS.md` des items résolus.
**Fini quand :** GUIDE à jour, arborescence OneDrive alignée, Eric s'y retrouve.

### Plus tard (validé, non planifié)

- **Jalons & diplômes** : badge de semaine réussie, **diplôme imprimable** de fin de niveau — à activer quand le volume de contenu le justifiera. Design **Bleu & Corail du site** (PAS les couleurs CEFR) et formulation neutre : « a complété le niveau A1 du programme Leo-et-moi » — le CECRL est un référentiel public dont un programme privé ne peut se prévaloir comme d'une certification.
- **Mode hors-ligne (PWA)** : cache des leçons/audios du jour, progression synchronisée au retour du réseau (connexion rurale). Chantier réel, après la restructuration.
- **Statistiques par question** : agrégat anonyme des erreurs dans Firestore → repérer questions mal conçues et notions mal comprises, affiner l'échauffement adaptatif. Utile avec du volume.
- **Enregistrement audio par l'élève** : toujours conditionné à Firebase **Blaze + Cloud Storage** — signaler avant de construire. `js/speaking.js` est conçu pour l'accueillir.

---

## 6. Points de vigilance et limites connues

- **Poids du dépôt : 105 Mo / 591 MP3 pour ~15 contenus.** À l'échelle visée, l'audio dépassera la limite (~1 Go) de GitHub Pages. Deux décisions avant la production de masse (non bloquant pour ce plan) : voix (enregistrement manuel vs voix clonée payante type ElevenLabs — jamais de synthétique gratuit) et hébergement audio externe (ex. Cloudflare R2, gratuit à ce volume, domaine déjà chez Cloudflare). Le champ `audioBase` du catalogue prépare la bascule.
- **EmailJS : 200 e-mails/mois** — cassera silencieusement avec plus d'élèves → digest hebdomadaire le moment venu.
- **Firestore plan gratuit : pas de sauvegarde automatique.** Niveau de risque évalué avec Eric : **probabilité faible** (Firestore est répliqué et durable ; le risque réel est humain — script ou règle défectueuse, suppression accidentelle du projet), **impact modéré** (perte de la progression des élèves et des rédactions soumises — pas du site ni des audios, qui sont sur GitHub/OneDrive). Parade quasi gratuite : **export mensuel** des collections `users` et `progress` (petit script) — à instaurer.
- **Rotation du jeton GitHub** (backlog) : toujours d'actualité.

---

## 7. Instructions à l'exécutant

1. Lire `GUIDE_LEO-ET-MOI.md`, `WEBSITE_PROJECT_HANDOFF.md`, `PENDING_TASKS.md`, puis ce plan en entier.
2. Cloner le dépôt GitHub (source de vérité). Demander à Eric le jeton (PAT) pour pousser — **ne jamais l'écrire dans un fichier**.
3. Exécuter les phases **dans l'ordre** (sauf 5, 8, 10, avançables), une à la fois. Ne pas commencer une phase sans avoir vérifié la précédente en ligne.
4. Après chaque phase : mettre à jour « État d'avancement » ci-dessous et le signaler à Eric.
5. Doute pédagogique ou de contenu → demander à Eric (c'est lui qui décide du programme). Doute technique → l'option la plus simple qui respecte les principes du §0.

## État d'avancement

| Phase | Statut | Date | Notes |
|---|---|---|---|
| 0 — Fondation | ✅ Fait | 9/07/2026 | `catalog.json` + `js/catalog.js` + `tools/check_site.py` en ligne (commit 13151ac). Résidu `outb1.txt` supprimé. Vérifié : site inchangé, catalogue servi. **Trouvailles de l'audit** : 5 pages utilisent encore la voix synthétique (reference/×3, a2/ecoute-invitations, a1/index) — tolérées temporairement, décision d'Eric attendue (enregistrer ou retirer les boutons) ; `a1_resume.mp3` toujours à enregistrer (liste NOUVEAUX_AUDIOS). |
| 1 — Gabarits | ✅ Fait | 9/07/2026 | Commits 1f09df7 + 7c86c56. Créés : `css/site.css`, `js/audio.js`, `js/quiz.js`, `js/speaking.js`, `js/ui.js`, `_TEMPLATES/` (lecon, exercice, exercice-speaking + LISEZ-MOI). Les 9 copies du lecteur `playClip` supprimées → toutes ces pages utilisent `js/audio.js`. **Périmètre précisé** : (a) les pages Être/Avoir gardent leur lecteur propre (antérieures aux standards, à reconstruire sur gabarit plus tard) ; (b) le CSS des pages existantes reste inline (hétérogène) — `css/site.css` sert aux nouvelles pages et aux migrations futures (Phase 6). Vérifié en ligne : audio.js servi, page B1 exercices intacte. |
| 2 — Accueil/niveaux | ✅ Fait | 9/07/2026 | Commits f1aa91e + c1ab888. Les 6 pages de niveau (C2 créé) sont générées depuis le catalogue via `js/niveau.js` : compteurs « XX Leçons / XX Exercices », numérotation L1/E1…, badges de compétences, progression Firestore par exercice (`progressId` ajouté au catalogue). `mes-lecons.html` enrichi des compteurs. Accueil : 6 chips de niveaux avec compteurs (remplacent « Toutes mes leçons »), Phrase/Vocabulaire/Anatomie pilotés par `data/programme/semaine-01.json`, « Mes matières » supprimé, nav Français → menu des niveaux. La page A1 réécrite n'utilise plus de voix synthétique (reste 4 pages tolérées). Vérifié en ligne (HTML) ; **contrôle visuel + audio par Eric demandé**. Retours d'Eric traités (commit 51ccc34) : cartes Révision + Continuer retirées de l'accueil (reconstruites en Phases 4/6), minuterie globale retirée (revient par page en Phase 5), script d'enregistrement prof masqué pour tous sur Être/Avoir, course des compteurs mes-lecons corrigée. Compteurs validés par tests DOM (accueil + niveau) ; l'absence constatée par Eric = très probablement cache CDN (10 min). |
| 3 — Liens L↔E | ✅ Fait | 9/07/2026 | Commit b2383c0. Bandeau « 📖 revois la leçon » généré depuis le catalogue sur les 7 exercices rattachés à une leçon (Être, Avoir, Nombres A1, Plaques, Quiz A2, B1 & B2 interrogatifs — les bandeaux manuels B1/B2 ont été remplacés par la version générée). « ✏️ Exercices liés » sur les 4 leçons. `ui.js` en styles autonomes (aucune dépendance CSS imposée aux pages). Les 4 exercices sans leçon (lire-invitation, écoute-invitations, faire-part, Francine) n'affichent rien — le bandeau apparaîtra automatiquement dès que leur leçon sera créée et liée au catalogue. |
| 4 — Continuer | ✅ Fait | 9/07/2026 | Commit 0d295ef. Carte « ▶ Continuer » calculée : premier exercice non terminé du niveau de l'élève (Firestore + catalogue), score en cours affiché, « Niveau terminé 🎉 » si tout est fait, masquée pour le prof. Barre CECRL et compteur « x exercices complétés » au niveau réel (fin des placeholders A1 pour tous — priorité n°1 du backlog résolue). Bonus : « ↩ Revenir à l'exercice » sur les leçons ouvertes depuis un exercice (paramètre ?de=). Testé en simulation avec profils A1 et C1. |
| 5 — Minuterie | ✅ Fait | 10/07/2026 | Commits a81d62c + d0a576a. **Décision d'Eric (10/07)** : la minuterie visible est réservée aux **tests** (pages `data-timer="visible"`, Phase 7) — ni leçons ni exercices. Toutes les pages de contenu gardent le **chronomètre silencieux** : `dureeSec` enregistré avec le score à la complétion (lecture au tableau prof, Phase 8). Préférence élève `users/{uid}.timer` prête pour les tests. |
| 6 — Échauffement/révision | ✅ Fait | 10/07/2026 | Commits c2c9b4e + e340ff2. **Banques extraites (80 questions)** : A1 nombres (14), A2 quiz nombres (8), B1 interrogatifs (44), B2 interrogatifs (14) — questions de compréhension du dialogue marquées `contexte:"dialogue"` et exclues des tirages hors contexte. **Accueil** : ⚡ Échauffement adaptatif (question du niveau de l'élève, banques ≤ son niveau, graine par date, rotation 48 h, audio) + 🔁 Révision espacée (2 questions tirées uniquement des exercices déjà terminés ; masquée sinon). Repli statique hors connexion. Testé en simulation (élève B1). Être (24) et Avoir (24) extraits ensuite par analyse DOM (commit d0bb162) → **6 banques, 128 questions**. **Reste à extraire au fil de l'eau** : lire-invitation, écoute-invitations, faire-part, Francine (formats spécifiques). |
| 7 — Tests & examens | ✅ Fait | 10/07/2026 | Moteur générique piloté par le catalogue (`french/tests/test.html?id=…` + `js/test.js`) : une question à la fois, tirage équilibré entre les banques sources, options mélangées re-synchronisées, **chronomètre silencieux** (dureeSec enregistré), **compte à rebours optionnel** (`duree` en minutes, soumission douce à l'expiration), score en Firestore (`type: test`) + notification EmailJS auto. Section « 📝 Tests » sur les pages de niveau. Premier examen en ligne : **A1-T-001** (20 questions, sans limite). Créer un test = ajouter une entrée `tests` au catalogue, zéro code. Les tests de fin de semaine attendent la couche parcours (Phase 9) pour connaître les items d'une semaine. Le tableau prof affiche l'ID brut du test jusqu'à la Phase 8. |
| 8 — Suivi par compétence | ✅ Fait | 10/07/2026 | Commit e7e0d94. Tableau prof : **une barre par compétence** 🎧📖✍️🗣️ par élève (pourcentage agrégé des scores, croisé avec le champ `competences` du catalogue), titres et niveaux réels tirés du catalogue (les tests apparaissent avec 📝 et leur vrai nom au lieu de l'ID brut), **durées affichées** (`dureeSec` du chronomètre silencieux), repli e-mail quand `displayName` est vide (item du backlog). Testé en simulation. |
| 9 — Parcours & Ma journée | ✅ Fait | 10/07/2026 | Commit 096447a. `parcours.json` créé (**semaine 1 A1 proposée — à valider/modifier par Eric**). Carte « 📅 Ma journée » sur l'accueil : jour courant calculé sur la progression réelle, étapes du jour dans l'ordre du plan (⚡ → 📖 → ✏️ → 🔁), barre d'avancement de la semaine, CTA « Continue : … » sur le premier item à faire ; remplace « Continue » pour les élèves dont le niveau a un parcours (les autres gardent Continue). Tableau prof : « 📅 Semaine x · Jour y/z » par élève. Validation du parcours renforcée dans check_site. |
| 10 — OneDrive/GUIDE | ✅ Fait | 10/07/2026 | `_SOURCES` renommé selon la convention `<NIVEAU>/<ID>-<slug>/` (8 dossiers). `GUIDE_LEO-ET-MOI.md` réécrit (architecture 3 couches, mode d'emploi, standards à jour, minuterie tests-only, où trouver quoi). `PENDING_TASKS.md` purgé et réorganisé. Note « document historique » ajoutée en tête du HANDOFF (Math/Science abandonnés). |
