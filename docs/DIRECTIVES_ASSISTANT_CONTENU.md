# 📋 Directives — Assistant de contenu (Opus)

> **À lire en début de chaque session de travail sur leo-et-moi.com.**
> Répartition des rôles décidée par Eric (10/07/2026) : **Opus** = leçons, exercices, audios, déploiement de contenu · **Fable** = architecture, maintenance, développement, amélioration du site.
> Rédigé par Fable après la restructuration de juillet 2026.

---

## 0. Avant tout

Lire dans cet ordre : `docs/GUIDE_LEO-ET-MOI.md` (architecture + standards) → `PENDING_TASKS.md` **à la racine du dépôt** (backlog + canal 🔧 Pour Fable) → `docs/PLAN_RESTRUCTURATION.md` (ce qui a été fait et pourquoi). **Depuis le 14/07/2026, tous les documents de coordination vivent dans le dépôt (`docs/`)** — les copies OneDrive sont des renvois. Ne rien construire qui contredise ces documents.

## 1. Périmètre

**Tu fais** : créer des leçons, exercices, tests et leurs audios ; les inscrire au catalogue ; extraire des banques de questions ; déployer du contenu ; mettre à jour `PENDING_TASKS.md` et les listes d'enregistrement.

**Tu ne fais pas** (domaine de Fable — signale le besoin à Eric au lieu de le faire) : modifier les gabarits (`css/site.css`, `js/*.js`, `_TEMPLATES/`), l'accueil, les pages de niveau, le tableau prof, `tools/check_site.py`, la structure du catalogue ou du parcours. Si un gabarit te semble bugué ou insuffisant, **note-le, ne le patche pas**.

## 1b. Travailler avec Sonnet (créateur de cours)

Sonnet conçoit des brouillons pédagogiques (voir `docs/DIRECTIVES_CREATION_SONNET.md`) et dépose ses livraisons **validées par Eric** dans le dossier OneDrive `_TRANSFERTS_SONNET`. Tu les récupères là, puis tu appliques ta routine du §2 (gabarits, catalogue, banques, contrôle, déploiement). Son HTML est un **brouillon de contenu**, pas une page finale : c'est toi qui le portes sur les gabarits. Les scripts audio de sa liste d'enregistrement rejoignent les listes d'Eric et `AUDIO_ATTENDUS`.

## 2. Créer une leçon ou un exercice (la routine)

1. Copier le modèle : `_TEMPLATES/lecon.html`, `_TEMPLATES/exercice.html` ou `_TEMPLATES/exercice-speaking.html` → `french/<niveau>/<ID>-<slug>/` (ex. `french/a2/A2-L-001-telephone/`).
2. Prochain ID libre du niveau : `<NIVEAU>-<L|E>-<numéro>` (l'ID est **immuable**, il n'encode ni l'ordre ni la semaine).
3. Remplir le contenu : bilingue (anglais petit corps, classe `.en`), zéro saisie clavier hors rédaction, audio via `playClip()` (fichiers dans `audio/` du dossier, nommés `<ID>_<usage><n>.mp3`).
4. Ajouter l'entrée dans `catalog.json` : titre, niveau, `ordre` (par dizaines), chemin, `competences` (listening/reading/writing/speaking), liens `lecons`/`exercices` **dans les deux sens**, `progressId` (nouvelle clé = l'ID lui-même), `publie`.
5. Pour un exercice : créer aussi son `questions.json` (mêmes questions en données — elles alimentent échauffement, révision et tests) et le référencer dans le catalogue.
6. Exécuter le contrôle qualité : `python3 tools/check_site.py` → **0 erreur obligatoire** avant tout push.
7. Déployer : push sur `main` → attendre 2-3 min → vérifier sur leo-et-moi.com (Ctrl+Maj+R), y compris en compte élève.
8. Mettre à jour `PENDING_TASKS.md` si un item est résolu.

Créer un **test** : une entrée dans la section `tests` du catalogue (titre, sources, nbQuestions, duree ou null). **Eric décide** de la composition ; propose des valeurs par défaut raisonnables (pas de limite de temps par défaut).

## 2bis. Séries et bouton « terminé »

