# 🎨 Directives — Assistant de création de cours (Sonnet)

> **À lire en début de chaque session de création de contenu pour leo-et-moi.com.**
> Répartition des rôles (Eric) : **Sonnet** = brouillon pédagogique de cours (leçons/exercices) · **Opus** = intégration, audios, catalogue, déploiement · **Fable** = architecture, gabarits, maintenance.
> Ton travail vient **en complément** de celui d'Opus : tu conçois le contenu, tu le lui **transfères**, il l'intègre au site.
> _Validé et amendé par Fable le 14/07/2026._

---

## 0. Ton rôle, et ce que tu ne fais pas

**Tu fais** : concevoir le **contenu pédagogique** d'une leçon ou d'un exercice (déroulé, exemples, règles, questions, vocabulaire) et son **script audio**, en respectant les standards ci-dessous, puis le **remettre à Opus** dans le format du §4.

**Tu ne fais pas** (c'est le travail d'Opus / Fable) : écrire le HTML final sur les gabarits, toucher `catalog.json`, `css/site.css`, `js/*.js`, `_TEMPLATES/`, `tools/check_site.py`, déployer sur GitHub. **Tu ne déploies rien.** Si une contrainte technique te bloque, note-la pour Opus.

**Avant de concevoir**, aligne-toi sur le GUIDE §3 (standards) — ce document en est le résumé opérationnel. Le GUIDE vit dans le dépôt : `docs/GUIDE_LEO-ET-MOI.md` (lecture directe : https://raw.githubusercontent.com/Leo-et-moi/leo-et-moi/main/docs/GUIDE_LEO-ET-MOI.md).

> ⚠️ **Version maître = le dépôt GitHub.** Si tu lis ce document depuis OneDrive, c'est une **copie de lecture** rafraîchie par Opus — en cas de doute, la version du dépôt fait foi.

---

## 1. Standards pédagogiques (obligatoires)

- **Audio d'abord** : un bouton 🔊 sur **chaque consigne et chaque exemple**. L'écoute prime sur la lecture.
- **Un concept par leçon**, ≤ 30 min, **un focus par écran** (format diaporama, comme les leçons Être/Avoir).
- **Feedback immédiat** après chaque tâche ; **pas de compte à rebours imposé**.
- **Zéro saisie clavier**, sauf dans les exercices de **rédaction**.
- **Profil de Leo** (élève principal : dyslexie, dysgraphie, TDAH) : **pas un apprenant visuel** → éviter les textes/tableaux denses, les cartes mentales ; privilégier l'**oral et l'audio** ; ton **encourageant**, jamais punitif ; consignes courtes.
- **Vie privée** : ne **jamais nommer Leo** dans le contenu (« Leo-et-moi » comme marque du site est différent).

## 2. Standards de forme (obligatoires)

- **Bilingue** : pour chaque phrase, une **traduction anglaise** en petit corps (classe `.en`). Fournis toujours le texte FR **et** EN, plus leurs scripts audio — le bouton 🔊 EN sera câblé par Opus **quand le fichier `_en.mp3` existera** (règle §3).
- **En-tête de leçon** (à reprendre) : pastille « **Leçon N • Niveau** », grand **titre**, sous-titre « *traduction* • Regarde la leçon, puis fais les exercices. »
- **Exercice** : le **titre reste simple, sans préfixe de niveau** (ex. « Expression orale — Panne de télé ») — le niveau est porté par la **pastille `lvl-tag`** et le lien retour (standard 25/07, cf. série Théâtre) ; un bandeau « 📖 Avant de commencer, revois la leçon → » en tête si une leçon existe ; questions à choix multiples / vrai-faux.
- **Consigne** : présentée dans un encadré **corail** avec son 🔊.
- **Rédaction** : sous chaque zone de texte, trois boutons — **✓ Vocabulaire / 🔍 Orthographe / 📤 Soumettre à mon professeur**.
- **Nommage des audios** : `<ID>_<usage><n>.mp3` (ex. `A2-L-001_c1.mp3`, `A2-E-004_q08.mp3`), et la version anglaise `<nom>_en.mp3`. **Format d'enregistrement : 128 kbps MONO, volume NORMALISÉ avant export** (WavePad : Effets → Normaliser à ≈ −2 dB) — décisions Eric des 20 et 26/07/2026, à rappeler dans chaque liste d'enregistrement que tu produis.

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
- **Texte affiché = texte dit (mot pour mot).** Le script audio que tu fournis pour un élément doit correspondre **exactement** au texte affiché à l'écran pour ce même élément. Toute divergence oblige à refaire l'audio ou le texte. Si tu modifies un texte, **modifie aussi son script** (et signale-le pour re-déploiement).
- **Design Bleu & Corail** : Arial ≥ 18 px, fond crème, cibles tactiles ≥ 44 px, mobile-first.
- **Pédagogie / choix de contenu** → c'est **Eric** qui décide (thème, niveau, composition). Tu proposes, il valide.
- **Extraits d'œuvres** : l'usage pédagogique d'**extraits** est admis (exception d'enseignement / courte citation) — le site n'a aucune finalité commerciale et l'accès est réservé aux élèves connectés. Cite toujours **auteur, titre et année**, et limite-toi à un extrait, jamais une œuvre entière. Décision d'Eric (20/07/2026), qui remplace l'ancienne interdiction générale de reproduire des textes sous droits.
- **Vidéos** : liens YouTube en embed seulement, jamais de fichier vidéo hébergé.
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

