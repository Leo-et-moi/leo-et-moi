/* dialogue.js — Page de la série « Dialogue » d'un niveau (généré du catalogue).
   La page déclare :  <body data-niveau="A1">. Grandes cartes, retour simple —
   pensé smartphone (décision Eric). Couleur : var(--dialogue). */
import { serie } from './catalog.js';
import { badges } from './ui.js';

async function render() {
  const niveau = document.body.dataset.niveau;
  const dial = await serie('Dialogue', niveau);
  document.getElementById('compteurs').textContent =
    dial.length + ' dialogue' + (dial.length > 1 ? 's' : '') + ' · la série s\u2019enrichit au fil du programme';
  const host = document.getElementById('liste');
  if (!dial.length) {
    host.innerHTML = '<div class="empty-note">Les dialogues de ce niveau arrivent bient\u00f4t.</div>';
    return;
  }
  dial.forEach((e, i) => {
    const a = document.createElement('a');
    a.className = 'lesson-card dialogue';
    a.href = '/' + e.chemin;
    a.style.setProperty('--lvl', 'var(--dialogue)');
    const status = e.progressId ? `<div class="lesson-status" data-progress="${e.progressId}">&hellip;</div>` : '';
    a.innerHTML =
      `<div class="lesson-num">${i + 1}</div>` +
      `<div class="lesson-info"><div class="lesson-name">${e.titre}</div>` +
      `<div class="lesson-sub">${badges(e.competences)}</div>${status}</div>` +
      `<span class="lesson-arrow">&#8594;</span>`;
    host.appendChild(a);
  });
}

function fillProgress() {
  document.querySelectorAll('[data-progress]').forEach(async (el) => {
    try {
      const d = await window.LEM.getLesson(el.dataset.progress);
      if (d && d.completed) { el.classList.add('done'); el.textContent = '✓ Terminé' + (typeof d.score === 'number' ? ' · ' + d.score + ' / ' + d.total : ''); }
      else if (d && typeof d.score === 'number') el.textContent = '▶ Commencé · ' + d.score + ' / ' + d.total;
      else el.textContent = '';
    } catch (e) { el.textContent = ''; }
  });
}

render().then(() => {
  if (window.LEM && window.LEM.user) fillProgress();
  else document.addEventListener('lem-auth-ready', fillProgress);
}).catch((e) => console.error('[leo-et-moi] série Dialogue :', e));
