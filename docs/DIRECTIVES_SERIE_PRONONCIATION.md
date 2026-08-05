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

> **But** : à partir de **(a)** l'audio du chapitre (`ratatouille_chN.mp3`, enregistré par Eric) et **(b)** le transcript brut (texte + n° de page), produire une livraison complète dans `_TRANSFERTS_SONNET`, **sans toucher au HTML ni aux audios**. **Unité = la PAGE, pas le chapitre.** Un chapitre s'étale sur plusieurs pages ; **un exercice = une page**. Le n° de chapitre et son sous-titre restent tant qu'on ne change pas de chapitre ; c'est la **page** qui avance (ex. après « Ch.1 : La Préparation · p. 3 » vient « Ch.1 : La Préparation · p. **4** » — **même** chapitre). **Ne jamais confondre n° de chapitre et n° de page.** Chaque page = un **nouvel exercice** (nouvel ID, nouveau dossier) ; Opus l'intègre.

### 9.1 Étapes, dans l'ordre
1. **En-tête** : niveau A1 · titre = « **La Ratatouille Folle — Ch.\<C\> : \<sous-titre\> · p. \<P\>** » · auteur/source. `C` = n° de **chapitre**, `P` = n° de **page** — deux nombres **distincts**, tirés du transcript ; ne les intervertis pas.
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
- [ ] En-tête : titre = Œuvre — Ch.\<C\> : sous-titre · p. \<P\> (+ auteur/source) — **chapitre ≠ page**, non intervertis.
- [ ] **Texte affiché = texte dit** : le script de chaque audio correspond **mot pour mot** à ce qui est affiché.
- [ ] Liste d'enregistrement = **seulement le nouveau** (9.6).

### 9.6 Nouveau vs Réutilisé par chapitre (ne pas faire réenregistrer)
**Réutilisé** — Opus copie sous le nouvel ID (dir. Opus §3c), **ne pas** le mettre dans la liste d'Eric :
- les **5 consignes** `intro, e1, e2, e3, e4` (identiques à chaque chapitre) ;
- **toute la légende** `leg_aigu, leg_grave, leg_circ, leg_trema, leg_cedille, leg_muet, leg_liaison, leg_difficile` ;
- tout **mot difficile déjà enregistré** dans un chapitre précédent (même mot = même son : `md_yeux`, etc.).

**Nouveau** — à enregistrer par Eric (128 kbps mono) :
- `ratatouille_ch<C>_p<P>.mp3` — l'audio du texte **de cette page** (l'existant `ratatouille_ch1.mp3` = Ch.1 p.3, conservé tel quel ; toute nouvelle page **inclut la page** dans le nom pour éviter les collisions) ;
- `A1-E-<ID>_titre.mp3` — le titre parlé (change : il contient le chapitre + la page) ;
- `A1-E-<ID>_md_<mot>.mp3` — **uniquement** les mots difficiles **inédits** de ce chapitre.

En pratique, la liste d'enregistrement d'un chapitre tient en quelques lignes.

### 9.7 Exigences techniques de la PAGE (pour zéro reprise)

> Depuis **A1-E-009**, Sonnet livre la **page HTML complète** (forme « menu » 5 étapes, validée par Eric). Les points ci-dessous sont les corrections réellement faites à la 1re intégration — les respecter STRICTEMENT évite toute reprise.

**Scripts partagés & connexion** — inclure avant `</body>` : `<script type="module" src="/js/auth-guard.js"></script>` (garde de connexion + `window.LEM`). Bouton « terminé » = **standard du site** : mettre `data-item-id="[[ID]]"` sur `<body>` + `<script type="module" src="/js/terminer.js"></script>`. **NE PAS** coder de bouton « terminé » maison ni de `progressId` inventé (pas de `setLesson('A1-PRO-…')`). `[[ID]]` = placeholder qu'Opus remplace par l'ID définitif.

**Boutons audio EN** — n'ajouter AUCUN bouton 🔊 EN tant que le MP3 `_en` n'existe pas (sinon bouton muet + échec du contrôle qualité). Fournir le **texte** EN (bilingue), pas le bouton. Opus câblera l'EN quand l'audio existera.

**Mot interdit dans le fichier** — ne jamais écrire « speechSynthesis » ni « speak() », **même en commentaire** : le contrôle qualité rejette la chaîne littérale. Écrire « aucune voix synthétique ».

**Consignes canoniques (verbatim, identiques à chaque chapitre — ne pas réécrire)** :
- Bandeau légende (pliable, **corail/rouge**, pas gris pâle) : « 🔊 Consigne · Instruction — écouter les accents · **Afficher / Show ▾** » ↔ « **Masquer / Hide ▴** ».
- Étape 1 : « À toi de placer les accents : tape sur chaque lettre colorée, elle change (e → é → è → ê…). Arrête-toi sur le bon accent, puis clique sur « Vérifier ». Pas besoin de clavier ! Les autres couleurs sont déjà là (vert = pour les lettres muettes, rouge = pour les liaisons). » + EN.
- Étape 2 : « Écoute l'audio (▶ / ❙❙) et lis à haute voix en même temps. Ne prononce pas les lettres vertes. Prononce la liaison rouge (‿). Les accents colorés t'aident à bien prononcer. La couleur orange signale les mots difficiles. » + EN (emphase couleur muet/liaison/orange).
- Étape 3 (enregistrement) : enregistre / réécoute / **télécharge et envoie à ton professeur** + bouton « Exercice terminé » (via terminer.js). **Aucun upload audio** (pas de plan Blaze).
- Les 8 lignes de légende (aigu, grave, circonflexe, tréma, cédille, muette, liaison, mot difficile), chacune avec son 🔊, sont également fixes.

**Palette couleur (variables, teintes FONCÉES harmonisées 2026-08)** — utiliser les variables, jamais du hex en dur dans le texte :
`--aigu:#B8820A; --grave:#B5367A; --circ:#1A8A7A; --trema:#7B3FB5; --cedille:#E8503A; --muet:#1E7B45; --liaison:#C0392B; --diff:#C4640A`.

**Nommage audio** — nouveaux fichiers en préfixe **page** : `ratatouille_ch<C>_p<P>.mp3` (texte), `p<P>_titre.mp3`, `p<P>_md_<mot>.mp3`, `p<P>_hom_<mot>.mp3`. Réutilisés : garder les noms `A1-E-007_*` (Opus les copie). Réfs du HTML, fichiers déposés et liste d'enregistrement doivent être **strictement cohérents** entre eux.

**Liaisons** — vérifier CHAQUE liaison à l'oreille sur l'audio ; ne coder que celles réellement prononcées ; lister à part, pour Eric, toute liaison douteuse.

### 9.8 Leçon parente (2026-08-05)
La série a désormais une **leçon parente** : **A1-L-000 « L'alphabet et la prononciation »** (`french/a1/00-alphabet/`). Chaque exercice de la série (présent et à venir) porte en tête le bandeau **« 📖 Avant de commencer, revois la leçon → L'alphabet et la prononciation »** (lien vers `/french/a1/00-alphabet/index.html`) et, au catalogue, `lecons:["A1-L-000"]` — **lien bidirectionnel obligatoire** : ajouter aussi l'exercice à `A1-L-000.exercices` (sinon `check_site` signale un lien asymétrique). Appliqué à A1-E-007 et A1-E-009.
