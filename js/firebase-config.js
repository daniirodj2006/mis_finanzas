/**
 * firebase-config.js
 * ─────────────────────────────────────────────────────────────
 * Configuración de Firebase + capa de sincronización
 *
 * ⚠️ REEMPLAZÁ los valores de firebaseConfig con los de tu
 *    proyecto en https://console.firebase.google.com
 * ─────────────────────────────────────────────────────────────
 */

import { initializeApp }                       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider,
         signInWithPopup, signOut,
         onAuthStateChanged }                  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, collection, addDoc,
         deleteDoc, doc, onSnapshot,
         query, where, orderBy,
         setDoc, getDoc, serverTimestamp,
         initializeFirestore, persistentLocalCache,
         persistentMultipleTabManager }        from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ═══════════════════════════════════════════════════════════════
   🔧  PEGÁ AQUÍ TU CONFIGURACIÓN DE FIREBASE
   Vas a Console → Configuración del proyecto → Tu app web
═══════════════════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey:            "AIzaSyBEGrbUvoOWEChV5hkGr1B4pHHjlvnbA8c",
  authDomain:        "mis-finanzas-9bbc5.firebaseapp.com",
  projectId:         "mis-finanzas-9bbc5",
  storageBucket:     "mis-finanzas-9bbc5.firebasestorage.app",
  messagingSenderId: "952118782118",
  appId:             "1:952118782118:web:a25aff0ab9db93b7c26c67"
};
/* ═══════════════════════════════════════════════════════════════ */

// ── Constantes de colección ─────────────────────────────────────
export const COL_MOV    = 'movimientos';
export const COL_CONFIG = 'configs';

// ── Init Firebase ────────────────────────────────────────────────
let app, auth, db;
let firebaseReady = false;

try {
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // Nueva API de persistencia offline (reemplaza enableIndexedDbPersistence)
  db   = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });

  firebaseReady = true;
} catch (e) {
  console.warn('[Firebase] No configurado. Usando modo demo con localStorage.');
}

export { auth, db, firebaseReady };

// ── Auth ─────────────────────────────────────────────────────────
export function loginWithGoogle() {
  if (!firebaseReady) return Promise.reject(new Error('Firebase no configurado'));
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function logout() {
  if (!firebaseReady || !auth) return Promise.resolve();
  return signOut(auth);
}

export function onAuthChange(callback) {
  if (!firebaseReady) return () => {};
  return onAuthStateChanged(auth, callback);
}

// ── Firestore helpers ────────────────────────────────────────────

/**
 * Escucha cambios en tiempo real de los movimientos de un usuario.
 * Cada vez que se agrega/edita/borra en cualquier dispositivo,
 * se llama el callback con la lista actualizada.
 * Retorna la función unsubscribe.
 */
export function subscribeMovimientos(uid, callback) {
  if (!firebaseReady || !db) return () => {};
  const q = query(
    collection(db, COL_MOV),
    where('uid', '==', uid),
    orderBy('fecha', 'desc')
  );
  return onSnapshot(q, snap => {
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Guarda también en localStorage como caché offline
    localStorage.setItem(`mf_movimientos_${uid}`, JSON.stringify(docs));
    callback(docs);
  }, err => {
    console.warn('[Firestore] Error al escuchar:', err.message);
    // Si falla la red, carga del caché local
    const cached = localStorage.getItem(`mf_movimientos_${uid}`);
    if (cached) callback(JSON.parse(cached));
  });
}

export async function addMovimiento(data) {
  if (!firebaseReady || !db) return null;
  return addDoc(collection(db, COL_MOV), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function deleteMovimiento(id) {
  if (!firebaseReady || !db) return;
  return deleteDoc(doc(db, COL_MOV, id));
}

// ── Config (tipo de cambio, meta de ahorro, etc.) ────────────────
export async function saveConfig(uid, data) {
  if (!firebaseReady || !db) {
    localStorage.setItem(`mf_config_${uid}`, JSON.stringify(data));
    return;
  }
  await setDoc(doc(db, COL_CONFIG, uid), data, { merge: true });
  // Caché local también
  localStorage.setItem(`mf_config_${uid}`, JSON.stringify(data));
}

export async function loadConfig(uid) {
  // Primero intenta Firestore
  if (firebaseReady && db) {
    try {
      const snap = await getDoc(doc(db, COL_CONFIG, uid));
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`mf_config_${uid}`, JSON.stringify(data));
        return data;
      }
    } catch (e) { /* fallthrough a localStorage */ }
  }
  // Fallback a caché local
  const cached = localStorage.getItem(`mf_config_${uid}`);
  return cached ? JSON.parse(cached) : {};
}

// ── Demo store (localStorage puro, sin Firebase) ─────────────────
const DEMO_KEY = 'mf_demo_movimientos';

export const demoStore = {
  getAll() {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  add(data) {
    const list = this.getAll();
    const item = { id: 'demo_' + Date.now(), ...data };
    list.unshift(item);
    localStorage.setItem(DEMO_KEY, JSON.stringify(list));
    return item;
  },
  delete(id) {
    const list = this.getAll().filter(m => m.id !== id);
    localStorage.setItem(DEMO_KEY, JSON.stringify(list));
  },
  getConfig() {
    const raw = localStorage.getItem('mf_demo_config');
    return raw ? JSON.parse(raw) : { tc: 530, metaAnual: 500000 };
  },
  saveConfig(data) {
    const current = this.getConfig();
    localStorage.setItem('mf_demo_config', JSON.stringify({ ...current, ...data }));
  }
};