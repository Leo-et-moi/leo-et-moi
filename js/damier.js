/* damier.js — Gabarit « Damier QCM » (motif A2-L-002 gabaritisé, GO Eric 28/08/2026).
   Phrase à trous + choix ; la bonne réponse remplit le blanc et JOUE son audio.
   Usage :
     LeoDamier.render(host, cartes, { onDone })
     carte = { qui: "Youssef → Lucas" (optionnel),
               phrase: "Ton <b>oncle</b> s'appelle Paul ; ____ s'appelle Marc.",
               tag: "masc. sing." (optionnel),
               options: [ { txt:"le tien", ok:true, audio:"pp_d1.mp3" },
                          { txt:"la tienne" }, … ] }
   Mauvais choix → rouge, on peut réessayer ; bon choix → vert, blanc rempli, audio. */
(function () {
  'use strict';
  function render(host, cartes, opts) {
    opts = opts || {};
    var faits = 0;
    cartes.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'dcard';
      var html = '';
      if (c.qui) html += '<div class="dc-who">' + c.qui + '</div>';
      html += '<div class="dc-q">' + c.phrase.replace('____', '<span class="blank">____</span>');
      if (c.tag) html += ' <span class="dc-tag">' + c.tag + '</span>';
      html += '</div>';
      card.innerHTML = html;
      var zone = document.createElement('div');
      zone.className = 'dc-opts';
      c.options.forEach(function (o) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.innerHTML = o.txt;
        b.onclick = function () {
          if (card.dataset.done) return;
          if (o.ok) {
            b.classList.add('ok');
            var bl = card.querySelector('.blank');
            if (bl) { bl.textContent = o.txt; bl.classList.add('filled'); }
            card.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
            card.dataset.done = '1';
            if (o.audio && window.playClip) window.playClip(o.audio, b);
            faits++;
            if (faits >= cartes.length && opts.onDone) opts.onDone(cartes.length);
          } else {
            b.classList.add('ng');
            b.disabled = true;
          }
        };
        zone.appendChild(b);
      });
      card.appendChild(zone);
      host.appendChild(card);
    });
  }
  window.LeoDamier = { render: render };
})();
