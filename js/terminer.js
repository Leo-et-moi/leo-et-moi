/* terminer.js — Bouton « ✅ Exercice terminé » générique (demande Eric, 25/07/2026).
   Inclure sur toute page de contenu :  <script type="module" src="/js/terminer.js"></script>
   Comportement :
   - la page doit déclarer <body data-item-id="…"> (leçon ou exercice du catalogue) ;
   - si la page possède DÉJÀ un déclencheur de complétion (appel à setLesson ou
     submitWriting dans ses scripts), le bouton ne s'affiche pas — sauf
     data-terminer="on" pour forcer ; data-terminer="off" le désactive toujours ;
   - clic → LEM.setLesson(clé, {completed:true}) → notification e-mail au prof
     (la durée dureeSec est ajoutée automatiquement par timer.js si présent) ;
   - si l'élève a déjà terminé, le bouton s'affiche en état « ✓ déjà terminé ». */
import { item } from './catalog.js';

function dejaUnDeclencheur() {
  for (const s of document.scripts) {
    if (s.src) continue;                       // seuls les scripts de la page comptent
    const t = s.textContent || '';
    if (/\.setLesson\s*\(|\.submitWriting\s*\(/.test(t)) return true;
  }
  return false;
}

function carte(el, titreItem) {
  const div = document.createElement('div');
  div.style.cssText = 'background:#FFFFFF;border:1px solid #D8DFE8;border-radius:14px;padding:16px;margin:20px 0;text-align:center;';
  const btn = document.createElement('button');
  btn.style.cssText = 'background:#1E7B45;color:#fff;border:none;border-radius:12px;padding:14px 22px;font-size:18px;font-weight:bold;cursor:pointer;min-height:44px;font-family:Arial,sans-serif;';
  btn.innerHTML = '✅ Exercice terminé — clique ici';
  const en = document.createElement('div');
  en.style.cssText = 'font-size:14px;color:#4A6580;margin-top:6px;';
  en.textContent = 'Exercise finished — click here';
  div.appendChild(btn); div.appendChild(en);
  el.appendChild(div);
  return { div, btn, en };
}

function etatFait(ui) {
  ui.btn.disabled = true;
  ui.btn.style.background = '#EDE8DF';
  ui.btn.style.color = '#1E7B45';
  ui.btn.innerHTML = '✓ Déjà terminé — bravo !';
  ui.en.textContent = 'Already finished — well done!';
}

async function init() {
  if (window.LEM && window.LEM.demo) return;   // pas de complétion en démo
  const mode = document.body.dataset.terminer || 'auto';
  if (mode === 'off') return;
  const id = document.body.dataset.itemId;
  if (!id) return;
  if (mode !== 'on' && dejaUnDeclencheur()) return;

  const it = await item(id);
  if (!it) return;
  const cle = it.progressId || it.id;
  const titre = (it.niveau ? it.niveau + ' · ' : '') + it.titre;

  const host = document.querySelector('main.main, main, .main') || document.body;
  const ui = carte(host, titre);

  ui.btn.onclick = async () => {
    ui.btn.disabled = true;
    try {
      window.LEM_TITLES = window.LEM_TITLES || {};
      window.LEM_TITLES[cle] = titre;
      await window.LEM.setLesson(cle, { completed: true, lastPracticed: Date.now() });
      etatFait(ui);
      ui.btn.innerHTML = '🎉 Bien joué ! Ton professeur est prévenu.';
      ui.en.textContent = 'Well done! Your teacher has been notified.';
    } catch (e) {
      ui.btn.disabled = false;
      console.error('[leo-et-moi] terminer :', e);
    }
  };

  const check = async () => {
    try {
      const d = await window.LEM.getLesson(cle);
      if (d && d.completed) etatFait(ui);
    } catch (e) {}
  };
  if (window.LEM && window.LEM.user) check();
  else document.addEventListener('lem-auth-ready', check);
}

init().catch((e) => console.error('[leo-et-moi] terminer :', e));