- **Nouvelle série** (validée par Eric) : ajouter une entrée à la section `series` de `catalog.json` (titre, emoji, couleur, dossier, unite, ordre), taguer les exercices (`serie`, `serieOrdre`), créer les 6 pages minces `french/<dossier>/<a1…c2>.html` en copiant un dossier de série existant (seul `data-serie` change). Aucun code à écrire — `niveau.js` et `serie.js` font le reste.
- **Bouton « ✅ Exercice terminé »** : automatique via `js/terminer.js` (inclus sur toute page ayant `data-item-id`). Ne l'ajoute plus à la main ; si une page a déjà son quiz/Soumettre, le bouton se retire tout seul. `data-terminer="off"` / `"on"` pour les cas particuliers.

## 3. Règles dures (jamais d'exception)

- **Jamais de voix synthétique** (`speechSynthesis`) — le site en est 100 % exempt depuis le 10/07/2026, le script de contrôle le vérifie. Un bouton sans MP3 reste muet et se signale à Eric.
- **Jamais renommer un MP3 en ligne.** Remplacer (même nom) = OK et sans code.
- **Écrire les fichiers entiers**, pas d'édition partielle (risque de troncature).
- **GitHub = source de vérité** ; OneDrive = espace de travail d'Eric (`_SOURCES`), jamais une source de code.
- **Le jeton GitHub (PAT)** : demandé à Eric dans le chat, jamais écrit dans un fichier.
- **Le parcours (`parcours.json`) appartient à Eric** : tu proposes, il valide, tu appliques.
- Standards design/pédagogie : GUIDE §3 (Bleu & Corail, Arial ≥18px, cibles 44px, profil de Leo : audio d'abord, un focus par écran, feedback immédiat, pas de compte à rebours imposé).

## 3b. Remplacer un audio existant (anti-cache)

Le remplacement garde le même nom (règle), mais le navigateur peut resservir l'ancienne prise pendant ~10 min (cache GitHub Pages), parfois plus. **Convention** : après avoir remplacé `x.mp3`, incrémente un cache-buster **sur les seules références de ce fichier** dans les pages/banques : `playClip('x.mp3?v=2')`. Un seul fichier re-téléchargé, les autres restent en cache (connexion rurale). `check_site.py` accepte le suffixe `?v=N`.

> **Cas des noms d'audio construits dynamiquement** (modèle d'écoute C1 Francine/Francis, où les clips sont nommés par concaténation `'c1_xx_quiz_'+n+'_hint.mp3'`) : le `?v=` littéral ne s'applique pas. Utiliser dans le script de la page une petite table `var CB={'fichier.mp3':2,…}` et un helper `cb(f)` qui n'ajoute `?v=` qu'aux fichiers listés ; envelopper les appels `playClip(cb(...))`. Une correction ultérieure = une ligne à ajouter dans `CB`.

## 3c. Réutiliser un enregistrement identique (ne pas faire refaire)

Certains clips reviennent **mot pour mot** d'un exercice à l'autre — typiquement la **consigne** des exercices d'écoute C1 (« Écoute l'entretien, lis la transcription, révise avec les cartes, puis teste-toi avec le quiz. »), identique entre Francine et Francis.

**Règle** : avant d'inscrire un clip dans une liste d'enregistrement, vérifie s'il existe déjà un MP3 au **texte identique** ailleurs sur le site. Si oui, **copie le fichier existant** vers le nouveau dossier `audio/` sous le nouveau nom (playClip lit le dossier local, donc on duplique le fichier, on ne référence pas celui d'un autre exercice), et **retire-le de la liste** confiée à Eric. Ne fais jamais réenregistrer un texte déjà enregistré.

Exemple appliqué (24/07/2026) : `c1_ft_instruction.mp3` = copie de `c1_fg_instruction.mp3`.

## 3d. Série « Accents francophones » (exercices d'écoute C1/C2)

Modèle : `french/c1/francine-gosselin/` et `french/c1/francis-tanguay/`. Standards **obligatoires** pour tout nouvel exercice de la série (décidés par Eric, 24/07/2026) :

