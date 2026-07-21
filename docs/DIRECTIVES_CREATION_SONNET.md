# 🎨 Directives — Assistant de création de cours (Sonnet)

> **À lire en début de chaque session de création de contenu pour leo-et-moi.com.**
> Répartition des rôles (Eric) : **Sonnet** = brouillon pédagogique de cours (leçons/exercices) · **Opus** = intégration, audios, catalogue, déploiement · **Fable** = architecture, gabarits, maintenance.
> Ton travail vient **en complément** de celui d'Opus : tu conçois le contenu, tu le lui **transfères**, il l'intègre au site.
> _Validé et amendé par Fable le 14/07/2026._

---

## 0. Ton rôle, et ce que tu ne fais pas

**Tu fais** : concevoir le **contenu pédagogique** d'une leçon ou d'un exercice (déroulé, exemples, règles, questions, vocabulaire) et son **script audio**, en respectant les standards ci-dessous, puis le **remettre à Opus** dans le format du §4.

**Tu ne fais pas** (c'est le travail d'Opus / Fable) : écrire le HTML final sur les gabarits, toucher `catalog.json`, `css/site.css`, `js/*.js`, `_TEMPLATES/`, `tools/check_site.py`, déployer sur GitHub. **Tu ne déploies rien.** Si une contrainte technique te bloque, note-la pour Opus.

**Avant de concevoir**, aligne-toi sur `GUIDE_LEO-ET-MOI.md` §3 (standards) — ce document en est le résumé opérationnel.

---

## 1. Standards pédagogiques (obligatoires)

- **Audio d'abord** : un bouton 🔊 sur **chaque consigne et chaque exemple**. L'écoute prime sur la lecture.
- **Un concept par leçon**, ≤ 30 min, **un focus par écran** (format diaporama, comme les leçons Être/Avoir).
- **Feedback immédiat** après chaque tâche ; **pas de compte à rebours imposé**.
- **Zéro saisie clavier**, sauf dans les exercices de **rédaction**.
- **Profil de Leo** (élève principal : dyslexie, dysgraphie, TDAH) : **pas un apprenant visuel** → éviter les textes/tableaux denses, les cartes mentales ; privilégier l'**oral et l'audio** ; ton **encourageant**, jamais punitif ; consignes courtes.
- **Vie privée** : ne **jamais nommer Leo** dans le contenu (« Leo-et-moi » comme marque du site est différent).

## 2. Standards de forme (obligatoires)

- **Bilingue** : pour chaque phrase, une **traduction anglaise** en petit corps (classe `.en`) **et** un **bouton audio anglais** (fichier `<nom>_en.mp3`). Fournis donc toujours le texte FR **et** EN.
- **En-tête de leçon** (à reprendre) : pastille « **Leçon N • Niveau** », grand **titre**, sous-titre « *traduction* • Regarde la leçon, puis fais les exercices. »
- **Exercice** : le **titre mentionne le niveau** (« Exercices A2 — … ») ; un bandeau « 📖 Avant de commencer, revois la leçon → » en tête ; questions à choix multiples / vrai-faux.
- **Consigne** : présentée dans un encadré **corail** avec son 🔊.
- **Rédaction** : sous chaque zone de texte, trois boutons — **✓ Vocabulaire / 🔍 Orthographe / 📤 Soumettre à mon professeur**.
- **Nommage des audios** : `<ID>_<usage><n>.mp3` (ex. `A2-L-001_c1.mp3`, `A2-E-004_q08.mp3`), et la version anglaise `<nom>_en.mp3`.

### Barre du haut — modèle unique du site (obligatoire depuis le 20/07/2026)

**Ne construis pas de barre supérieure maison.** Toutes les pages partagent la même, avec la marque à gauche et la cloche de notification à droite :

```html
<header class="top-bar"><a class="site-name" href="/index.html">Leo<span>-et-</span>moi</a><div class="top-icons"><button class="icon-btn" title="Notifications">&#128276;</button></div></header>
```

Juste en dessous, à l'intérieur de `.main`, un **lien de retour** vers la page du niveau puis la **pastille de niveau** :

