/* niveau.js — Page de niveau en SOMMAIRE (chapitres repliables, 27/07/2026).
   Généré du catalogue. Chaque leçon = un chapitre contenant ses exercices ;
   puis « Autres exercices », « Tests », et les dossiers de séries.
   - Rangées compactes : numéro · titre (🆕) · compétences (pictos) · statut.
   - Repli mémorisé par appareil (localStorage lemSom_<niveau>) ; à la connexion,
     le chapitre contenant le premier exercice NON terminé s'ouvre tout seul.
   - Le badge 🆕 suit la règle d'Eric : ajouté depuis la création du compte et
     pas terminé → il reste, sans limite de temps (prof : repère 21 jours). */
import { lecons, exercices, tests, seriesDefs } from './catalog.js';

const NIVEAUX = {
  A1: { nom: 'Débutant',        css: 'var(--a1)' },
  A2: { nom: 'Élémentaire',     css: 'var(--a2)' },
  B1: { nom: 'Intermédiaire',   css: 'var(--b1)' },
  B2: { nom: 'Intermédiaire +', css: 'var(--b2)' },
  C1: { nom: 'Avancé',          css: 'var(--c1)' },
  C2: { nom: 'Maîtrise',        css: 'var(--c2)' }
};
const ICO = { listening: '🎧', reading: '📖', writing: '✍️', speaking: '🗣️' };
const LBL = { listening: 'Écoute', reading: 'Lecture', writing: 'Écriture', speaking: 'Oral' };

let NIV = 'A1';
const memKey = () => 'lemSom_' + NIV.toLowerCase();
function etatPlis() { try { return JSON.parse(localStorage.getItem(memKey())) || null; } catch (e) { return null; } }
function sauvePlis(o) { try { localStorage.setItem(memKey(), JSON.stringify(o)); } catch (e) {} }

function icones(comps) {
  return (comps || []).map((c) => `<span title="${LBL[c] || c}">${ICO[c] || ''}</span>`).join('');
}
function chip(item) {
  if (!item.ajoute) return '';
  return ` <span class="new-chip" data-chipkey="${item.progressId || item.id}" data-ajoute="${item.ajoute}" style="display:none;">🆕</span>`;
}
function rang(item, num, type, lien) {
  const key = type === 'test' ? item.id : (item.progressId || item.id);
  const stat = `<span class="som-status" data-progress="${key}"></span>`;
  const ico = type === 'lecon' ? '' : `<span class="som-ico">${icones(item.competences)}</span>`;
  return `<a class="som-row" href="${lien}" data-key="${key}">` +
    `<span class="som-num">${num}</span>` +
    `<span class="som-title">${item.titre}${chip(item)}</span>` +
    ico + stat + `<span style="color:var(--coral);font-weight:bold;">&#8594;</span></a>`;
}

