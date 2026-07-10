/* ui.js — Composants communs pilotés par le catalogue (Phase 3).
   Module ES. Styles inline : aucun CSS externe requis, les pages existantes
   gardent leur mise en forme propre.
   La page déclare son identité :  <body data-item-id="A1-E-003">
   - bandeauRevoir()  : « 📖 revois la leçon » inséré dans .revoir-host
                        (ou en tête de <main> à défaut) — pages d'exercice.
   - exercicesLies()  : « ✏️ Exercices liés » inséré dans .exercices-host
                        (ou en fin de <main> à défaut) — pages de leçon. */
import { item, leconsDe, exercicesDe } from './catalog.js';

const BADGES = { listening: '🎧 Écoute', reading: '📖 Lecture', writing: '✍️ Écriture', speaking: '🗣️ Oral' };
const S = {
  revoir: 'background:#FBF3E2;border:1px solid #D4920A;border-radius:12px;padding:12px 16px;' +
          'margin:14px 0;font-size:17px;line-height:1.5;',
  lien:   'color:#2C4A7C;font-weight:bold;',
  carte:  'background:#FFFFFF;border:1px solid #D8DFE8;border-radius:14px;padding:16px;margin:16px 0;',
  titre:  'font-size:19px;font-weight:bold;color:#1B2845;margin-bottom:8px;',
  ligne:  'margin:10px 0;font-size:17px;',
  badge:  'font-size:14px;background:#EDE8DF;border-radius:8px;padding:2px 8px;margin-left:6px;white-space:nowrap;'
};

export function badges(competences) {
  return (competences || []).map((c) => `<span class="comp-badge" style="${S.badge}">${BADGES[c] || c}</span>`).join('');
}

function hostOr(selector, fallbackPrepend) {
  const h = document.querySelector(selector);
  if (h) return { el: h, mode: 'append' };
  const main = document.querySelector('main.main, main, .main');
  return { el: main || document.body, mode: fallbackPrepend ? 'prepend' : 'append' };
}

/** Bandeau « revois la leçon » — pages d'exercice. */
export async function bandeauRevoir() {
  const id = document.body.dataset.itemId;
  if (!id) return;
  const ls = await leconsDe(id);
  if (!ls.length) return;
  const div = document.createElement('div');
  div.className = 'revoir';
  div.style.cssText = S.revoir;
  const liens = ls.map((l) => `<a href="/${l.chemin}" style="${S.lien}">${l.titre} &#8594;</a>`).join(' · ');
  div.innerHTML = `&#128214; Avant de commencer, revois la le&ccedil;on&nbsp;: ${liens}`;
  const { el, mode } = hostOr('.revoir-host', true);
  if (mode === 'prepend') el.prepend(div); else el.appendChild(div);
}

/** Liste « exercices liés » — pages de leçon. */
export async function exercicesLies() {
  const id = document.body.dataset.itemId;
  if (!id) return;
  const es = await exercicesDe(id);
  if (!es.length) return;
  const div = document.createElement('div');
  div.style.cssText = S.carte;
  div.innerHTML = `<div style="${S.titre}">&#9999;&#65039; Exercices li&eacute;s</div>` +
    es.map((e) => `<div style="${S.ligne}"><a href="/${e.chemin}" style="${S.lien}">${e.titre} &#8594;</a>${badges(e.competences)}</div>`).join('');
  const { el } = hostOr('.exercices-host', false);
  el.appendChild(div);
}
