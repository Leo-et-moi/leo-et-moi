// auth-guard.js — Phase 2: require login, inject sign-out, expose Firebase + progress helpers.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9ZF5NapFmCImXttk8S22OjWoGCx2Ztqk",
  authDomain: "leo-et-moi.firebaseapp.com",
  projectId: "leo-et-moi",
  storageBucket: "leo-et-moi.firebasestorage.app",
  messagingSenderId: "293051167258",
  appId: "1:293051167258:web:08d192bd132de2b89ad7a3"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const ROOT  = new URL('../', import.meta.url).href;
const LOGIN = ROOT + 'login.html';

// ── EmailJS: notify the teacher when a student completes an exercise ──
const EMAILJS = {
  publicKey:  "bRyOHboCG1OXVozPP",
  serviceId:  "service_ot0oisr",
  templateId: "template_rnevb2c",
  templateWriting: "template_d8u57nr"
};
const LESSON_NAMES = {
  'etre':  'A1 · Le verbe Être',
  'avoir': 'A1 · Le verbe Avoir',
  'c1_francine_gosselin': 'C1 · Francine G. (compréhension orale)',
  'c1_francis_tanguay': 'C1 · Francis T. (compréhension orale)',
  'A1-E-007': 'A1 · PRO-NON-CIA-TION — La Ratatouille Folle',
  'B1-E-003': 'B1 · Lecture — Les Alcooliques Anonymes (Kessel)',
  'a1_les_nombres':'A1 · Les nombres',
  'a2_nombres_quiz':'A2 · Quiz Les nombres',
  'a2_ecoute_invitations':'A2 · Écoute — Invitations',
  'a2_lire_invitation':'A2 · Lire une invitation',
  'b1_lire_faire_part':'B1 · Lire un faire-part',
  'b1_interrogatifs':'B1 · Les interrogatifs',
  'b2_interrogatifs':'B2 · Les interrogatifs'
};
let _emailjsReady = null;
function loadEmailJS() {
  if (_emailjsReady) return _emailjsReady;
  _emailjsReady = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => { try { window.emailjs.init({ publicKey: EMAILJS.publicKey }); } catch (e) {} resolve(window.emailjs); };
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return _emailjsReady;
}

let _readyUser = null;
const _readyCbs = [];

const LEM = {
  app, auth, db, ROOT, user: null,
  onReady(cb){ if (_readyUser) cb(_readyUser); else _readyCbs.push(cb); },
  _userRef(){ return doc(db, 'users', auth.currentUser.uid); },
  _lessonRef(id){ return doc(db, 'progress', auth.currentUser.uid, 'lessons', id); },
  async getUser(){ const s = await getDoc(this._userRef()); return s.exists() ? s.data() : {}; },
  async saveUser(partial){ await setDoc(this._userRef(), partial, { merge: true }); },
  async getLesson(id){ const s = await getDoc(this._lessonRef(id)); return s.exists() ? s.data() : null; },
  async setLesson(id, partial){
    let prev = {};
    try { const s = await getDoc(this._lessonRef(id)); prev = s.exists() ? s.data() : {}; } catch (e) {}
    await setDoc(this._lessonRef(id), partial, { merge: true });
    if (partial && partial.completed === true && !prev.completed) {
      this._notifyComplete(id, Object.assign({}, prev, partial));
    }
  },
  async _notifyComplete(id, data){
    try {
      const u = await this.getUser();
      if (!u || u.role === 'teacher') return;
      const ejs = await loadEmailJS();
      if (!ejs) return;
      const name = u.displayName || (this.user && this.user.email) || 'Un élève';
      const exercise = (window.LEM_TITLES && window.LEM_TITLES[id]) || LESSON_NAMES[id] || id;
      const score = (typeof data.score === 'number' && typeof data.total === 'number') ? (data.score + '/' + data.total) : '—';
      const date = new Date().toLocaleString('fr-FR');
      await ejs.send(EMAILJS.serviceId, EMAILJS.templateId, { student: name, exercise: exercise, score: score, date: date });
    } catch (e) { /* notification must never block the student */ }
  },
  async submitWriting(lessonId, lessonName, writings){
    try { await setDoc(this._lessonRef(lessonId), { writings: writings, writingsAt: Date.now() }, { merge: true }); } catch (e) { return false; }
    try {
      if (EMAILJS.templateWriting) {
        const u = await this.getUser();
        const ejs = await loadEmailJS();
        if (ejs) {
          const name = u.displayName || (this.user && this.user.email) || 'Un \u00e9l\u00e8ve';
          const body = Object.keys(writings).map(function(k){ return '\u2014 ' + k + ' \u2014\n' + writings[k]; }).join('\n\n');
          await ejs.send(EMAILJS.serviceId, EMAILJS.templateWriting, { student: name, lesson: lessonName, text: body, date: new Date().toLocaleString('fr-FR') });
        }
      }
    } catch (e) {}
    return true;
  },
  async getVocab(){ const s = await getDoc(this._userRef()); return (s.exists() && s.data().vocab) || []; },
  async addVocab(word){
    const ref = this._userRef();
    const s = await getDoc(ref);
    const v = (s.exists() && s.data().vocab) || [];
    if (v.some(x => x.fr === word.fr)) return false;
    v.push(word);
    await setDoc(ref, { vocab: v }, { merge: true });
    return true;
  },
  /* Config partagée (collection lessons/_*) : prof écrit, élèves lisent. */
  async getConfig(id){ try{ const s = await getDoc(doc(db,'lessons',id)); return s.exists()? s.data(): null; }catch(e){ return null; } },
  async setConfig(id, data){ await setDoc(doc(db,'lessons',id), data); },
  async removeVocab(fr){
    const ref = this._userRef();
    const s = await getDoc(ref);
    let v = (s.exists() && s.data().vocab) || [];
    v = v.filter(x => x.fr !== fr);
    await setDoc(ref, { vocab: v }, { merge: true });
    return v;
  }
};
window.LEM = LEM;

