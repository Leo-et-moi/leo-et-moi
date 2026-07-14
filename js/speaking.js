/* speaking.js — Exercice d'oral SANS enregistrement (gabarit partagé, Phase 1).
   Principe validé par Eric : audio modèle → l'élève répète à voix haute →
   auto-évaluation en un clic (😕 🙂 😃), enregistrée comme un score.
   Conçu pour accueillir l'enregistrement réel (Firebase Blaze + Cloud Storage)
   le jour venu, sans changer les pages.
   Usage : LeoSpeaking.render(host, items, { onDone(score, total) })
     items : [{ fr: "phrase à répéter", en: "traduction", audio: "fichier.mp3" }]
   Barème : 😕 = 0 pt, 🙂 = 0,5 pt, 😃 = 1 pt. */
(function () {
  'use strict';
  var FACES = [
    { e: '😕', pts: 0,   label: 'Difficile / Hard' },
    { e: '🙂', pts: 0.5, label: 'Presque / Almost' },
    { e: '😃', pts: 1,   label: 'Facile / Easy' }
  ];

  function render(host, items, opts) {
    opts = opts || {};
    var score = 0, done = 0, total = items.length;
    items.forEach(function (it, n) {
      var card = document.createElement('div'); card.className = 'card speak';
      var head = document.createElement('div'); head.className = 'q-head';
      var play = document.createElement('button'); play.className = 't-play';
      play.innerHTML = '🔊'; play.setAttribute('aria-label', 'Écouter le modèle');
      play.onclick = function () { window.playClip(it.audio, play); };
      var txt = document.createElement('div'); txt.className = 'q-text';
      txt.innerHTML = (n + 1) + '. Écoute, puis répète à voix haute : <b>' + it.fr + '</b>';
      head.appendChild(play); head.appendChild(txt); card.appendChild(head);
      if (it.en) {
        var en = document.createElement('span'); en.className = 'en';
        if (it.audioEn) {
          var be = document.createElement('button'); be.className = 't-en'; be.textContent = '🔊 EN';
          be.setAttribute('aria-label', 'English');
          be.onclick = function () { window.playClip(it.audioEn, be); };
          en.appendChild(be); en.appendChild(document.createTextNode(' '));
        }
        en.appendChild(document.createTextNode(it.en));
        card.appendChild(en);
      }

      var row = document.createElement('div'); row.className = 'selfeval';
      var pickd = false;
      FACES.forEach(function (f) {
        var b = document.createElement('button'); b.textContent = f.e; b.title = f.label;
        b.setAttribute('aria-label', f.label);
        b.onclick = function () {
          if (pickd) return; pickd = true; done++;
          score += f.pts; b.classList.add('sel');
          row.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
          if (done >= total && opts.onDone) opts.onDone(score, total);
        };
        row.appendChild(b);
      });
      card.appendChild(row);
      host.appendChild(card);
    });
    return { total: total };
  }

  window.LeoSpeaking = { render: render };
})();
