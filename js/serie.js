/* serie.js — Page générique d'une série pour un niveau (généré du catalogue).
   La page déclare :  <body data-serie="Dialogue" data-niveau="A1">.
   Titre, emoji et couleur viennent de la section `series` du catalogue :
   une nouvelle série = une entrée au catalogue + 6 pages minces, zéro code. */
import { serie, seriesDefs } from './catalog.js';
import { badges } from './ui.js';

async function render() {
  const nom = document.body.dataset.serie;
  const niveau = document.body.dataset.niveau;
  const def = (await seriesDefs()).find((d) => d.nom === nom) || { titre: nom, emoji: '📚', couleur: 'var(--coral)', unite: 'exercice' };
  const items = await serie(nom, niveau);

  document.title = def.titre + ' ' + niveau + ' — Leo-et-moi';
  document.getElementById('serieBadge').textContent = def.emoji;
  document.getElementById('serieBadge').style.background = def.couleur;
  document.getElementById('serieTitre').textContent = def.titre + ' — ' + niveau;
  document.querySelector('.niveau-head').style.setProperty('--lvl', def.couleur);
  document.getElementById('compteurs').textContent =
    items.length + ' ' + (def.unite || 'exercice') + (items.length > 1 ? 's' : '') + ' · la série s\u2019enrichit au fil du programme';

  const host = document.getElementById('liste');
  if (!items.length) {
    host.innerHTML = '<div class="empty-note">Les contenus de ce niveau arrivent bient\u00f4t.</div>';
    return;
  }
  items.forEach((e, i) => {
    const a = document.createElement('a');
    a.className = 'lesson-card serie';
    a.href = '/' + e.chemin;
    a.style.setProperty('--lvl', def.couleur);
    const status = e.progressId ? `<div class="lesson-status" data-progress="${e.progressId}">&hellip;</div>` : '';
    a.innerHTML =
      `<div class="lesson-num" style="background:${def.couleur};">${i + 1}</div>` +
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
}).catch((e) => console.error('[leo-et-moi] page de série :', e));
