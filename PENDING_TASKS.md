
## 🔧 Pour Fable — signalé par Opus (13/07/2026, domaine gabarits/design)

1. **Largeur de lecture (bug gabarit).** `_TEMPLATES/*.html` (et le CSS partagé) posent `<main>` **sans largeur maximale** → sur laptop les nouvelles pages s'affichent en pleine largeur (« XXL »). Il faut une **colonne de lecture centrée par défaut (~640 px)** dans `css/site.css`. *En attendant, Opus a mis un `max-width` local sur les pages A2-L-001 et A2-E-004.*
2. **Code couleur des consignes (standard design demandé par Eric).** Créer une **classe partagée `.consigne`** dans `css/site.css` — encadré à **liseré corail + fond corail très clair + bouton 🔊** — pour toutes les instructions/consignes, et la **déployer rétroactivement** sur les pages existantes (passées, présentes, à venir). *Opus l'a appliquée localement sur A2-L-001 comme référence visuelle à reprendre.*
