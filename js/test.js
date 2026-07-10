/* test.js — Moteur de tests et examens (Phase 7).
   Page :  /french/tests/test.html?id=A1-T-001
   Définition dans catalog.json (section "tests") :
     sources     : IDs d'exercices dont on tire les questions (banques JSON)
     nbQuestions : taille du tirage (équilibré entre les sources, tour à tour)
     duree       : minutes (compte à rebours, soumission douce à 0) ou null
   Comportements validés par Eric :
   - chronomètre SILENCIEUX toujours actif → dureeSec enregistré avec le score ;
   - compte à rebours visible SEULEMENT si duree est défini (décision du prof) ;
   - à l'expiration : on soumet ce qui est fait, jamais de couperet ;
   - une question à la fois (profil TDAH : un seul focus), feedback immédiat,
     options mélangées avec re-synchronisation de la bonne réponse. */
import { loadCatalog } from './catalog.js';

const $ = (id) => document.getElementById(id);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const t0 = Date.now();
let def = null, picked = [], cur = 0, score = 0, finished = false, cdIv = null;

function shuffleOptions(q) {
  const idx = q.options.map((_, i) => i);
  shuffle(idx);
  return Object.assign({}, q, {
    options: idx.map((i) => q.options[i]),
    bonneReponse: idx.indexOf(q.bonneReponse)
  });
}

async function init() {
  const id = new URLSearchParams(location.search).get('id');
  const c = await loadCatalog();
  def = (c.tests || []).find((t) => t.id === id && t.publie);
  if (!def) { $('titre').textContent = 'Test introuvable'; return; }
  document.title = def.titre + ' — Leo-et-moi';
  $('titre').textContent = (def.type === 'examen' ? '🎓 ' : '📝 ') + def.titre;

  const exs = def.sources.map((s) => c.exercices.find((e) => e.id === s)).filter((e) => e && e.questions);
  const banks = await Promise.all(exs.map((e) => fetch('/' + e.questions).then((r) => r.json())));
  const per = banks.map((b) => shuffle(b.questions.filter((q) => !q.contexte).map((q) => ({ q, base: b.audioBase }))));

  // Tirage équilibré : une question de chaque source, tour à tour
  const max = Math.min(def.nbQuestions, per.reduce((n, a) => n + a.length, 0));
  let k = 0;
  while (picked.length < max) {
    const a = per[k % per.length];
    if (a.length) picked.push(a.pop());
    k++;
  }
  shuffle(picked);

  $('intro').innerHTML = picked.length + ' questions' +
    (def.duree ? ' · ' + def.duree + ' minutes' : ' · sans limite de temps') +
    '<br><span class="en" style="text-align:left;">' + picked.length + ' questions' +
    (def.duree ? ' · ' + def.duree + ' minutes' : ' · no time limit') + '</span>';
  $('start').style.display = 'inline-block';
  $('start').onclick = start;
}

function start() {
  $('accueilTest').style.display = 'none';
  $('zone').style.display = 'block';
  if (def.duree) {
    $('compte').style.display = 'block';
    let left = def.duree * 60;
    const aff = () => { $('compte').textContent = '⏳ ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); };
    aff();
    cdIv = setInterval(() => {
      left--; aff();
      if (left <= 0) { clearInterval(cdIv); finish(true); }
    }, 1000);
  }
  montre();
}

function montre() {
  if (cur >= picked.length) { finish(false); return; }
  const { q: raw, base } = picked[cur];
  const q = shuffleOptions(raw);
  $('avance').textContent = 'Question ' + (cur + 1) + ' / ' + picked.length;
  $('barre').style.width = Math.round(100 * cur / picked.length) + '%';
  const host = $('question');
  host.innerHTML = '';
  const card = document.createElement('div'); card.className = 'card';
  const head = document.createElement('div');
  head.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;';
  if (q.audio && base) {
    const b = document.createElement('button'); b.className = 't-play'; b.innerHTML = '🔊';
    b.setAttribute('aria-label', 'Écouter');
    b.onclick = () => window.playAudio('/' + base + q.audio, b);
    head.appendChild(b);
  }
  const txt = document.createElement('div'); txt.innerHTML = q.q; txt.style.fontSize = '19px';
  head.appendChild(txt); card.appendChild(head);
  if (q.en) { const en = document.createElement('span'); en.className = 'en'; en.textContent = q.en; card.appendChild(en); }
  let answered = false;
  q.options.forEach((label, i) => {
    const b = document.createElement('button'); b.className = 'opt'; b.innerHTML = label;
    b.onclick = () => {
      if (answered) return; answered = true;
      const ok = i === q.bonneReponse;
      if (ok) { score++; b.classList.add('good'); }
      else { b.classList.add('bad'); card.querySelectorAll('.opt')[q.bonneReponse].classList.add('good'); }
      card.querySelectorAll('.opt').forEach((x) => { x.disabled = true; });
      const next = document.createElement('button'); next.className = 'btn-primary';
      next.style.cssText = 'margin-top:12px;border:none;';
      next.textContent = (cur + 1 < picked.length) ? 'Question suivante →' : 'Voir mon résultat →';
      next.onclick = () => { cur++; montre(); };
      card.appendChild(next);
    };
    card.appendChild(b);
  });
  host.appendChild(card);
}

function finish(expire) {
  if (finished) return; finished = true;
  if (cdIv) clearInterval(cdIv);
  window.stopAudio && window.stopAudio();
  const total = picked.length;
  const dureeSec = Math.round((Date.now() - t0) / 1000);
  $('zone').style.display = 'none';
  const fin = $('fin');
  fin.style.display = 'block';
  const pct = total ? score / total : 0;
  const msg = expire
    ? 'Le temps est écoulé — voici ce que tu as fait. C\'est déjà du travail !'
    : (pct >= 0.8 ? 'Excellent ! 🎉' : pct >= 0.5 ? 'Bien joué ! Continue comme ça.' : 'Bon début — revois les leçons et retente ta chance.');
  const min = Math.floor(dureeSec / 60), sec = dureeSec % 60;
  fin.innerHTML = '<div class="card" style="text-align:center;">' +
    '<div style="font-size:42px;font-weight:bold;color:#1B2845;">' + score + ' / ' + total + '</div>' +
    '<p style="font-size:19px;">' + msg + '</p>' +
    '<p style="color:#4A6580;">Temps : ' + min + ' min ' + (sec < 10 ? '0' : '') + sec + ' s</p>' +
    '<a class="btn-secondary" style="display:inline-block;text-decoration:none;padding:12px 20px;border-radius:12px;" href="/french/' + def.niveau.toLowerCase() + '/index.html">← Retour au niveau ' + def.niveau + '</a></div>';
  try {
    if (window.LEM && window.LEM.setLesson) {
      window.LEM.setLesson(def.id, { score, total, completed: true, dureeSec, type: 'test', lastPracticed: Date.now() });
    }
  } catch (e) {}
}

init().catch((e) => { $('titre').textContent = 'Erreur de chargement'; console.error('[leo-et-moi] test :', e); });
