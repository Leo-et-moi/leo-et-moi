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
  const ICO = { listening: '🎧', reading: '📖', writing: '✍️', speaking: '🗣️' };
  const wrap = document.createElement('div');
  wrap.className = 'som-chap open';
  let rows = '';
  items.forEach((e, i) => {
    const key = e.progressId || e.id;
    const chip = e.ajoute ? ` <span class="new-chip" data-chipkey="${key}" data-ajoute="${e.ajoute}" style="display:none;">🆕</span>` : '';
    rows += `<a class="som-row" href="/${e.chemin}">` +
      `<span class="som-num" style="background:${def.couleur};">${i + 1}</span>` +
      `<span class="som-title">${e.titre}${chip}</span>` +
      `<span class="som-ico">${(e.competences || []).map((c) => ICO[c] || '').join('')}</span>` +
      `<span class="som-status" data-progress="${key}"></span>` +
      `<span style="color:${def.couleur};font-weight:bold;">&#8594;</span></a>`;
  });
  wrap.innerHTML = `<div class="som-chap-rows">${rows}</div>`;
  host.appendChild(wrap);
}

function fillProgress() {
  // Règle d'Eric (27/07) : 🆕 reste tant que l'élève n'a pas terminé l'item,
  // sans limite de temps — mais seulement pour ce qui a été ajouté DEPUIS la
  // création de son compte (un nouvel inscrit ne voit pas tout le site en 🆕).
  // Prof : simple repère d'actualité (21 jours).
  (async () => {
    let u = {};
    try { u = await window.LEM.getUser() || {}; } catch (e) {}
    const created = u.createdAt
      ? (u.createdAt.toMillis ? u.createdAt.toMillis() : (u.createdAt.seconds ? u.createdAt.seconds * 1000 : Date.parse(u.createdAt) || 0))
      : 0;
    document.querySelectorAll('.new-chip[data-chipkey]').forEach(async (chip) => {
      const ts = Date.parse(chip.dataset.ajoute || '') || 0;
      if (u.role === 'teacher') {
        if (Date.now() - ts < 21 * 86400000) chip.style.display = '';
        else chip.remove();
        return;
      }
      if (ts < created) { chip.remove(); return; }
      try {
        const d = await window.LEM.getLesson(chip.dataset.chipkey);
        if (d && d.completed) chip.remove();
        else chip.style.display = '';
      } catch (e) { chip.style.display = ''; }
    });
  })();
  document.querySelectorAll('[data-progress]').forEach(async (el) => {
    try {
      const d = await window.LEM.getLesson(el.dataset.progress);
      if (d && d.completed) { el.classList.add('done'); el.textContent = typeof d.score === 'number' ? '✓ ' + d.score + '/' + d.total : '✓'; }
      else if (d && typeof d.score === 'number') el.textContent = '▶ ' + d.score + '/' + d.total;
      else el.textContent = '';
    } catch (e) { el.textContent = ''; }
  });
}

render().then(() => {
  if (window.LEM && window.LEM.user) fillProgress();
  else document.addEventListener('lem-auth-ready', fillProgress);
}).catch((e) => console.error('[leo-et-moi] page de série :', e));
