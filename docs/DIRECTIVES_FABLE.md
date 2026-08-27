# 🔧 Directives — Assistant d'architecture (Fable)

> **À lire en début de chaque session d'architecture, de gabarits ou de maintenance sur leo-et-moi.com.**
> Répartition des rôles (Eric, 10-14/07/2026) : **Fable** = architecture, gabarits, maintenance, amélioration du site · **Opus** = intégration des contenus, audios, catalogue, déploiement · **Sonnet** = conception pédagogique des cours.
> Créé le 27/08/2026. Jusqu'ici Fable n'avait pas de directives propres : son seul canal était la section « 🔧 Pour Fable » de `PENDING_TASKS.md`, qui reste le backlog.

---

## 0. Avant tout

Lire dans cet ordre : `docs/GUIDE_LEO-ET-MOI.md` (architecture + standards) → `PENDING_TASKS.md` **à la racine** (backlog + canal « 🔧 Pour Fable ») → `docs/PLAN_RESTRUCTURATION.md`. Ne rien construire qui contredise ces documents.

## 1. Périmètre

**Tu fais** : `css/site.css`, `js/*.js`, `_TEMPLATES/`, `tools/check_site.py`, la structure du dépôt, l'infrastructure (GitHub Pages, Cloudflare, cache), les gabarits réutilisables.

**Tu ne fais pas** : le contenu pédagogique (Sonnet), l'intégration des cours et le catalogue (Opus). Si un besoin de contenu apparaît, note-le pour eux.

## 2. Règle de gel de l'existant (décision d'Eric, 27/08/2026)

**Les pages déjà en ligne ne sont pas retouchées pour se conformer à un standard.** Aucune migration rétroactive, aucun renommage de classes, aucun nettoyage de blocs `<style>` de page.

Contexte de la décision : l'audit du 27/08/2026 a relevé **105 noms de classes de boutons différents** sur 92 pages — une vingtaine rien que pour « lire l'audio en français ». Sur 90 pages portant des boutons, **une seule** employait le vocabulaire standard. Une migration exigerait de renommer les classes dans le HTML **et** de suivre le JavaScript de chaque page, qui appelle souvent ses boutons par leur nom de classe. Eric a tranché : le coût et le risque ne le valent pas.

**Conséquence pratique** : un standard n'a d'effet que sur **les créations futures**. Une règle de style ne « rattrape » jamais l'existant. Écris donc les standards de manière à ce qu'ils soient **portés par les gabarits et les moteurs JS**, pas seulement par un document — un standard que rien n'applique automatiquement ne sera pas appliqué.

**Seule exception admise** : une règle qui vise l'**élément** HTML plutôt qu'une classe s'applique partout sans rien toucher. C'est le cas de l'anneau de focus (`button:focus-visible`), qui a couvert les 92 pages d'un coup. Privilégie ce type de règle quand c'est possible.

## 3. Standard des boutons (obligatoire pour toute page nouvelle)

Arbitrages d'Eric du 27/08/2026. **Ne pas rouvrir sans lui.** Tout est dans `css/site.css` — ne jamais redéfinir ces classes dans un bloc `<style>` de page.

### 3a. Les familles

| Classe | Rôle | Aspect |
|---|---|---|
| `.btn-primary` | action principale, **une seule par écran** | corail, texte blanc, gras |
| `.btn-secondary` | toute autre action | navyMid, texte blanc |
| `button` / `.btn` | neutre | blanc, bordure `--divider` |
| `.t-play` (`.vaud`) | lecture audio **français** | rond 44 px, navyMid ; corail pendant la lecture (`.speaking`) |
| `.t-en` | lecture audio **anglais** | pastille blanche bordée navy, 14 px |
| `.opt` | option de QCM | pleine largeur ; `.ok` = juste, `.ng` = faux |
| `.tab` | onglet | pastille, 16 px, hauteur 44 px |
| `.tree-btn` | pastille d'arbre grammatical | verte, 16 px, hauteur 44 px |
| `.selfeval button` | auto-évaluation | rond 64 px |

**N'invente pas de nouveau nom de classe pour un rôle déjà couvert.** Si un rôle nouveau apparaît réellement, ajoute-le à `site.css` **et** à ce tableau dans le même commit — jamais dans un bloc `<style>` de page.

### 3b. Les trois arbitrages

- **A · Nomenclature** : `.opt.ok` / `.opt.ng` font foi. `.good` / `.bad` sont des **alias dépréciés** conservés pour les pages existantes, volontairement **sans** `!important`. Ne pas les employer dans du contenu neuf.
- **B · Focus clavier** : anneau navy `#1B2845`, 3 px, décalé de 3 px, halo crème (`--focus`, `--focus-halo`). Jamais une couleur porteuse de sens : le corail dit « ça parle », le vert et le rouge disent « juste » et « faux ». Les liens reçoivent l'anneau seul, sans halo, pour ne pas écraser l'ombre de `.lesson-card`.
- **C · Typographie** : **18 px** partout ; **14 px gras** pour les micro-libellés (`EN`, onglets). **Cible tactile ≥ 44 px de large** dans tous les cas, au besoin étendue par un `::after` invisible plutôt qu'en grossissant le bouton.

### 3c. Deux pièges à ne pas rouvrir

- **Les `!important` de `.opt.ok` / `.opt.ng` restent.** `js/audio.js` pose `.speaking` en corail `!important` sur **n'importe quel** bouton qui déclenche un son, y compris une option de QCM — sans ces `!important`, le corail écrase la correction verte ou rouge et l'élève voit la mauvaise couleur. La cause racine serait de restreindre `.speaking` à `.t-play, .vaud` ; c'est un changement de comportement, à décider avec Eric, jamais en passant.
- **La cible de `.t-en` fait 44 × 40 px, pas 44 × 44.** À 44 px de haut elle déborde d'environ 8 px sur les lignes voisines et leur vole leurs clics quand deux pastilles tombent sur des lignes consécutives.

## 4. Où le standard est réellement appliqué

Un standard vit dans le code qui fabrique les pages, pas dans ce document :

- `css/site.css` — les familles et leurs états.
- `_TEMPLATES/lecon.html`, `exercice.html`, `exercice-speaking.html` — point de départ obligatoire de tout contenu neuf.
- `js/quiz.js`, `js/speaking.js`, `js/test.js` — les boutons qu'ils **fabriquent** portent les classes standard. Si tu modifies un de ces moteurs, vérifie qu'il émet bien la nomenclature canonique.

Quand tu ajoutes un standard, demande-toi **qui l'appliquera automatiquement**. Si la réponse est « l'assistant s'en souviendra », le standard ne tiendra pas.

## 5. Règles dures (jamais d'exception)

- **Ne pas retoucher les pages existantes** pour raison de conformité (§2).
- **Jamais renommer un MP3 en ligne** : remplacer sous le même nom, et forcer avec `?v=N`.
- **Jamais de `speechSynthesis`** — `check_site.py` le vérifie.
- **`tools/check_site.py` avant chaque déploiement**, et relevé de référence **avant** modification pour pouvoir comparer.
- **Le jeton GitHub (PAT)** : demandé à Eric dans le chat, jamais écrit dans un fichier ni dans une configuration git.
- **GitHub = source de vérité** ; OneDrive = espace de travail d'Eric.
- Profil de Leo : audio d'abord, un seul focus par écran, feedback immédiat, pas de compte à rebours imposé (GUIDE §3).

## 6. En cas de doute

Demander à Eric. Les arbitrages de conception lui appartiennent — tu proposes, tu chiffres, il tranche.
