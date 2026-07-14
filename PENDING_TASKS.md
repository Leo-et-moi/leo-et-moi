# Canal Opus → Fable (dépôt)

_Demandes de gabarits/architecture signalées par Opus. Fable les traite puis les archive ici._

## ✅ Traitées

- **13/07/2026 — Largeur de lecture** : colonne centrée 640 px par défaut dans `css/site.css` (règles `main`, `.main`, `.wrap`) + `_TEMPLATES` corrigés (`class="main"`). Les correctifs locaux temporaires d'Opus (A2-L-001, A2-E-004) ont été retirés.
- **13/07/2026 — Classe `.consigne` partagée** : standard corail (liseré `--coral`, fond `#FCEEEA`, 🔊 en tête) dans `css/site.css`, valeurs reprises de la référence visuelle A2-L-001. Déployée rétroactivement sur lire-invitation, B1 exercices, lire-faire-part, B2 interrogatifs.

## ⏳ En attente

_(aucune)_

## 🔧 Pour Fable — nouveau standard « audio bilingue » (signalé par Opus, 13/07)

**Standard demandé par Eric** : chaque phrase a **deux boutons audio distincts** — un français (existant) **et un anglais** (nouveau, fichier `<nom>_en.mp3`), pour que l'élève puisse aussi écouter la traduction affichée.
1. **`js/quiz.js`** : ajouter le support d'un champ `audioEn` par question (2ᵉ bouton 🔊 EN à côté de l'énoncé) — nécessaire pour appliquer le standard aux **exercices** (ex. A2-E-004 : q01_en…q12_en).
2. **Déploiement rétroactif** du 2ᵉ bouton EN sur les pages existantes (leçons + exercices).
3. Référence visuelle du bouton EN (petit bouton contour marine « 🔊 EN ») : voir `french/a2/A2-L-001-imperatif/index.html` (Opus l'a appliqué à cette leçon).
