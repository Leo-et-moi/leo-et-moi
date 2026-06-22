// auth-guard.js — Phase 2: require login on every page, inject sign-out,
// and expose Firebase (window.LEM) + a 'lem-auth-ready' event for progress sync.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Site root = the folder above /js/ — works at any page depth and on GitHub Pages.
const ROOT  = new URL('../', import.meta.url).href;
const LOGIN = ROOT + 'login.html';

window.LEM = { app, auth, db, ROOT, user: null };

onAuthStateChanged(auth, (user) => {
  if (!user) {
    try { sessionStorage.setItem('lem_return', location.href); } catch (e) {}
    location.replace(LOGIN);
    return;
  }
  window.LEM.user = user;
  injectSignOut(user);
  document.dispatchEvent(new CustomEvent('lem-auth-ready', { detail: { user } }));
});

function injectSignOut(user) {
  if (document.getElementById('lemSignOut')) return;
  const who = user.displayName || user.email || '';
  const btn = document.createElement('button');
  btn.id = 'lemSignOut';
  btn.title = 'Se déconnecter (' + who + ')';
  btn.textContent = '🚪';
  btn.addEventListener('click', async () => {
    await signOut(auth);
    location.replace(LOGIN);
  });
  const host = document.querySelector('.top-bar .top-icons');
  if (host) {
    btn.className = 'icon-btn';
    host.appendChild(btn);
  } else {
    btn.style.cssText = 'position:fixed;top:8px;right:8px;z-index:9999;background:#1B2845;'
      + 'color:#fff;border:none;border-radius:50%;width:44px;height:44px;font-size:20px;'
      + 'cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.25);';
    document.body.appendChild(btn);
  }
}