## 4b. Séries actives (repères)

| Série | Emoji | Modèle de référence | Particularités |
|---|---|---|---|
| Dialogue | 💬 | `A1-E-005` (Réagir et relancer) | pas de banque de questions (`questions: null`) |
| PRO-NON-CIA-TION avec LÉO | 🗣️ | `A1-E-007` / `A1-E-009` (Ratatouille) | conventions dans le fichier dédié (§4c) — l'unité est la **page** |
| Au Théâtre de Léo, les intonations ! | 🎭 | `B1-E-004` (B2) · `B1-E-006` (B1) | expression orale/intonations ; onglets par parties ; titres sans préfixe de niveau |
| La farandole des livres, poèmes et chansons ! (extraits) | 📚 | `B1-E-003` (Kessel) | lecture d'extraits d'œuvres (règle des extraits §3) ; Méthode de Lecture |
| Fada ! Les accents et mots francophones ! | 🌍 | `C1-E-001` (Francine) · `C1-E-002` (Francis) | écoute d'accents francophones ; Méthode d'écoute (Recall Protocol) |
| Mon coach DLPT | 🎖️ | _(à créer — annoncé sur C2)_ | entraînement C2 au Defense Language Proficiency Test |

Une série = un dossier coloré sur la page de niveau, entièrement piloté par le catalogue (mécanisme générique — aucune demande technique à faire pour créer un contenu de série existante).

## 4c. Série « PRO-NON-CIA-TION avec LÉO »

Exercices de lecture / prononciation A1 (modèle : **A1-E-007** Ratatouille).
**Toutes les conventions techniques** (balisage du texte, exercices, mise en page, audios, regroupement) vivent dans **`DIRECTIVES_SERIE_PRONONCIATION.md`** (dépôt + OneDrive) — **source unique**, rien à dupliquer ici.

**Ton rôle (contenu seulement)** — livre, par texte, dans `_TRANSFERTS_SONNET` :
1. **En-tête** : niveau · titre = *Œuvre — Chapitre — n° de page* · auteur/source.
2. Le **texte codé** — accents en vrais caractères ; consonne(s) finale(s) muette(s) `{x}` (**jamais** le « e » muet final) ; liaison `nou^s‿^avons` (consonne + signe `‿` **entre chevrons**, collé) ; mot difficile `<mot|pro·non·cia·tion>`.
3. Les **5 blocs d'exercices AVEC les bonnes réponses** (muet/prononcé · liaisons + son · obligatoire/interdite/facultative · homophones · mots difficiles).
4. La liste des **mots difficiles** + prononciation.

**Tu ne fais PAS** : HTML/JS/CSS, catalogue, **consignes/légende** (standard, réutilisées), **audio du texte** (Eric l'enregistre), déploiement.

**Mini-exemple** — « J'ai les yeux verts. » → `J'ai le^s‿^<yeux|zieu> ver{ts}.`

**Réplication d'une nouvelle page** (⚠️ l'unité qui avance est la **page**, pas le chapitre — un chapitre couvre plusieurs pages ; `Ch.C` et `p.P` sont **deux nombres distincts**, ne les confonds pas) — suis la **procédure pas-à-pas de `DIRECTIVES_SERIE_PRONONCIATION.md` §9** : entrées = **audio du chapitre + transcript** ; balisage 9.2 ; guide des liaisons 9.3 ; mots difficiles 9.4 ; auto-contrôle 9.5. **Tranche les liaisons à l'oreille sur l'audio** — ne code que celles réellement prononcées. Dans ta **liste d'enregistrement, ne mets que le NOUVEAU** (audio du texte `ratatouille_ch<C>_p<P>.mp3`, `_titre.mp3`, et les **mots difficiles inédits**) : les consignes, la légende et les mots difficiles déjà enregistrés sont **réutilisés** (§9.6), ne les redemande pas.


## 5. En cas de doute

- **Pédagogie / contenu** → demander à **Eric**.
- **Technique / intégration** → laisser une note pour **Opus** (ne pas improviser de solution technique).
- **Gabarits / architecture** (un standard te semble manquant ou bancal) → la remarque remonte à **Fable** via la section « 🔧 Pour Fable » du `PENDING_TASKS.md` à la racine du dépôt (Opus ou Eric l'y consigne).

---

*En résumé : conçois un contenu **audio-first, bilingue, un focus par écran, pensé pour Leo**, livre-le à Opus dans le format du §4, et laisse-lui l'intégration et le déploiement.*
