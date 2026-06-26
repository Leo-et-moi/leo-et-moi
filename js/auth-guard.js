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
  templateId: "template_rnevb2c"
};
const LESSON_NAMES = {
  'etre':  'A1 · Le verbe Être',
  'avoir': 'A1 · Le verbe Avoir',
  'c1_francine_gosselin': 'C1 · Francine G. (compréhension orale)'
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
      const exercise = LESSON_NAMES[id] || id;
      const score = (typeof data.score === 'number' && typeof data.total === 'number') ? (data.score + '/' + data.total) : '—';
      const date = new Date().toLocaleString('fr-FR');
      await ejs.send(EMAILJS.serviceId, EMAILJS.templateId, { student: name, exercise: exercise, score: score, date: date });
    } catch (e) { /* notification must never block the student */ }
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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.replace(LOGIN);
    return;
  }
  LEM.user = user;
  _readyUser = user;
  injectSignOut(user);
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
