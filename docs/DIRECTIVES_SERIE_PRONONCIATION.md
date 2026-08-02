# 🗣️ Directive — Série « PRO-NON-CIA-TION avec LÉO »

> Exercices de **lecture avec aide d'écoute** pour débutants (A1). Modèle de référence : `french/a1/A1-E-007-ratatouille/`. Toute nouvelle page de la série **doit** respecter cette directive. Standards fixés par Eric (25/07/2026), inspirés de « Les Yeux de Mona ».

## 1. En-tête (dans cet ordre)
1. Pastille de niveau (A1…).
2. **Titre de série** (grand) : « **PRO-NON-CIA-TION avec LÉO** » (sans le mot « Série »), suivi d'un **🔊** (audio du titre, `<ID>_titre.mp3`).
3. Sous-titre bilingue : « Exercice de lecture avec aide d'écoute · Reading exercise with listening support ».
4. **Titre du texte** (gras) : nom de l'œuvre — chapitre — **numéro de page** (aussi dans le titre de série, avec 🔊) (ex. « La Ratatouille Folle — Chapitre 1 : La Préparation · p. 3 »).

## 2. Consignes & titres
- **Toutes** les consignes sont bilingues (FR + EN) avec **🔊 FR et 🔊 EN**.
- **Les titres d'étapes sont bilingues** : « Place les accents / Add the missing accents to the passage », etc.

## 3. Codage couleur du texte (système « Mona »)
- **Accents** colorés par type : aigu (jaune), grave (rose), circonflexe (turquoise), tréma (violet), **cédille (orange — nettement distincte du jaune de l'aigu)**.
- **Lettres muettes** : **vert GRAS** — uniquement les **consonnes finales** muettes ; **ne pas** marquer le « e » muet final (comme Mona).
- **Liaison** : la consonne de liaison **et le signe ‿** en **rouge GRAS**.
- **Mot difficile** : **orange** avec la prononciation entre crochets, y compris les liaisons figées (ex. « les‿yeux [zieu] »).
- **Bloc pliable « Consigne · Instruction »** : contient, pour chaque groupe (aigu, grave, circonflexe, tréma, cédille, lettre muette, liaison, mot difficile), le **texte explicatif + un 🔊 FR**, avec un bouton **Afficher / Show ↔ Masquer / Hide** (bilingue). La **légende** en tête ne garde que les **pastilles de couleur** (repère visuel), **sans audio**.

## 4. Étape 1 — Placer les accents (sans clavier)
- Le texte affiche **déjà** tout le codage (vert/rouge/orange) ; seuls les **accents** sont à poser.
- **Tap-to-cycle** : taper une lettre la fait défiler (e → é → è → ê…). **Zéro clavier**.
- **Départ aléatoire** : au chargement, chaque lettre démarre sur un accent **différent du bon** (le bon accent ne doit jamais apparaître en premier).
- Boutons **Vérifier** (vert/rouge) et **Correction**.

## 5. Étape 2 — Lire en écoutant
Texte **entièrement codé** (accents + muettes + liaisons + mots difficiles) au-dessus du lecteur audio (▶ / ⏸). Consigne : ne pas prononcer les lettres vertes, **prononcer la liaison rouge (‿)** ; rappeler que **l'orange signale les mots difficiles**.

## 6. Étape 3 — S'enregistrer
Enregistrement navigateur (MediaRecorder), réécoute, **téléchargement** du clip → l'élève l'envoie au professeur (pas de stockage serveur).

## 7c. Bouton « Exercice terminé »
À la fin de l'exercice, un bouton bilingue **« ✅ Exercice terminé — clique ici / Exercise finished — click here »** appelle `window.LEM.setLesson(progressId,{completed:true})` pour **notifier le professeur** (ces exercices n'ont pas de quiz noté). Le `progressId` doit avoir un libellé dans `LESSON_NAMES` (auth-guard.js).

## 7. Étape 4 — Exercices dynamiques (auto-corrigés)
Sur le modèle Mona : **A.** muet/prononcé · **B.** liaisons : *placer le signe ‿* et trouver le son (z/t/n) · **C.** liaison obligatoire/interdite/facultative · **D.** homophones · **E.** mots difficiles (référence, avec les liaisons figées comme « yeux [zieu] ») — **chaque mot a un 🔊** (y compris « yeux »).

## 7b. Regroupement dans le niveau
La série est **regroupée** dans une **catégorie dédiée** de la page de niveau (comme « 💬 Dialogue »), avec **fond de couleur différencié** (`--pronunciation`, teal) et une **page-dossier** `/french/prononciation/<niveau>.html`. Côté catalogue : `serie:"Prononciation"` + `serieOrdre`.

## 8. Audio
- Audio du texte : **128 kbps mono**.
- Consignes + libellés de légende : clips **FR** enregistrés par Eric (nommage `A1-E-007_…` : `titre` pour le titre, `intro/e1..e4` pour les consignes, `leg_aigu/…/leg_difficile` pour la légende).

---

## 9. Réplication d'un chapitre — procédure (Sonnet)

> **But** : à partir de **(a)** l'audio du chapitre (`ratatouille_chN.mp3`, enregistré par Eric) et **(b)** le transcript brut (texte + n° de page), produire une livraison complète dans `_TRANSFERTS_SONNET`, **sans toucher au HTML ni aux audios**. Un nouveau chapitre = un **nouvel exercice** (nouvel ID, nouveau dossier) ; Opus l'intègre. Cette procédure rend la réplication fiable et répétable.

