/* prononciation.js — Page de la série « PRO-NON-CIA-TION avec LÉO » d'un niveau
   (généré depuis le catalogue). <body data-niveau="A1">. Couleur : var(--pronunciation). */
import { serie } from './catalog.js';
import { badges } from './ui.js';

async function render() {
  const niveau = document.body.dataset.niveau;
  const list = await serie('Prononciation', niveau);
  document.getElementById('compteurs').textContent =
    list.length + ' texte' + (list.length > 1 ? 's' : '') + ' · la série s’enrichit au fil du programme';
  const host = document.getElementById('liste');
  if (!list.length) {
    host.innerHTML = '<div class="empty-note">Les textes de ce niveau arrivent bientôt.</div>';
    return;
  }
  list.forEach((e, i) => {
    const a = document.createElement('a');
    a.className = 'lesson-card pronunciation';
    a.href = '/' + e.chemin;
    a.style.setProperty('--lvl', 'var(--pronunciation)');
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
      if (d && d.completed) { el.classList.add('done'); el.textContent = '✓ Terminé'; }
      else el.textContent = '';
    } catch (e) { el.textContent = ''; }
  });
}

render().then(() => {
  if (window.LEM && window.LEM.user) fillProgress();
  else document.addEventListener('lem-auth-ready', fillProgress);
}).catch((e) => console.error('[leo-et-moi] série Prononciation :', e));