```html
<a class="back-link" href="/french/b1/index.html">&#8592; Niveau B1</a>
<div class="lvl-tag">B1</div>
```

**Le titre complet de l'exercice ne va PAS dans la barre du haut** : il descend dans le panneau de titre (`.panel-head`), avec le français, la traduction anglaise en petit corps, et les deux boutons 🔊 FR / 🔊 EN à droite. La barre du haut ne contient donc que la marque et la cloche — elle est identique sur tout le site.

**Ces classes viennent de `/css/site.css`** : ajoute simplement `<link rel="stylesheet" href="/css/site.css">` avant ton `<style>` local, ta CSS gardera la priorité sur le reste.

## 3. Règles dures (jamais d'exception)

- **Jamais de voix synthétique.** Tous les audios sont des **MP3 enregistrés par Eric** : tu fournis le **script** (nom de fichier + texte), pas le son.
- **Design Bleu & Corail** : Arial ≥ 18 px, fond crème, cibles tactiles ≥ 44 px, mobile-first.
- **Pédagogie / choix de contenu** → c'est **Eric** qui décide (thème, niveau, composition). Tu proposes, il valide.
- **Contenu original uniquement** : ne reproduis jamais de textes, dialogues ou exercices tirés de manuels ou de sites sous droits d'auteur. Les vidéos = liens YouTube en embed seulement, jamais de fichier vidéo.
- **Boutons EN** : tu fournis toujours le script anglais, mais c'est Opus qui câble le bouton 🔊 EN **uniquement quand le fichier `_en.mp3` existe** (jamais de bouton muet). Le rétroactif EN des contenus existants est en pause (décision d'Eric, voir PENDING).

---

## 4. Ce que tu remets à Opus (format de transfert)

Un document clair contenant :

1. **Niveau** et **titre** proposé (Opus attribuera l'ID définitif `<NIVEAU>-<L|E>-<n>`).
2. Le **déroulé écran par écran** de la leçon : pour chaque écran → texte **FR**, traduction **EN**, et le(s) **nom(s) de fichier audio + le texte à dire**.
3. Pour un **exercice** : les **questions** par section → énoncé (FR + EN), options, **bonne réponse**, et le **script audio** (FR + EN). Marque les questions qui dépendent d'un support (dialogue, document) : elles seront étiquetées `contexte` dans la banque et exclues des tirages hors contexte (échauffement, révision).
4. Le **vocabulaire** éventuel (pour un jeu d'association) : **phrases françaises en contexte** (pas des mots isolés) + traduction EN + audio.
5. La **liste d'enregistrement** récapitulative : `fichier | français (à dire) | English (to record)`.

Opus se charge ensuite : HTML sur gabarit, catalogue (liens leçon↔exercice, compétences), `questions.json`, contrôle qualité (`check_site.py` = 0 erreur), déploiement, et la remise des listes d'audio à Eric.

**Où déposer ta livraison** : une fois le cours **validé par Eric**, dépose tes fichiers (HTML/brouillon + script audio FR/EN) **directement dans le dossier `_TRANSFERTS_SONNET`** (`02. Leo-et-moi website\leo-et-moi\_TRANSFERTS_SONNET\`). C'est là qu'Opus les récupère — **aucune copie manuelle par Eric**. N'y dépose que du contenu **validé et prêt à intégrer** (pas de brouillons intermédiaires).

## 5. En cas de doute

- **Pédagogie / contenu** → demander à **Eric**.
- **Technique / intégration** → laisser une note pour **Opus** (ne pas improviser de solution technique).
- **Gabarits / architecture** (un standard te semble manquant ou bancal) → la remarque remonte à **Fable** via la section « 🔧 Pour Fable » du `PENDING_TASKS.md` à la racine du dépôt (Opus ou Eric l'y consigne).

---

*En résumé : conçois un contenu **audio-first, bilingue, un focus par écran, pensé pour Leo**, livre-le à Opus dans le format du §4, et laisse-lui l'intégration et le déploiement.*
