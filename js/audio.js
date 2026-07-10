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

  function _play(url, btn, key) {
    if (_btn === btn && _clip && _key === key) {          // même bouton, même son
      if (!_clip.paused) { _clip.pause(); _off(); return; } // → pause
      _clip.play().catch(function () {});                   // → reprise
      if (_btn) _btn.classList.add('speaking');
      return;
    }
    try { if (_clip) _clip.pause(); } catch (e) {}          // arrêt du précédent
    _off();
    _clip = new Audio(url); _btn = btn || null; _key = key;
    if (_btn) _btn.classList.add('speaking');
    _clip.onended = _clip.onerror = _off;
    _clip.play().catch(_off);
  }

  window.playClip = function (file, btn) { _play('audio/' + file, btn, 'clip:' + file); };
  window.playAudio = function (src, btn) { _play(src, btn, 'src:' + src); };
  window.stopAudio = function () { try { if (_clip) _clip.pause(); } catch (e) {} _off(); };
})();
