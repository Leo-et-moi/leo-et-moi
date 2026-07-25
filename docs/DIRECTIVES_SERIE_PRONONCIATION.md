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