async function render() {
  NIV = document.body.dataset.niveau;
  const meta = NIVEAUX[NIV];
  const ls = await lecons(NIV);
  const esTous = await exercices(NIV);
  const es = esTous.filter((e) => !e.serie);
  const ts = await tests(NIV);
  const defs = await seriesDefs();

  document.getElementById('niveauBadge').textContent = NIV;
  document.getElementById('niveauNom').textContent = 'Niveau ' + NIV + ' — ' + meta.nom;
  document.getElementById('compteurs').textContent = ls.length + ' Leçon' + (ls.length > 1 ? 's' : '') + ' · ' + es.length + ' Exercice' + (es.length > 1 ? 's' : '');
  document.querySelectorAll('.niveau-head,.section-host,.som-nav').forEach((el) => el.style.setProperty('--lvl', meta.css));

  // ── Chapitres : une leçon + ses exercices du même niveau ──
  const dansChapitre = new Set();
  let html = '';
  if (ls.length) {
    html += '<div class="som-sec" id="sec-lecons">📖 Leçons</div>';
    ls.forEach((l, i) => {
      const exos = (l.exercices || [])
        .map((id) => es.find((e) => e.id === id))
        .filter(Boolean);
      exos.forEach((e) => dansChapitre.add(e.id));
      let rows = rang(l, 'L' + (i + 1), 'lecon', '/' + l.chemin);
      exos.forEach((e, j) => { rows += rang(e, 'E' + (j + 1), 'exercice', '/' + e.chemin); });
      html += `<div class="som-chap" data-chap="L${i + 1}" data-exos="${exos.map((e) => e.progressId || e.id).join(',')}">` +
        `<button class="som-chap-head" type="button">📖 <span>L${i + 1} — ${l.titre}${chip(l)}</span>` +
        `<span style="font-size:13px;color:var(--slate);font-weight:normal;">&nbsp;(${exos.length} exo${exos.length > 1 ? 's' : ''})</span>` +
        `<span class="chev">&#9654;</span></button>` +
        `<div class="som-chap-rows">${rows}</div></div>`;
    });
  }

  // ── Autres exercices (sans leçon de ce niveau) ──
  const autres = es.filter((e) => !dansChapitre.has(e.id));
  if (autres.length) {
    html += '<div class="som-sec" id="sec-exos">✏️ ' + (dansChapitre.size ? 'Autres exercices' : 'Exercices') + '</div><div class="som-chap open"><div class="som-chap-rows">';
    autres.forEach((e, i) => { html += rang(e, 'E' + (i + 1), 'exercice', '/' + e.chemin); });
    html += '</div></div>';
  }

  // ── Tests ──
  if (ts.length) {
    html += '<div class="som-sec" id="sec-tests">📝 Tests</div><div class="som-chap open"><div class="som-chap-rows">';
    ts.forEach((x, i) => { html += rang(x, 'T' + (i + 1), 'test', '/french/tests/test.html?id=' + x.id); });
    html += '</div></div>';
  }

  // ── Séries (dossiers colorés, mécanisme générique) ──
  defs.forEach((def) => {
    const items = esTous.filter((e) => e.serie === def.nom);
    if (!items.length) return;
    html += `<div class="som-sec" id="sec-${def.dossier}">${def.emoji} ${def.titre}</div>` +
      `<a class="lesson-card serie" href="/french/${def.dossier}/${NIV.toLowerCase()}.html" style="--lvl:${def.couleur};background:${def.couleur}14;">` +
      `<div class="lesson-num">${def.emoji}</div>` +
      `<div class="lesson-info"><div class="lesson-name">${def.titre} — ${NIV}</div>` +
      `<div class="lesson-sub">${items.length} ${def.unite || 'exercice'}${items.length > 1 ? 's' : ''} · série évolutive</div></div>` +
      `<span class="lesson-arrow">&#8594;</span></a>`;
  });

  document.getElementById('sommaire').innerHTML = html;

  // ── Bandeau de navigation collant ──
  const nav = [];
  if (ls.length) nav.push(['#sec-lecons', '📖 ' + ls.length]);
  if (autres.length) nav.push(['#sec-exos', '✏️ ' + autres.length]);
  if (ts.length) nav.push(['#sec-tests', '📝 ' + ts.length]);
  defs.forEach((d) => { if (esTous.some((e) => e.serie === d.nom)) nav.push(['#sec-' + d.dossier, d.emoji]); });
  document.getElementById('somNav').innerHTML = nav.map(([h, l]) => `<a href="${h}">${l}</a>`).join('');

  // ── Plis : état mémorisé, sinon premier chapitre ouvert ──
  const chaps = [...document.querySelectorAll('.som-chap[data-chap]')];
  const memo = etatPlis();
  chaps.forEach((c, i) => {
    const id = c.dataset.chap;
    const ouvert = memo ? !!memo[id] : i === 0;
    c.classList.toggle('open', ouvert);
    c.querySelector('.som-chap-head').addEventListener('click', () => {
      c.classList.toggle('open');
      const etat = {};
      chaps.forEach((x) => { etat[x.dataset.chap] = x.classList.contains('open'); });
      sauvePlis(etat);
    });
  });
}

/* Progression + 🆕 + ouverture auto du chapitre en cours. */
function fillProgress() {
  (async () => {
    let u = {};
    try { u = await window.LEM.getUser() || {}; } catch (e) {}
    const created = u.createdAt
      ? (u.createdAt.toMillis ? u.createdAt.toMillis() : (u.createdAt.seconds ? u.createdAt.seconds * 1000 : Date.parse(u.createdAt) || 0))
      : 0;

    // Badges 🆕 (règle d'Eric 27/07 : sans expiration tant que non terminé)
    document.querySelectorAll('.new-chip[data-chipkey]').forEach(async (c) => {
      const ts = Date.parse(c.dataset.ajoute || '') || 0;
      if (u.role === 'teacher') {
        if (Date.now() - ts < 21 * 86400000) c.style.display = ''; else c.remove();
        return;
      }
      if (ts < created) { c.remove(); return; }
      try {
        const d = await window.LEM.getLesson(c.dataset.chipkey);
        if (d && d.completed) c.remove(); else c.style.display = '';
      } catch (e) { c.style.display = ''; }
    });

    // Statuts + détection du premier non-terminé (ouverture auto du chapitre)
    const rows = [...document.querySelectorAll('.som-status[data-progress]')];
    const done = {};
    await Promise.all(rows.map(async (el) => {
      try {
        const d = await window.LEM.getLesson(el.dataset.progress);
        if (!d) return;
        if (d.completed) {
          done[el.dataset.progress] = true;
          el.classList.add('done');
          el.textContent = typeof d.score === 'number' ? '✓ ' + d.score + '/' + d.total : '✓';
        } else if (typeof d.score === 'number') {
          el.textContent = '▶ ' + d.score + '/' + d.total;
        }
      } catch (e) {}
    }));
    if (!etatPlis() && u.role !== 'teacher') {
      const chaps = [...document.querySelectorAll('.som-chap[data-chap]')];
      const cible = chaps.find((c) => (c.dataset.exos || '').split(',').filter(Boolean).some((k) => !done[k]));
      if (cible) chaps.forEach((c) => c.classList.toggle('open', c === cible));
    }
  })();
}

render().then(() => {
  if (window.LEM && window.LEM.user) fillProgress();
  else document.addEventListener('lem-auth-ready', fillProgress);
}).catch((e) => console.error('[leo-et-moi] sommaire du niveau :', e));