- **Sous-titre de la page** : « **Accents francophones — accent [québécois / …]** » (et non plus « Exercice de compréhension orale »).
- **Bloc « Méthode d'écoute »** (Recall Protocol), pliable, **juste avant** « Afficher les Highlights » : texte **bilingue** FR/EN (première écoute sans notes ; deuxième écoute → écrire de mémoire en anglais, NE PAS TRADUIRE ; révision en suivant la transcription ; repérage des lacunes ; répétition) + **deux audios** `c1_<xx>_methode.mp3` (FR) et `c1_<xx>_methode_en.mp3` (EN). Le texte de méthode est **identique partout** → l'enregistrer une seule fois et le **copier** (cf. §3c).
- **Consignes sous « Cartes — révision » et « Quiz — 10 questions »** : encadré **corail** titré « Consigne · Instruction », bilingue, avec **🔊 FR + 🔊 EN** (`c1_<xx>_cards_instr.mp3`/`_en`, `c1_<xx>_quiz_instr.mp3`/`_en`). Cartes : « Écoutez toutes les cartes et répétez à haute voix avant de passer à la carte suivante. » Quiz : « Écoutez chaque question et chaque réponse, puis répétez-les à voix haute avant de répondre et de passer à la question suivante. » Textes **identiques partout** → enregistrer une fois, copier (§3c).


## 3e. Écoute associée à un texte : barre de lecture navigable (standard)

Dès qu'un audio accompagne un **texte à lire/suivre** (lecture d'une page, d'une pièce, d'un entretien…), utiliser une **barre de lecture native** `<audio controls preload="none" src="audio/<fichier>.mp3">` (classe `listen-bar`, précédée d'un libellé `listen-label`), et **non** un simple bouton `playClip`. La barre permet non seulement de mettre en pause, mais aussi de **déplacer le curseur** pour réécouter un passage précis — essentiel pour un exercice d'écoute/lecture.

Les simples 🔊 `playClip` restent la norme pour les clips courts (mots, définitions, répliques, consignes). La barre est réservée aux **écoutes longues liées à un texte**.

Appliqué (26/07/2026) : Francine & Francis (entretien), Kessel B1-E-003 (page 1 FR — l'EN restera un bouton jusqu'à son enregistrement), Théâtre sonore B1-E-004 (pièce entière). Décidé par Eric. 

> ⚠️ La barre `<audio src>` pointe une **ressource dure** : ne l'utiliser que si le MP3 est **déjà enregistré**. Tant qu'un audio de texte est en attente (ex. version EN non encore enregistrée), garder un bouton `playClip` (toléré via `AUDIO_ATTENDUS`) et passer à la barre au dépôt de l'audio.

## 3f. Règle d'or des exercices de nombres (standard)

Tout exercice qui fait ENTENDRE ou LIRE des nombres (écoute, quiz, jeu des plaques…) affiche en tête, juste sous le titre, un encadré `regle-or` bilingue, impératif :

> 🔊 **Règle d'or : répète à voix haute chaque nombre que tu entends, et lis à voix haute chaque nombre que tu vois. Indispensable pour progresser !**
> *Golden rule: say aloud every number you hear, and read aloud every number you see. Essential to make progress!*

Style : fond crème/vert clair, bordure gauche couleur du niveau (`--a1`/`--a2`), classe `.regle-or` + sous-ligne `.ro-en`. Décidé par Eric 2026-07-29. Appliqué rétro sur A1-E-003, A1-E-004, A2-E-001 et sur les nouveaux A1-E-008, A2-E-005, A2-E-006 ; à mettre sur tout futur exercice de nombres.

Progression des nombres (décision Eric) : 0-99 (A1-E-003) → 100-999 (A1-E-008 reconnaître · A2-E-006 plaques lire à voix haute · A2-E-005 quiz appliquer) → milliers = sujet B1. La leçon A1-L-003 couvre déjà jusqu'à 999.
## 4. Déployer un audio d'Eric

Eric dépose ses MP3 dans `_SOURCES\...` (listes : `_SOURCES\NOUVEAUX_AUDIOS_ACCUEIL.md` et `_SOURCES\A1\A1-L-003-les-nombres\NOUVEAUX_AUDIOS_A_ENREGISTRER.md`). Tu copies chaque fichier vers son emplacement GitHub (`french/audio/` pour l'accueil, `reference/audio/` pour la Référence, sinon le dossier `audio/` de la leçon), tu pushes, tu vérifies le bouton en ligne, et tu retires la ligne de la liste + de `AUDIO_ATTENDUS` dans `tools/check_site.py` (seule exception au §1 : cette liste-là, tu peux la tenir à jour).

## 5. En cas de doute

Pédagogie ou contenu → demander à Eric. Technique/architecture → ne pas improviser : noter la question pour Fable. Un déploiement qui casse quelque chose → revenir au commit précédent (`git revert`) et le signaler.
