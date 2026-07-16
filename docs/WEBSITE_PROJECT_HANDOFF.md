# Leo-et-moi Website — Project Handoff Document

**Created:** June 21, 2026
**Purpose:** Context document for the website project, to be read at the start of every new session.

> ⚠️ **10 juillet 2026 — document historique.** Le site a été entièrement restructuré (catalogue `catalog.json`, gabarits partagés, parcours, tests, banques de questions) : voir **`PLAN_RESTRUCTURATION.md`** (plan + état d'avancement) et **`GUIDE_LEO-ET-MOI.md`** (architecture et standards à jour). Les matières **Math/Science mentionnées ci-dessous sont abandonnées** (site français uniquement). Ce fichier reste utile pour le contexte d'origine (profil de Leo, design system, historique).

---

## ⚡ STATUS UPDATE — June 25, 2026 (read this first; overrides stale details below)

**Hosting & deploy:** Live on **GitHub Pages**, NOT SiteGround. Repo: `github.com/Leo-et-moi/leo-et-moi`. Deploys via direct `git push` to `main` (fine-grained GitHub PAT, Contents read/write). The OneDrive copy is a partial reference — **GitHub is the source of truth.**

**Custom domain — DONE (June 25, 2026):**
- `leo-et-moi.com` registered at **Cloudflare** (website only; no branded email yet — can be added later via MX records without losing any address).
- Cloudflare DNS records, all **"DNS only" (grey cloud)**:
  - `A  @` → 185.199.108.153 / .109.153 / .110.153 / .111.153
  - `AAAA  @` → 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153
  - `CNAME  www` → leo-et-moi.github.io
- `CNAME` file in repo root = `leo-et-moi.com`. **Enforce HTTPS** is ON. `www` redirects to apex. Old `github.io` links auto-redirect to the new domain.
- `leo-et-moi.com` and `www.leo-et-moi.com` added to **Firebase Auth → Authorized domains** (required for login on the new domain).

**Audio — HARD RULE:** All audio is **recorded MP3s** (Eric's voice / paid TTS). **No Web Speech / synthetic audio anywhere.** This overrides every "Web Speech API" mention later in this document.

**Phase 2 backend — DONE:** Firebase **Auth** (Google + Email/Password) + **Firestore** live. Security **rules published** (level-lock: students cannot self-promote to teacher or change their own level; teacher can read everyone). Data model: `users/{uid}` (displayName, email, role student|teacher, level, vocab[], streak, lastVisit); `progress/{uid}/lessons/{lessonId}` (score, total, completed, lastPracticed).

**Teacher dashboard — DONE:** `/tableau-prof.html`, teacher-only, lists every student with level, streak, vocab count, and per-exercise score/date.

**Email notifications — DONE:** EmailJS emails Eric on a student's **first** completion of an exercise (skips teacher accounts; no spam on replays). Wired in `js/auth-guard.js`.

**Content live:** A1 (Être, Avoir) and C1 (Francine Gosselin). A2/B1/B2/C2 still empty. Full backlog in **`PENDING_TASKS.md`**.

---

## 1. What this project is

A personal French learning website built primarily for Leo (see student profile below), but designed from the start to support multiple students. The site will eventually cover French (A1→C2), Math, and Science — all with the same neurodiverse-friendly design.

**Working title / domain:** leo-et-moi.com (not yet registered)
**Hosting:** SiteGround (Eric already has an account)

---

## 2. Leo's profile (primary student)

- Age 17, lives in rural Oregon, USA
- Complete beginner in French (starting at A1)
- Native language: English
- **Dyslexic + dysgraphic + ADHD symptoms**
- Design rules that apply to ALL pages:
  - Font: Arial only, minimum 18px
  - No italics, no underlining — bold only for emphasis
  - Background: warm cream #F5F0E8
  - Body text: dark navy #1A2733
  - Zero typing exercises (click-only)
  - Large touch targets (min 44px)
  - Max 30-minute lessons, one concept per lesson
  - Immediate feedback after every task
  - Progress bar always visible

---

## 3. Design system — Bleu & Corail

| Variable | Color | Use |
|---|---|---|
| --dark | #1B2845 | Top bar, dark cards |
| --navyMid | #2C4A7C | Secondary buttons, links |
| --coral | #E8503A | Primary CTA, accents |
| --gold | #D4920A | Phrase/vocab cards |
| --cream | #F5F0E8 | Page background |
| --text | #1A2733 | Body text |
| --slate | #4A6580 | Secondary text |
| --white | #FFFFFF | Content cards |
| --divider | #D8DFE8 | Borders, separators |

CEFR level colors:
- A1 #C0392B · A2 #E07B39 · B1 #D4920A · B2 #7CB82F · C1 #27AE60 · C2 #1A5C38

Font: Arial throughout. No decorative fonts.

---

## 4. CEFR framework

Six levels used to structure all French content:

| Level | Label | Tier |
|---|---|---|
| A1 | Débutant | Utilisateur élémentaire |
| A2 | Élémentaire | Utilisateur élémentaire + |
| B1 | Intermédiaire | Utilisateur indépendant |
| B2 | Avancé | Utilisateur indépendant + |
| C1 | Autonome | Utilisateur expérimenté |
| C2 | Maîtrise | Maîtrise |

Reference: https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale

---

## 5. Pedagogical methods in use

All of the following are actively built into the site:

1. **Behavioral Momentum** — easy questions first in every session
2. **Spaced Repetition** (Ebbinghaus) — review prompts at 1/3/7/14 days via localStorage
3. **Morphological Awareness** — word anatomy box (root + suffix) on home page
4. **Web Speech API** — every element on every page has a speak/listen button (lang=fr-FR)
5. **Pomodoro Timer** — 25-minute session countdown, spoken end-of-session message
6. **Gamification** — streak counter, completion badges, encouraging messages
7. **Chunked content** — max 2 sentences of instruction before any activity
8. **Immediate feedback** — green/red on every click, score after every section
9. **Varied activity types** — MC, True/False, translation match within one session

---

## 6. Site architecture (planned)

```
leo-et-moi/
├── index.html              ← Home page (BUILT — Phase 1 complete)
├── french/
│   ├── index.html          ← French hub + CEFR roadmap (pending)
│   └── a1/
│       ├── index.html      ← A1 lesson grid (pending)
│       ├── 01-etre/
│       │   └── exercices.html
│       └── 02-avoir/
│           └── exercices.html
├── reference/
│   └── conjugaison.html    ← Conjugation + vocab reference (pending)
├── math/                   ← Phase 3 (future)
└── science/                ← Phase 3 (future)
```

---

## 7. Home page — what is built

**File:** `C:\Users\ericp\OneDrive\DOCUMENT\01. Léo\leo-et-moi\index.html`

Features currently implemented:
- Sticky top bar with site name and speak/notification buttons
- Greeting block with student name, date in French, streak counter
- CEFR personal progress bar — each segment is clickable and reveals level description inline (no separate section)
- Daily warm-up micro-question (rotates by day of year, click-only, instant feedback)
- Spaced repetition reminder card (appears if lesson not practiced in 3+ days, uses localStorage)
- Continue Learning card with lesson progress bar and Pomodoro timer
- Phrase de la semaine with full context sentence + speak button
- Vocabulaire de la semaine — 5 expressions with context sentences + individual speak buttons
- Word anatomy box (morphological awareness) — this week: rapidement
- Mes Matières — French as main card with progress bar; Math and Science as small chips
- Bottom tab navigation (Accueil / Français / Référence / Progrès)
- All text speakable via Web Speech API (lang=fr-FR for French, en-US for English)

---

## 8. Phase plan

### Phase 1 — Static site (localStorage, no login)
- Single student (Leo)
- Progress stored per device in localStorage
- **Status: in progress**

### Phase 2 — Multi-student with login
- Firebase Authentication (Google login or email/password)
- Firestore database for student progress (per-student, cross-device)
- Teacher dashboard for Eric to see all students' progress
- EmailJS notifications (free up to 200/month, no server needed)
- **Trigger: start when domain leo-et-moi.com is registered and SiteGround is set up**

### Phase 3 — Expand subjects
- Math and Science content
- Additional French levels (A2, B1...)

---

## 9. Firebase plan (Phase 2)

- Provider: Google Firebase (free Spark plan covers small student numbers)
- Auth: Firebase Authentication
- Database: Firestore (NoSQL, real-time)
- Data model sketch:
  - `/users/{uid}` — name, level, email
  - `/progress/{uid}/{lessonId}` — score, date, attempts
  - `/lessons/{lessonId}` — metadata
- EmailJS for teacher notifications (no backend server required)
- Migration from Phase 1: localStorage data can be imported on first login

---

## 10. Pending tasks for the website

1. French hub page — `french/index.html` — visual CEFR roadmap, links to each level
2. A1 lesson grid — `french/a1/index.html` — grid of lessons with completion status
3. Conjugation & vocabulary reference page — `reference/conjugaison.html`
4. SiteGround upload instructions (FTP or file manager walkthrough)
5. Register domain leo-et-moi.com
6. Phase 2 Firebase setup — auth, Firestore, teacher dashboard, EmailJS

---

## 11. Existing lesson files (built in the French lessons project)

| File | Content |
|---|---|
| `audio Leo_Exercices_01_ETRE\Leo_Exercices_01_ETRE.html` | 24 click-only ÊTRE exercises |
| `audio Leo_Exercices_02_AVOIR\Leo_Exercices_02_AVOIR.html` | 24 click-only AVOIR exercises |

Both files: MP3 audio in same folder as HTML, Play/Pause toggle, dyslexia-friendly design.

---

## 12. Key technical notes

- **All HTML files written via Python** `open(..., 'w', encoding='utf-8')` to handle French accented characters
- **Web Speech API** used for TTS — no audio files needed for interface text
- **localStorage keys in use:** `streak`, `lastVisit`, `lastPractice_etre`, `lastPractice_avoir`
- **Mobile-first design** — smartphone primary, 600px breakpoint for desktop
- **Bottom nav height:** `--nav-h: 64px`, body has matching `padding-bottom`
- **No typing inputs anywhere** — all interactions are click/tap only
