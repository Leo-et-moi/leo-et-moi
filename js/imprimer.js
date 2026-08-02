/* imprimer.js — Bouton 🖨️ RÉSERVÉ AU PROFESSEUR (décision Eric, 27/07/2026 :
   c'est le prof qui décide d'imprimer, le site doit suffire aux élèves).
   Monté dans la barre du haut, à côté de la cloche. Injecte une feuille de
   style d'impression : navigation, boutons et audio masqués, noir sur blanc. */
function stylesImpression() {
  if (document.getElementById('printStyles')) return;
  const s = document.createElement('style');
  s.id = 'printStyles';
  s.media = 'print';
  s.textContent = `
    header, nav, .top-bar, .bottom-nav, .som-nav, .notif-panel, video, iframe,
    button, .speak-btn, .t-play, .t-en, .play-btn, .aud, .nc-play, .eq-play,
    #lemModeClasse, #lemSignOut { display: none !important; }
    body { background: #fff !important; color: #000 !important; font-size: 13pt; }
    main, .main, .wrap { max-width: 100% !important; padding: 0 !important; }
    a { color: #000 !important; text-decoration: none !important; }
    .card, .som-chap, .lesson-card { box-shadow: none !important; border: 1px solid #999 !important; break-inside: avoid; }
  `;
  document.head.appendChild(s);
}
function monte() {
  if (document.getElementById('lemPrint')) return;
  const host = document.querySelector('.top-icons');
  const b = document.createElement('button');
  b.id = 'lemPrint';
  b.title = 'Imprimer cette page (professeur)';
  b.textContent = '🖨️';
  if (host) { b.className = 'icon-btn'; host.insertBefore(b, host.firstChild); }
  else {
    b.style.cssText = 'position:fixed;top:70px;right:12px;z-index:90;width:44px;height:44px;border-radius:50%;' +
      'border:1px solid #D8DFE8;background:#fff;font-size:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.15);';
  }
  b.onclick = () => { stylesImpression(); window.print(); };
  if (!host) document.body.appendChild(b);
}
const arme = () => {
  try {
    window.LEM.getUser().then((u) => { if (u && u.role === 'teacher') { stylesImpression(); monte(); } }).catch(() => {});
  } catch (e) {}
};
if (window.LEM && window.LEM.user) arme();
else document.addEventListener('lem-auth-ready', arme);
