/* LeoPick — composant « cartes à choix » multi-réponses (gabarit partagé).
   Extrait des pages A1 (pronoms toniques / Être / Avoir). Comportement identique :
   - multi-correct : au bon choix, toutes les .opt.ok se surlignent ; si plusieurs
     bonnes réponses, bannière .pick-both « ✓ Les N réponses… · All N answers… » ;
   - score 1re tentative par défaut (une carte ratée au moins une fois ne compte pas) ;
     passer opts.firstTry=false pour un score simple (leçon non notée) ;
   - remplissage du trou ____ (.blank.filled) ; audio via window.playClip ;
   - callbacks opts.onScore(score,total) et opts.onDone(score,total).
   API inchangée : LeoPick(host, items, opts). */
function LeoPick(host, items, opts){
  opts = opts || {};
  var firstTry = opts.firstTry !== false;      // défaut : score 1re tentative
  var total = items.length, done = 0, score = 0;
  items.forEach(function(it){
    var card = document.createElement('div'); card.className = 'dcard';
    var q = document.createElement('div'); q.className = 'dc-q';
    q.innerHTML = (it.phrase.indexOf('____') >= 0)
      ? it.phrase.replace('____', '<span class="blank">____</span>')
      : it.phrase;
    if(it.tag){ q.innerHTML += ' <span class="dc-tag">' + it.tag + '</span>'; }
    card.appendChild(q);
    var zone = document.createElement('div'); zone.className = 'dc-opts'; card.appendChild(zone);
    var arr = it.options.slice();
    for(var i = arr.length - 1; i > 0; i--){ var j = Math.floor(Math.random()*(i+1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    var nok = it.options.filter(function(o){ return o.ok; }).length;
    arr.forEach(function(o){
      var b = document.createElement('button'); b.className = 'opt'; b.innerHTML = o.txt; b._o = o;
      b.onclick = function(){
        if(card.dataset.done) return;
        if(o.ok){
          card.dataset.done = '1'; done++;
          if(firstTry){ if(!card._w) score++; } else { score++; }
          var bl = card.querySelector('.blank'); if(bl){ bl.textContent = o.txt; bl.classList.add('filled'); }
          if(o.audio && window.playClip) window.playClip(o.audio, b);
          zone.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; if(x._o.ok) x.classList.add('ok'); });
          if(nok > 1){
            var bg = document.createElement('div'); bg.className = 'pick-both';
            bg.innerHTML = '✓ Les ' + nok + ' réponses sont correctes ! · All ' + nok + ' answers are correct!';
            card.appendChild(bg);
          }
          if(opts.onScore) opts.onScore(score, total);
          if(done >= total && opts.onDone) opts.onDone(score, total);
        } else {
          if(firstTry) card._w = 1;
          b.classList.add('ng'); b.disabled = true;
        }
      };
      zone.appendChild(b);
    });
    host.appendChild(card);
  });
}
window.LeoPick = LeoPick;