### 9.1 Étapes, dans l'ordre
1. **En-tête** : niveau A1 · titre = « **La Ratatouille Folle — Ch.N : \<sous-titre\> · p. \<n\>** » · auteur/source (sous-titre + page tirés du transcript).
2. **Coder le texte** mot par mot (9.2), **en écoutant l'audio** pour trancher les liaisons réellement faites.
3. **Choisir les liaisons** (guide 9.3) et **les mots difficiles** (critères 9.4).
4. **Construire les 5 blocs d'exercices** (§7 A→E) **avec les bonnes réponses**, en tirant les items **du texte du chapitre**.
5. **Auto-contrôle** (checklist 9.5).
6. **Liste d'enregistrement** (9.6) : ne lister que le **nouveau**.
7. Déposer dans `_TRANSFERTS_SONNET`.

### 9.2 Balisage du texte (avec exemples réels du Ch.1)
- **Accents** : vrais caractères `é è ê ë ç`. Ne rien baliser — le moteur colore selon le caractère.
- **Consonne finale muette** : `{x}` — `françai{s}`, `ver{ts}`, `son{t}`, `long{s}`, `étudiant{s}`. **Jamais** le « e » muet final ; ne marquer que ce qui est **réellement muet** (pas le t prononcé de « active »).
- **Liaison** : `…^C‿^mot` — la consonne de liaison du 1er mot est précédée d'un `^`, puis le pont `‿`, puis `^` collé au mot suivant. Ex. `nou^s‿^avon{s}`, `le^s‿^<yeux|zieu>`, `e^n‿^<échange|é·chanj>`, `Me^s‿^<yeux|zieu>`.
- **Mot difficile** : `<mot|pro·non·cia·tion>` — prononciation en **phonétique française simplifiée** (pas l'API), syllabes séparées par `·`. Ex. `<yeux|zieu>`, `<échange|é·chanj>`.
- Un mot peut cumuler liaison + difficulté : `le^s‿^<yeux|zieu>`.

### 9.3 Guide des liaisons (lesquelles coder, quel son)
- **Obligatoires (à coder)** : déterminant + nom (`le^s‿^amis`, `un‿^ami`, `me^s‿^yeux`) ; pronom sujet + verbe (`nou^s‿^avons`, `il^s‿^ont`, `on‿^a`) ; adjectif antéposé + nom (`de petit^s‿^enfants`) ; préposition/adverbe monosyllabique + mot (`e^n‿^échange`, `san^s‿^elle`, `che^z‿^eux`, `trè^s‿^aimable`).
- **Interdites (ne pas coder)** : après **et** (jamais) ; après un **nom singulier** ; devant un **h aspiré** (`les / héros`) ; après une ponctuation forte / une pause.
- **Facultatives** : après le verbe **être** (`il est‿allé`), verbe + complément. **En cas de doute, ne pas coder et laisser une note « liaison ? » pour Eric.**
- **Règle d'or** : trancher **à l'oreille** sur l'audio — ne coder **que** les liaisons **effectivement prononcées** par Eric.
- **Son de la liaison** (sert au bloc B) : `s, x, z → « z »` · `d → « t »` · `t → « t »` · `n → « n » (nasale)` · `g → « k »`.

### 9.4 Critères « mot difficile »
Mots dont la graphie **trompe** un lecteur A1 : `yeux→zieu`, `sœur→seur`, `aujourd'hui→o·jour·dwi`, `femme→fam`, `monsieur→me·sieu`, `second→se·gon`, `oignon→o·gnon`, plus les **liaisons figées** (`les‿yeux [zieu]`). Viser **~1 mot difficile toutes les 2-3 lignes** — ne pas surcharger. Chaque mot difficile aura son 🔊 (`A1-E-<ID>_md_<mot>.mp3`).

### 9.5 Auto-contrôle avant livraison (checklist)
- [ ] Chaque consonne finale muette est en `{}` ; **aucun** « e » muet final marqué.
- [ ] Chaque liaison codée est **entendue** dans l'audio ; **aucune** liaison après « et ».
- [ ] Chaque `<mot|pron>` a une prononciation en syllabes `·`, phonétique française (pas l'API).
- [ ] Les 5 blocs (A→E) ont leurs **bonnes réponses**, items tirés **du texte**.
- [ ] En-tête : titre = Œuvre — Ch.N : sous-titre · p. n (+ auteur/source).
- [ ] **Texte affiché = texte dit** : le script de chaque audio correspond **mot pour mot** à ce qui est affiché.
- [ ] Liste d'enregistrement = **seulement le nouveau** (9.6).

### 9.6 Nouveau vs Réutilisé par chapitre (ne pas faire réenregistrer)
**Réutilisé** — Opus copie sous le nouvel ID (dir. Opus §3c), **ne pas** le mettre dans la liste d'Eric :
- les **5 consignes** `intro, e1, e2, e3, e4` (identiques à chaque chapitre) ;
- **toute la légende** `leg_aigu, leg_grave, leg_circ, leg_trema, leg_cedille, leg_muet, leg_liaison, leg_difficile` ;
- tout **mot difficile déjà enregistré** dans un chapitre précédent (même mot = même son : `md_yeux`, etc.).

**Nouveau** — à enregistrer par Eric (128 kbps mono) :
- `ratatouille_chN.mp3` — l'audio du texte du chapitre ;
- `A1-E-<ID>_titre.mp3` — le titre parlé (change : il contient le chapitre + la page) ;
- `A1-E-<ID>_md_<mot>.mp3` — **uniquement** les mots difficiles **inédits** de ce chapitre.

En pratique, la liste d'enregistrement d'un chapitre tient en quelques lignes.