/* ── Mode DÉMO (public, 28/07/2026) : sans connexion, seules les pages dont
   l'ID figure dans lessons/_demo (choisi par le prof au tableau de bord)
   s'ouvrent, en lecture seule. Tout le reste redirige vers la connexion. ── */
function modeDemo(){
  LEM.demo = true;
  LEM.user = { demo: true, displayName: 'Démo' };
  LEM.getUser = async () => ({ role: 'demo', level: 'demo' });
  LEM.getLesson = async () => null;
  LEM.setLesson = async () => {};
  LEM.saveUser = async () => {};
  LEM.submitWriting = async () => false;
  LEM.getVocab = async () => [];
  LEM.addVocab = async () => false;
  const b = document.createElement('div');
  b.style.cssText = 'position:sticky;top:0;z-index:300;background:#1B2845;color:#fff;'+
    'padding:8px 12px;font-family:Arial,sans-serif;font-size:14px;text-align:center;';
  b.innerHTML = '🎓 <b>Démo leo-et-moi</b> — <a href="'+ROOT+'bienvenue.html" style="color:#9DC8E8;">découvrir le site</a> · <a href="'+ROOT+'login.html" style="color:#9DC8E8;">se connecter</a>';
  document.body.prepend(b);
  _readyUser = LEM.user;
  _readyCbs.forEach(cb => { try { cb(LEM.user); } catch (e) {} });
  document.dispatchEvent(new CustomEvent('lem-auth-ready', { detail: { user: LEM.user, demo: true } }));
}

/* ── Maintenance (28/07/2026) : un item listé dans lessons/_masquage est fermé
   aux élèves (page voilée « en correction ») ; le prof y accède normalement. ── */
async function verrouMaintenance(){
  const id = document.body && document.body.dataset ? document.body.dataset.itemId : null;
  if (!id) return;
  try {
    const cfg = await LEM.getConfig('_masquage');
    if (!cfg || !(cfg.ids || []).includes(id)) return;
    const me = await LEM.getUser();
    if (me && me.role === 'teacher') return;
    const v = document.createElement('div');
    v.style.cssText = 'position:fixed;inset:0;z-index:400;background:#F5F0E8;display:flex;'+
      'flex-direction:column;align-items:center;justify-content:center;gap:14px;'+
      'font-family:Arial,sans-serif;text-align:center;padding:24px;';
    v.innerHTML = '<div style="font-size:48px;">🔧</div>'+
      '<div style="font-size:22px;font-weight:bold;color:#1B2845;">En correction — reviens bientôt&nbsp;!</div>'+
      '<div style="color:#4A6580;">Under maintenance — check back soon!</div>'+
      '<a href="'+ROOT+'index.html" style="background:#E8503A;color:#fff;text-decoration:none;'+
      'padding:12px 22px;border-radius:12px;font-weight:bold;">← Accueil</a>';
    document.body.appendChild(v);
    try { window.stopAudio && window.stopAudio(); } catch (e) {}
  } catch (e) {}
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    const itemId = document.body && document.body.dataset ? document.body.dataset.itemId : null;
    if (itemId) {
      getDoc(doc(db, 'lessons', '_demo')).then((s) => {
        const ids = (s.exists() && s.data().ids) || [];
        if (ids.includes(itemId)) modeDemo();
        else location.replace(LOGIN);
      }).catch(() => location.replace(LOGIN));
      return;
    }
    location.replace(LOGIN);
    return;
  }
  LEM.user = user;
  _readyUser = user;
  injectSignOut(user);
  verrouMaintenance();
  _readyCbs.forEach(cb => { try { cb(user); } catch (e) {} });
  document.dispatchEvent(new CustomEvent('lem-auth-ready', { detail: { user } }));
});

function injectSignOut(user) {
  if (document.getElementById('lemSignOut')) return;
  const who = user.displayName || user.email || '';
  const btn = document.createElement('button');
  btn.id = 'lemSignOut';
  btn.title = 'Se déconnecter (' + who + ')';
  btn.textContent = '🚪';
  btn.addEventListener('click', async () => { await signOut(auth); location.replace(LOGIN); });
  const host = document.querySelector('.top-bar .top-icons');
  if (host) { btn.className = 'icon-btn'; host.appendChild(btn); }
  else {
    btn.style.cssText = 'position:fixed;top:8px;right:8px;z-index:9999;background:#1B2845;'
      + 'color:#fff;border:none;border-radius:50%;width:44px;height:44px;font-size:20px;'
      + 'cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.25);';
    document.body.appendChild(btn);
  }
}
