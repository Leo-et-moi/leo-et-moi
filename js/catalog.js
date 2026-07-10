// catalog.js — Chargement et interrogation du catalogue de contenu (leo-et-moi).
// Source de vérité : /catalog.json (voir PLAN_RESTRUCTURATION.md §2).
// Module ES sans effet de bord ; utilisé par les pages générées (Phase 2+).

let _catalog = null;

/** Charge le catalogue (une seule fois, mis en cache). */
export async function loadCatalog() {
  if (_catalog) return _catalog;
  const base = document.querySelector('base')?.href || '/';
  const res = await fetch(new URL('catalog.json', location.origin + '/'), { cache: 'no-cache' });
  if (!res.ok) throw new Error('catalog.json introuvable (' + res.status + ')');
  _catalog = await res.json();
  console.log('[leo-et-moi] catalogue chargé (v' + _catalog.version + ')');
  return _catalog;
}

const pub = (arr) => arr.filter((x) => x.publie);
const byOrdre = (a, b) => a.ordre - b.ordre;

/** Leçons publiées d'un niveau, ordonnées. */
export async function lecons(niveau) {
  const c = await loadCatalog();
  return pub(c.lecons).filter((l) => l.niveau === niveau).sort(byOrdre);
}

/** Exercices publiés d'un niveau, ordonnés. Option : filtrer par compétence. */
export async function exercices(niveau, competence = null) {
  const c = await loadCatalog();
  let list = pub(c.exercices).filter((e) => e.niveau === niveau);
  if (competence) list = list.filter((e) => (e.competences || []).includes(competence));
  return list.sort(byOrdre);
}

/** Compteurs { lecons, exercices } d'un niveau (entrées publiées). */
export async function compteurs(niveau) {
  return { lecons: (await lecons(niveau)).length, exercices: (await exercices(niveau)).length };
}

/** Tests publiés d'un niveau, ordonnés. */
export async function tests(niveau) {
  const c = await loadCatalog();
  return pub(c.tests || []).filter((t) => t.niveau === niveau).sort(byOrdre);
}

/** Retrouve un item (leçon, exercice ou test) par ID. */
export async function item(id) {
  const c = await loadCatalog();
  return c.lecons.find((l) => l.id === id) || c.exercices.find((e) => e.id === id)
    || (c.tests || []).find((t) => t.id === id) || null;
}

/** Leçons liées à un exercice (bandeau « revois la leçon »). */
export async function leconsDe(exerciceId) {
  const e = await item(exerciceId);
  if (!e || !e.lecons) return [];
  return (await Promise.all(e.lecons.map(item))).filter(Boolean);
}

/** Exercices liés à une leçon (« exercices liés »). */
export async function exercicesDe(leconId) {
  const l = await item(leconId);
  if (!l || !l.exercices) return [];
  return (await Promise.all(l.exercices.map(item))).filter(Boolean);
}

/** Prochain item du niveau après ceux déjà terminés (pour « Continuer », Phase 4).
 *  `terminesIds` : IDs terminés (depuis Firestore). Retourne le premier non terminé
 *  dans l'ordre pédagogique (leçons puis exercices entrelacés par `ordre`). */
export async function prochain(niveau, terminesIds) {
  const done = new Set(terminesIds || []);
  const ls = await lecons(niveau);
  const es = await exercices(niveau);
  const tout = [...ls.map((x) => ({ ...x, type: 'lecon' })), ...es.map((x) => ({ ...x, type: 'exercice' }))].sort(byOrdre);
  return tout.find((x) => !done.has(x.id)) || null;
}

/** URL audio complète (préparée pour un futur hébergement externe via audioBase). */
export async function audioUrl(chemin) {
  const c = await loadCatalog();
  return (c.audioBase || '') + chemin;
}
