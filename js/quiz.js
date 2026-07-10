/* quiz.js — Moteur d'exercices QCM / vrai-faux (gabarit partagé, Phase 1).
   Règles (GUIDE §3) : zéro saisie clavier, feedback immédiat, et surtout :
   quand on mélange les options, l'index de la bonne réponse est TOUJOURS
   re-synchronisé (bug historique du B1 interrogatifs).
   Usage :
     LeoQuiz.render(hostElement, questions, options)
       questions : [{ q: "html", options: ["...",...], bonneReponse: 0,
                      audio: "fichier.mp3" (optionnel), en: "english" (optionnel) }]
       options   : { melanger: true, onScore(score, total), onDone(score, total) } */
(function () {
  'use strict';

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* Mélange les options d'UNE question en re-synchronisant bonneReponse. */
  function shuffleOptions(q) {
    var idx = q.options.map(function (_, i) { return i; });
    shuffle(idx);
    return {
      q: q.q, audio: q.audio, en: q.en,
      options: idx.map(function (i) { return q.options[i]; }),
      bonneReponse: idx.indexOf(q.bonneReponse)
    };
  }

  function render(host, questions, opts) {
    opts = opts || {};
    var score = 0, done = 0, total = questions.length;
    var list = (opts.melanger === false) ? questions.slice() : questions.map(shuffleOptions);

    list.forEach(function (q, n) {
      var card = document.createElement('div'); card.className = 'card q';
      var head = document.createElement('div'); head.className = 'q-head';
      if (q.audio) {
        var play = document.createElement('button'); play.className = 't-play';
        play.innerHTML = '🔊'; play.setAttribute('aria-label', 'Écouter');
        play.onclick = function () { window.playClip(q.audio, play); };
        head.appendChild(play);
      }
      var txt = document.createElement('div'); txt.className = 'q-text'; txt.innerHTML = (n + 1) + '. ' + q.q;
      head.appendChild(txt); card.appendChild(head);
      if (q.en) { var en = document.createElement('span'); en.className = 'en'; en.textContent = q.en; card.appendChild(en); }

      var answered = false;
      q.options.forEach(function (label, i) {
        var b = document.createElement('button'); b.className = 'opt'; b.innerHTML = label;
        b.onclick = function () {
          if (answered) return; answered = true; done++;
          var ok = (i === q.bonneReponse);
          if (ok) { score++; b.classList.add('good'); }
          else {
            b.classList.add('bad');
            card.querySelectorAll('.opt')[q.bonneReponse].classList.add('good');
          }
          card.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          if (opts.onScore) opts.onScore(score, total, done);
          if (done >= total && opts.onDone) opts.onDone(score, total);
        };
        card.appendChild(b);
      });
      host.appendChild(card);
    });
    return { total: total };
  }

  window.LeoQuiz = { render: render, shuffleOptions: shuffleOptions, shuffle: shuffle };
})();
