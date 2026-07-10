/* ui.js — Composants communs pilotés par le catalogue (gabarit partagé, Phase 1).
   Module ES. Génère le bandeau « 📖 revois la leçon » sur les exercices,
   la liste « ✏️ exercices liés » sur les leçons, et les badges de compétences.
   La page déclare son identité :  <body data-item-id="A1-E-003"> */
import { item, leconsDe, exercicesDe } from './catalog.js';

const BADGES = { listening: '🎧 Écoute', reading: '📖 Lecture', writing: '✍️ Écriture', speaking: '🗣️ Oral' };
const rootRel = (chemin) => '/' + chemin;

/** Bandeau « revois la leçon » — à appeler sur les pages d'exercice. */
export async function bandeauRevoir(hostSelector = '.revoir-host') {
  const id = document.body.dataset.itemId;
  if (!id) return;
  const ls = await leconsDe(id);
  if (!ls.length) return;
  const div = document.createElement('div');
  div.className = 'revoir';
  const liens = ls.map((l) => `<a href="${rootRel(l.chemin)}"><b>${l.titre}</b></a>`).join(' · ');
  div.innerHTML = `📖 Avant de commencer, revois la leçon : ${liens} →`;
  const host = document.querySelector(hostSelector) || document.body;
  host.prepend(div);
}

/** Liste « exercices liés » — à appeler sur les pages de leçon. */
export async function exercicesLies(hostSelector = '.exercices-host') {
  const id = document.body.dataset.itemId;
  if (!id) return;
  const es = await exercicesDe(id);
  if (!es.length) return;
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = '<b>✏️ Exercices liés</b>' + es.map((e) =>
    `<p><a href="${rootRel(e.chemin)}">${e.titre}</a> ${badges(e.competences)}</p>`).join('');
  const host = document.querySelector(hostSelector) || document.body;
  host.appendChild(div);
}

/** Badges HTML pour une liste de compétences. */
export function badges(competences) {
  return (competences || []).map((c) => `<span class="comp-badge">${BADGES[c] || c}</span>`).join('');
}
