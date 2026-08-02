/* notifications.js — Cloche 🔔 vivante : nouveautés du catalogue, filtrées par
   le niveau de l'élève connecté (le prof voit tous les niveaux). Demande Eric, 26/07/2026.
   - « Nouveau » = entrée du catalogue avec une date `ajoute` < 21 jours ;
   - pastille rouge = items pas encore VUS (repère : users/{uid}.lastSeenNews) ;
   - ouvrir le panneau marque tout comme vu (la pastille disparaît) ;
   - le badge 🆕 des listes disparaît, lui, quand l'item est TERMINÉ (autre cycle). */
import { loadCatalog } from './catalog.js';

const RECENT_JOURS = 21;
const LVLCOLOR = { A1:'#C0392B', A2:'#E07B39', B1:'#D4920A', B2:'#7CB82F', C1:'#27AE60', C2:'#1A5C38' };

function tousItems(c) {
  const t = (arr, type, lien) => (arr || []).map((x) => Object.assign({ type, lien: lien(x) }, x));
  return [
    ...t(c.lecons, 'Leçon', (x) => '/' + x.chemin),
    ...t(c.exercices, 'Exercice', (x) => '/' + x.chemin),
    ...t(c.tests, 'Test', (x) => '/french/tests/test.html?id=' + x.id)
  ];
}

function injecteStyles() {
  if (document.getElementById('notifStyles') || document.querySelector('link[href*="site.css"]')) return;
  const s = document.createElement('style');
  s.id = 'notifStyles';
  s.textContent = `
.notif-dot{position:absolute;top:6px;right:6px;min-width:18px;height:18px;border-radius:9px;background:#E8503A;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;padding:0 4px;pointer-events:none;}
.notif-panel{position:fixed;top:64px;right:10px;z-index:200;width:min(340px,92vw);background:#fff;border:1px solid #D8DFE8;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:10px;font-family:Arial,sans-serif;}
.notif-panel h3{font-size:16px;color:#1B2845;margin:4px 6px 8px;}
.notif-item{display:block;padding:9px 8px;border-top:1px solid #D8DFE8;text-decoration:none;color:#1A2733;font-size:15px;border-radius:8px;}
.notif-item .nv{font-weight:bold;color:#fff;font-size:11px;border-radius:6px;padding:1px 7px;margin-right:6px;}
.notif-vide{padding:14px 8px;color:#4A6580;font-size:14px;}`;
  document.head.appendChild(s);
}

async function init() {
  injecteStyles();
  const bell = document.querySelector('button[title="Notifications"]');
  if (!bell) return;
  bell.style.position = 'relative';
  const c = await loadCatalog();

  const demarre = async () => {
    let u = {};
    try { u = await window.LEM.getUser() || {}; } catch (e) {}
    const lvl = (u.level || 'a1').toUpperCase();
    const estProf = u.role === 'teacher';
    const vu = Number(u.lastSeenNews || 0);
    const now = Date.now();

    const news = tousItems(c)
      .filter((x) => x.publie && x.ajoute)
      .map((x) => Object.assign({ ts: Date.parse(x.ajoute) }, x))
      .filter((x) => now - x.ts < RECENT_JOURS * 86400000 && (estProf || x.niveau === lvl))
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 10);

    const nonVus = news.filter((x) => x.ts > vu).length;
    let dot = null;
    if (nonVus) {
      dot = document.createElement('span');
      dot.className = 'notif-dot';
      dot.textContent = nonVus;
      bell.appendChild(dot);
    }

    let panel = null;
    bell.onclick = () => {
      if (panel) { panel.remove(); panel = null; return; }
      panel = document.createElement('div');
      panel.className = 'notif-panel';
      let html = '<h3>🔔 Nouveautés' + (estProf ? '' : ' — niveau ' + lvl) + '</h3>';
      if (!news.length) html += '<div class="notif-vide">Rien de nouveau pour l’instant. Reviens bientôt !<br><span style="font-size:12px;">Nothing new yet — check back soon!</span></div>';
      panel.innerHTML = html;
      news.forEach((x) => {
        const a = document.createElement('a');
        a.className = 'notif-item';
        a.href = x.lien;
        a.innerHTML = '<span class="nv" style="background:' + (LVLCOLOR[x.niveau] || '#888') + '">' + x.niveau + '</span>' +
          '<b>' + x.titre + '</b> <span style="color:#4A6580;font-size:13px;">· ' + x.type + '</span>';
        panel.appendChild(a);
      });
      document.body.appendChild(panel);
      if (dot) { dot.remove(); dot = null; }
      try { window.LEM.saveUser({ lastSeenNews: now }); } catch (e) {}
      const ferme = (ev) => { if (panel && !panel.contains(ev.target) && ev.target !== bell) { panel.remove(); panel = null; document.removeEventListener('click', ferme, true); } };
      setTimeout(() => document.addEventListener('click', ferme, true), 0);
    };
  };
  if (window.LEM && window.LEM.user) demarre();
  else document.addEventListener('lem-auth-ready', demarre);
}

init().catch((e) => console.error('[leo-et-moi] nouveautés :', e));
