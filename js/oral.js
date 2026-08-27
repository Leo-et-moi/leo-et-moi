/* oral.js — Gabarit « Enregistreur oral local » (motif A2-E-009 gabaritisé,
   GO Eric 28/08/2026). L'élève lit des phrases à trous à voix haute, s'enregistre
   (MediaRecorder, 100 % local — rien n'est envoyé), se réécoute, télécharge,
   puis SEULEMENT alors peut révéler les réponses (en rouge).
   Usage :
     LeoOral.render(host, blocs, { progressId, nomFichier })
     bloc = { titre: "Onglet 1 — La famille", consigne: "Trouve et dis le bon pronom :",
              lignes: [ "Mon neveu s'appelle Youssef ; {le tien} s'appelle Karim." ] }
     — chaque {réponse} devient un trou masqué. */
(function () {
  'use strict';
  var seq = 0;
  function render(host, blocs, opts) {
    opts = opts || {};
    blocs.forEach(function (bl) {
      var id = ++seq;
      var box = document.createElement('div');
      box.className = 'readbox';
      var html = '<div class="rbh">👀 ' + (bl.titre ? bl.titre + ' — ' : '') + (bl.consigne || 'Lis à voix haute, puis enregistre-toi :') + '</div>';
      html += '<div id="oral-p' + id + '">';
      bl.lignes.forEach(function (l) {
        html += '<div class="rl">' + l.replace(/\{([^}]+)\}/g, '<span class="hole" data-ans="$1">____</span>') + '</div>';
      });
      html += '</div>';
      box.innerHTML = html;
      var b = document.createElement('button');
      b.className = 'recbtn';
      b.textContent = '⏺ Enregistrer / Record';
      var out = document.createElement('div');
      out.id = 'oral-out' + id;
      var st = {};
      b.onclick = function () {
        if (st.mr && st.mr.state === 'recording') { st.mr.stop(); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          var mr = new MediaRecorder(stream), ch = [];
          st.mr = mr;
          mr.ondataavailable = function (e) { ch.push(e.data); };
          mr.onstop = function () {
            var u = URL.createObjectURL(new Blob(ch, { type: 'audio/webm' }));
            out.innerHTML = '<audio controls src="' + u + '"></audio>' +
              '<a class="dl" download="' + (opts.nomFichier || 'oral') + '_' + id + '.webm" href="' + u + '">⬇ Télécharger / Download</a>' +
              '<div style="margin-top:8px"><button class="btn-secondary" style="border:none;">👁 Voir les réponses / Show answers</button></div>';
            out.querySelector('.btn-secondary').onclick = function () {
              document.querySelectorAll('#oral-p' + id + ' .hole').forEach(function (h) {
                h.textContent = h.dataset.ans;
                h.classList.add('shown');
              });
            };
            b.textContent = '⏺ Recommencer / Record again';
            b.classList.remove('recording');
            stream.getTracks().forEach(function (t) { t.stop(); });
            try {
              if (opts.progressId && window.LEM && window.LEM.setLesson && !window.LEM.demo) {
                window.LEM.setLesson(opts.progressId, { completed: true, lastPracticed: Date.now() });
              }
            } catch (e) {}
          };
          mr.start();
          b.textContent = '⏹ Arrêter / Stop';
          b.classList.add('recording');
        }).catch(function () { alert('Micro non disponible / Microphone not available.'); });
      };
      box.appendChild(b);
      box.appendChild(out);
      host.appendChild(box);
    });
  }
  window.LeoOral = { render: render };
})();
