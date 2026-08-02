/* audio.js — Lecteur MP3 unique du site leo-et-moi (gabarit partagé, Phase 1).
   Comportement standard (GUIDE §3) : re-clic = pause ; re-clic = reprise ;
   un autre bouton arrête le précédent ; jamais deux sons en même temps.
   API (globale, compatible avec les pages existantes) :
     playClip(fichier, bouton)  → joue  <dossier de la page>/audio/<fichier>
     playAudio(src, bouton)     → joue  src tel quel (pages Être/Avoir)
   Le bouton reçoit la classe CSS 'speaking' pendant la lecture. */
(function () {
  'use strict';
  var _clip = null, _btn = null, _key = null;

  function _off() { if (_btn) _btn.classList.remove('speaking'); }

  /* Retrouve le bouton même si la page ne l'a pas transmis (demande Opus 20/07 :
     robustesse par défaut — pause/reprise fonctionnent sans le 2e argument). */
  function _resolveBtn(btn) {
    if (btn) return btn;
    try {
      var e = window.event;
      if (e) {
        var t = (e.currentTarget && e.currentTarget.tagName) ? e.currentTarget : e.target;
        if (t && t.closest) { var b = t.closest('button'); if (b) return b; }
      }
    } catch (err) {}
    var a = document.activeElement;
    return (a && a.tagName === 'BUTTON') ? a : null;
  }

  function _play(url, btn, key) {
    btn = _resolveBtn(btn);
    if (_clip && _key === key) {                            // même son (bouton connu ou non)
      if (!_clip.paused) { _clip.pause(); _off(); return; } // → pause
      if (btn) _btn = btn;
      _clip.play().catch(function () {});                   // → reprise
      if (_btn) _btn.classList.add('speaking');
      return;
    }
    try { if (_clip) _clip.pause(); } catch (e) {}          // arrêt du précédent
    _off();
    _clip = new Audio(url); _btn = btn || null; _key = key;
    _wireBoost(_clip);
    if (_btn) _btn.classList.add('speaking');
    _clip.onended = _clip.onerror = _off;
    _clip.play().catch(_off);
  }

  /* ── Mode classe 📢 (demande Eric, 26/07/2026) ─────────────────────────
     Amplifie tous les audios (~2×, compresseur anti-saturation) pour la salle
     de classe. Bouton visible seulement pour le professeur ; préférence
     mémorisée PAR APPAREIL (localStorage) : l'ordinateur de la classe reste
     amplifié, les appareils des élèves ne changent pas. */
  var _boost = { on: false, ctx: null, comp: null, gain: null };
  try { _boost.on = localStorage.getItem('lemModeClasse') === '1'; } catch (e) {}

  function _wireBoost(clip) {
    if (!_boost.on) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!_boost.ctx) {
        _boost.ctx = new AC();
        _boost.comp = _boost.ctx.createDynamicsCompressor();
        _boost.gain = _boost.ctx.createGain();
        _boost.gain.gain.value = 2.2;
        _boost.comp.connect(_boost.gain);
        _boost.gain.connect(_boost.ctx.destination);
      }
      _boost.ctx.createMediaElementSource(clip).connect(_boost.comp);
      if (_boost.ctx.state === 'suspended') _boost.ctx.resume();
    } catch (e) {}
  }

  function _boostBtnUI(btn) {
    btn.textContent = _boost.on ? '📢 Son amplifié · Loud ON' : '🔈 Amplifier le son · Louder';
    btn.style.background = _boost.on ? '#E8503A' : '#FFFFFF';
    btn.style.color = _boost.on ? '#fff' : '#4A6580';
  }
  function _mountBoostBtn() {
    if (document.getElementById('lemModeClasse')) return;
    var b = document.createElement('button');
    b.id = 'lemModeClasse';
    b.title = 'Amplifie tous les audios sur cet appareil · Boosts all audio on this device. ⚠️ Baisse le volume si tu portes un casque · Lower the volume if you wear headphones.';
    b.style.cssText = 'position:fixed;left:12px;bottom:80px;z-index:90;border:1.5px solid #D8DFE8;' +
      'border-radius:20px;padding:8px 14px;font-size:13px;font-weight:bold;cursor:pointer;' +
      'font-family:Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.15);min-height:40px;';
    _boostBtnUI(b);
    b.onclick = function () {
      _boost.on = !_boost.on;
      try { localStorage.setItem('lemModeClasse', _boost.on ? '1' : '0'); } catch (e) {}
      if (_boost.gain) _boost.gain.gain.value = 2.2;   // le réglage s'applique aux lectures suivantes
      _boostBtnUI(b);
    };
    document.body.appendChild(b);
  }
  // Ouvert à tous depuis le 26/07 (décision Eric) : élèves compris, par appareil.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _mountBoostBtn);
  else _mountBoostBtn();

  window.playClip = function (file, btn) { _play('audio/' + file, btn, 'clip:' + file); };
  window.playAudio = function (src, btn) { _play(src, btn, 'src:' + src); };
  window.stopAudio = function () { try { if (_clip) _clip.pause(); } catch (e) {} _off(); };
})();
