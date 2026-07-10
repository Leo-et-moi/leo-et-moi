/* timer.js — Minuterie optionnelle + chronomètre silencieux (Phase 5).
   À inclure sur chaque page de leçon/exercice :  <script src="/js/timer.js"></script>

   1. MINUTERIE (visible, optionnelle — profil de Leo : il l'utilise ou pas).
      Bouton discret ⏱️ en bas à droite → widget Pomodoro 25 min (▶/⏸, ✕).
      La préférence est mémorisée dans Firestore (users/{uid}.timer) via LEM :
      activée une fois, elle apparaît sur toutes les pages ; masquée = masquée partout.
   2. CHRONOMÈTRE SILENCIEUX (invisible, toujours actif).
      Mesure le temps passé sur la page ; quand l'exercice enregistre
      completed=true, la durée (dureeSec) est ajoutée au score dans Firestore. */
(function () {
  'use strict';
  var t0 = Date.now();

  /* ── Chronomètre silencieux : enveloppe LEM.setLesson ── */
  function wrapLEM() {
    if (!window.LEM || !window.LEM.setLesson || window.LEM._timerWrapped) return;
    var orig = window.LEM.setLesson.bind(window.LEM);
    window.LEM.setLesson = function (id, partial) {
      try {
        if (partial && partial.completed === true && partial.dureeSec === undefined) {
          partial.dureeSec = Math.round((Date.now() - t0) / 1000);
        }
      } catch (e) {}
      return orig(id, partial);
    };
    window.LEM._timerWrapped = true;
  }

  /* ── Minuterie visible ── */
  var SECS = 25 * 60, left = SECS, running = false, iv = null, sound = null;
  var box, disp, playBtn, showBtn;

  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }

  function tick() {
    left--; disp.textContent = fmt(left);
    if (left <= 0) {
      clearInterval(iv); running = false; playBtn.textContent = '▶';
      disp.textContent = 'Pause de 5 min ! 🎉'; left = SECS;
      try { sound = new Audio('/french/audio/pomodoro_fin.mp3'); sound.play().catch(function(){}); } catch (e) {}
    }
  }
  function toggle() {
    if (running) { clearInterval(iv); running = false; playBtn.textContent = '▶'; }
    else { if (left === SECS) disp.textContent = fmt(left); iv = setInterval(tick, 1000); running = true; playBtn.textContent = '⏸'; }
  }
  function savePref(v) {
    try { if (window.LEM && window.LEM.saveUser) window.LEM.saveUser({ timer: v }); } catch (e) {}
  }
  function build() {
    showBtn = document.createElement('button');
    showBtn.textContent = '⏱️';
    showBtn.title = 'Afficher la minuterie (optionnel)';
    showBtn.style.cssText = 'position:fixed;right:12px;bottom:80px;z-index:90;width:48px;height:48px;' +
      'border-radius:50%;border:1px solid #D8DFE8;background:#FFFFFF;font-size:22px;cursor:pointer;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.15);';
    showBtn.onclick = function () { setVisible(true); savePref(true); };

    box = document.createElement('div');
    box.style.cssText = 'position:fixed;right:12px;bottom:80px;z-index:90;background:#1B2845;color:#fff;' +
      'border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:10px;' +
      'box-shadow:0 2px 10px rgba(0,0,0,0.25);font-family:Arial,sans-serif;';
    playBtn = document.createElement('button');
    playBtn.textContent = '▶';
    playBtn.setAttribute('aria-label', 'Démarrer / mettre en pause');
    playBtn.style.cssText = 'width:44px;height:44px;border-radius:50%;border:none;background:#E8503A;color:#fff;font-size:18px;cursor:pointer;';
    playBtn.onclick = toggle;
    disp = document.createElement('div');
    disp.textContent = fmt(SECS);
    disp.style.cssText = 'font-size:20px;font-weight:bold;min-width:64px;text-align:center;';
    var close = document.createElement('button');
    close.textContent = '✕';
    close.title = 'Masquer la minuterie';
    close.style.cssText = 'background:none;border:none;color:#9DC8E8;font-size:16px;cursor:pointer;min-width:32px;min-height:32px;';
    close.onclick = function () { if (running) toggle(); setVisible(false); savePref(false); };
    box.appendChild(playBtn); box.appendChild(disp); box.appendChild(close);

    document.body.appendChild(showBtn);
    document.body.appendChild(box);
    setVisible(false);
  }
  function setVisible(v) { box.style.display = v ? 'flex' : 'none'; showBtn.style.display = v ? 'none' : 'block'; }

  function init() {
    build();
    wrapLEM();
    document.addEventListener('lem-auth-ready', function () {
      wrapLEM();
      try {
        window.LEM.getUser().then(function (u) { if (u && u.timer === true) setVisible(true); }).catch(function () {});
      } catch (e) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
