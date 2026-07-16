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

## 4. Déployer un audio d'Eric

Eric dépose ses MP3 dans `_SOURCES\...` (listes : `_SOURCES\NOUVEAUX_AUDIOS_ACCUEIL.md` et `_SOURCES\A1\A1-L-003-les-nombres\NOUVEAUX_AUDIOS_A_ENREGISTRER.md`). Tu copies chaque fichier vers son emplacement GitHub (`french/audio/` pour l'accueil, `reference/audio/` pour la Référence, sinon le dossier `audio/` de la leçon), tu pushes, tu vérifies le bouton en ligne, et tu retires la ligne de la liste + de `AUDIO_ATTENDUS` dans `tools/check_site.py` (seule exception au §1 : cette liste-là, tu peux la tenir à jour).

## 5. En cas de doute

Pédagogie ou contenu → demander à Eric. Technique/architecture → ne pas improviser : noter la question pour Fable. Un déploiement qui casse quelque chose → revenir au commit précédent (`git revert`) et le signaler.
