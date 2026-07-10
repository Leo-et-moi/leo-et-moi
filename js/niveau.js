/* niveau.js — Page de niveau générée depuis le catalogue (Phase 2).
   La page déclare :  <body data-niveau="A1">
   Rend : en-tête (badge + compteurs), section « Leçons », section « Exercices »
   (numérotés, badges de compétences), état de progression via LEM (auth-guard). */
import { lecons, exercices, tests } from './catalog.js';
import { badges } from './ui.js';

const NIVEAUX = {
  A1: { nom: 'Débutant',        css: 'var(--a1)' },
  A2: { nom: 'Élémentaire',     css: 'var(--a2)' },
  B1: { nom: 'Intermédiaire',   css: 'var(--b1)' },
  B2: { nom: 'Intermédiaire +', css: 'var(--b2)' },
  C1: { nom: 'Avancé',          css: 'var(--c1)' },
  C2: { nom: 'Maîtrise',        css: 'var(--c2)' }
};

function carte(item, n, type, lvlCss) {
  const a = document.createElement('a');
  a.className = 'lesson-card';
  a.href = '/' + item.chemin;
  a.style.setProperty('--lvl', lvlCss);
  const sub = type === 'exercice' ? badges(item.competences) : '';
  const status = (type === 'exercice' && item.progressId)
    ? `<div class="lesson-status" data-progress="${item.progressId}">&hellip;</div>` : '';
  a.innerHTML =
    `<div class="lesson-num">${type === 'lecon' ? 'L' : 'E'}${n}</div>` +
    `<div class="lesson-info"><div class="lesson-name">${item.titre}</div>` +
    `<div class="lesson-sub">${sub}</div>${status}</div>` +
    `<span class="lesson-arrow">&#8594;</span>`;
  return a;
}

async function render() {
  const niveau = document.body.dataset.niveau;
  const meta = NIVEAUX[niveau];
  const ls = await lecons(niveau);
  const es = await exercices(niveau);

  document.getElementById('niveauBadge').textContent = niveau;
  document.getElementById('niveauNom').textContent = 'Niveau ' + niveau + ' — ' + meta.nom;
  document.getElementById('compteurs').textContent = ls.length + ' Leçons · ' + es.length + ' Exercices';
  document.querySelectorAll('.niveau-head,.section-host').forEach(el => el.style.setProperty('--lvl', meta.css));

  const hl = document.getElementById('titreLecons');
  const he = document.getElementById('titreExercices');
  hl.textContent = '📖 ' + ls.length + ' Leçon' + (ls.length > 1 ? 's' : '');
  he.textContent = '✏️ ' + es.length + ' Exercice' + (es.length > 1 ? 's' : '');

  const wl = document.getElementById('lecons');
  const we = document.getElementById('exercices');
  if (!ls.length) wl.innerHTML = '<div class="empty-note">Leçons bientôt disponibles.</div>';
  else ls.forEach((l, i) => wl.appendChild(carte(l, i + 1, 'lecon', meta.css)));
  if (!es.length) we.innerHTML = '<div class="empty-note">Exercices bientôt disponibles.</div>';
  else es.forEach((e, i) => we.appendChild(carte(e, i + 1, 'exercice', meta.css)));

  // Tests / examens du niveau (Phase 7)
  const ts = await tests(niveau);
  if (ts.length) {
    const host = document.getElementById('exercices').parentNode;
    const titre = document.createElement('div');
    titre.className = 'section-title';
    titre.textContent = '📝 ' + ts.length + ' Test' + (ts.length > 1 ? 's' : '');
    host.appendChild(titre);
    ts.forEach((x, i) => {
      const a = document.createElement('a');
      a.className = 'lesson-card';
      a.href = '/french/tests/test.html?id=' + x.id;
      a.style.setProperty('--lvl', meta.css);
      a.innerHTML =
        `<div class="lesson-num">T${i + 1}</div>` +
        `<div class="lesson-info"><div class="lesson-name">${x.titre}</div>` +
        `<div class="lesson-sub">${x.nbQuestions} questions · ${x.duree ? x.duree + ' min' : 'sans limite de temps'}</div>` +
        `<div class="lesson-status" data-progress="${x.id}">&hellip;</div></div>` +
        `<span class="lesson-arrow">&#8594;</span>`;
      host.appendChild(a);
    });
  }
}

/* Progression (scores Firestore) quand l'authentification est prête. */
function fillProgress() {
  document.querySelectorAll('[data-progress]').forEach(async (el) => {
    try {
      const d = await window.LEM.getLesson(el.dataset.progress);
      if (!d) { el.textContent = ''; return; }
      if (d.completed) {
        el.classList.add('done');
        el.textContent = '✓ Terminé' + (typeof d.score === 'number' ? ' · ' + d.score + ' / ' + d.total : '');
      } else if (typeof d.score === 'number') {
        el.textContent = '▶ Commencé · ' + d.score + ' / ' + d.total;
      } else el.textContent = '';
    } catch (e) { el.textContent = ''; }
  });
}

render().then(() => {
  if (window.LEM && window.LEM.user) fillProgress();
  else document.addEventListener('lem-auth-ready', fillProgress);
}).catch((e) => console.error('[leo-et-moi] rendu du niveau :', e));
