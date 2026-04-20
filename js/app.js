/**
 * app.js — Controlador principal
 * Maneja: auth, navegación, modal, sincronización de estado
 */

import {
  loginWithGoogle, logout as fbLogout, onAuthChange,
  subscribeMovimientos, addMovimiento, deleteMovimiento,
  saveConfig, loadConfig, demoStore, firebaseReady
} from './firebase-config.js';

import { renderDashboard }   from './dashboard.js';
import { renderIngresos }    from './ingresos.js';
import { renderGastos }      from './gastos.js';
import { renderAhorros }     from './ahorros.js';
import { renderCuentas }     from './cuentas.js';
import { renderRecurrentes } from './recurrentes.js';

// ── Estado global ────────────────────────────────────────────────
export const STATE = {
  uid:          null,
  demoMode:     false,
  movimientos:  [],
  tc:           530,
  metaAnual:    500000,
  currentPage:  'dashboard',
  currentAcc:   null,
  selCat:       'Comida',
  recActive:    false,
  recFreq:      'Mensual',
  modalType:    'gasto',
  unsubscribe:  null,   // Firestore real-time listener
};

export const CATS = ['Comida','Estética','Universidad','Viajes','Ropa','Gastos médicos','Suscripciones','Otros'];
export const CAT_COLORS = ['#F48FB1','#E91E63','#C2185B','#CE93D8','#F06292','#880E4F','#FCE4EC','#EDD5E8'];
export const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── Helpers de formato ───────────────────────────────────────────
export const fmtCRC = n => '₡' + Math.round(n).toLocaleString('es-CR');
export const fmtUSD = n => '$' + Number(n).toFixed(2);
export const fmt    = (n, mon) => mon === 'USD' ? fmtUSD(n) : fmtCRC(n);
export const toColones = (monto, moneda) => moneda === 'USD' ? monto * STATE.tc : monto;

export function getSelMonth() { return parseInt(document.getElementById('month-sel').value); }
export function getSelYear()  { return parseInt(document.getElementById('year-sel').value); }
export function filterMonth(list) {
  const m = getSelMonth(), y = getSelYear();
  return list.filter(d => {
    const fd = new Date(d.fecha + 'T12:00:00');
    return fd.getMonth() === m && fd.getFullYear() === y;
  });
}

// ── Toast ────────────────────────────────────────────────────────
export function toast(msg, ms = 2400) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), ms);
}

// ── Sync status ──────────────────────────────────────────────────
export function setSyncStatus(status) {
  // status: 'synced' | 'syncing' | 'offline'
  const dot  = document.getElementById('sync-dot');
  const text = document.getElementById('sync-text');
  if (!dot || !text) return;
  dot.className = 'sync-dot ' + status;
  text.textContent = { synced: 'Sincronizado', syncing: 'Sincronizando…', offline: 'Sin conexión' }[status] || '';
}

// ── Render ───────────────────────────────────────────────────────
export function renderAll() {
  renderDashboard();
  updateBadges();
  const page = STATE.currentPage;
  if (page === 'ingresos')    renderIngresos();
  if (page === 'gastos')      renderGastos();
  if (page === 'ahorros')     renderAhorros();
  if (page === 'cuentas')     renderCuentas();
  if (page === 'recurrentes') renderRecurrentes();
}

function updateBadges() {
  const month = filterMonth(STATE.movimientos);
  document.getElementById('badge-ing').textContent = month.filter(m => m.tipo_mov === 'ingreso').length;
  document.getElementById('badge-gas').textContent = month.filter(m => m.tipo_mov === 'gasto').length;
}

// ── Data: subscribe (real-time) ──────────────────────────────────
function startListening() {
  if (STATE.unsubscribe) STATE.unsubscribe(); // limpia listener anterior

  if (STATE.demoMode) {
    STATE.movimientos = demoStore.getAll();
    renderAll();
    return;
  }

  setSyncStatus('syncing');
  STATE.unsubscribe = subscribeMovimientos(STATE.uid, docs => {
    STATE.movimientos = docs;
    setSyncStatus('synced');
    renderAll();
  });
}

// ── Data: add ────────────────────────────────────────────────────
export async function addItem(data) {
  setSyncStatus('syncing');
  if (STATE.demoMode) {
    demoStore.add({ ...data, uid: 'demo' });
    STATE.movimientos = demoStore.getAll();
    setSyncStatus('synced');
    renderAll();
  } else {
    await addMovimiento({ ...data, uid: STATE.uid });
    // onSnapshot actualizará STATE.movimientos automáticamente
  }
}

// ── Data: delete ─────────────────────────────────────────────────
export async function deleteItem(id) {
  if (!confirm('¿Eliminar este movimiento?')) return;
  setSyncStatus('syncing');
  if (STATE.demoMode) {
    demoStore.delete(id);
    STATE.movimientos = demoStore.getAll();
    setSyncStatus('synced');
    renderAll();
  } else {
    await deleteMovimiento(id);
    // onSnapshot actualizará STATE.movimientos automáticamente
  }
  toast('Movimiento eliminado');
}

// ── Config: TC ───────────────────────────────────────────────────
export async function editTC() {
  const val = prompt('Nuevo tipo de cambio USD → CRC:', STATE.tc);
  if (!val || isNaN(val) || parseFloat(val) <= 0) return;
  STATE.tc = parseFloat(val);
  document.getElementById('tc-display').textContent = '₡' + STATE.tc.toLocaleString('es-CR');
  const uid = STATE.demoMode ? 'demo' : STATE.uid;
  if (STATE.demoMode) demoStore.saveConfig({ tc: STATE.tc });
  else await saveConfig(uid, { tc: STATE.tc });
  renderAll();
  toast('Tipo de cambio actualizado');
}

// ── Config: Meta ahorro ──────────────────────────────────────────
export async function saveMeta(valor) {
  STATE.metaAnual = parseFloat(valor) || 500000;
  const uid = STATE.demoMode ? 'demo' : STATE.uid;
  if (STATE.demoMode) demoStore.saveConfig({ metaAnual: STATE.metaAnual });
  else await saveConfig(uid, { metaAnual: STATE.metaAnual });
}

// ── Navigate ─────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: 'Dashboard', ingresos: 'Ingresos', gastos: 'Gastos',
  ahorros: 'Ahorros', cuentas: 'Cuentas', recurrentes: 'Recurrentes'
};

export function navigate(page) {
  STATE.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || page;
  if (window.innerWidth < 768) closeSidebar();

  if (page === 'ingresos')    renderIngresos();
  else if (page === 'gastos') renderGastos();
  else if (page === 'ahorros') renderAhorros();
  else if (page === 'cuentas') renderCuentas();
  else if (page === 'recurrentes') renderRecurrentes();
}

// ── Sidebar ──────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// ── Modal ────────────────────────────────────────────────────────
function openModal(tipo = 'gasto') {
  STATE.modalType  = tipo;
  STATE.recActive  = false;
  STATE.selCat     = CATS[0];

  setModalType(tipo);
  renderCatChips();
  document.getElementById('f-fecha').value = new Date().toISOString().slice(0, 10);
  document.getElementById('f-monto').value = '';
  document.getElementById('f-desc').value  = '';
  document.getElementById('rec-toggle').classList.remove('on');
  document.getElementById('rec-card').classList.remove('active');
  document.getElementById('rec-body').classList.remove('show');
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function setModalType(t) {
  STATE.modalType = t;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === t));
  document.getElementById('f-subtipo-wrap').style.display = t === 'ingreso' ? 'block' : 'none';
  document.getElementById('f-cat-wrap').style.display     = t === 'gasto'   ? 'block' : 'none';
  document.getElementById('f-method-wrap').style.display  = t === 'gasto'   ? 'block' : 'none';
  document.getElementById('rec-card').style.display       = t !== 'ahorro'  ? 'block' : 'none';
  document.getElementById('modal-title').textContent = t === 'ingreso' ? 'Nuevo ingreso' : t === 'gasto' ? 'Nuevo gasto' : 'Registrar ahorro';
}

function renderCatChips() {
  document.getElementById('cat-chips').innerHTML = CATS.map(c =>
    `<button class="chip-btn${c === STATE.selCat ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
}

function updateRecPreview() {
  if (!STATE.recActive) return;
  const day   = document.getElementById('rec-day').value;
  const monto = document.getElementById('f-monto').value;
  const mon   = document.getElementById('f-moneda').value;
  let next    = 'próximo ' + STATE.recFreq.toLowerCase();
  if (STATE.recFreq === 'Mensual' && day) {
    const now = new Date();
    const d   = new Date(now.getFullYear(), now.getMonth() + 1, parseInt(day));
    next = d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const montoStr = monto ? fmt(parseFloat(monto), mon) : '';
  document.getElementById('rec-preview').innerHTML =
    `Próximo cobro: <strong>${next}${montoStr ? ' · ' + montoStr : ''}</strong>`;
}

async function saveMovimiento() {
  const monto  = parseFloat(document.getElementById('f-monto').value);
  const desc   = document.getElementById('f-desc').value.trim();
  const fecha  = document.getElementById('f-fecha').value;
  const moneda = document.getElementById('f-moneda').value;
  const t      = STATE.modalType;

  if (!monto || monto <= 0) { toast('Ingresá un monto válido'); return; }
  if (!desc)                 { toast('Agregá una descripción');  return; }
  if (!fecha)                { toast('Seleccioná una fecha');    return; }

  const data = { tipo_mov: t, monto, moneda, descripcion: desc, fecha, recurrente: STATE.recActive };

  if (t === 'ingreso') {
    data.sub_tipo = document.getElementById('f-subtipo').value;
    data.cuenta   = 'CRC';
  }
  if (t === 'gasto') {
    data.categoria = STATE.selCat;
    data.metodo    = document.getElementById('f-method').value;
    data.cuenta    = ['AMEX','Gold'].includes(data.metodo) ? data.metodo.toUpperCase() : 'CRC';
  }
  if (t === 'ahorro') { data.cuenta = 'CRC'; }

  if (STATE.recActive) {
    data.rec_freq = STATE.recFreq;
    data.rec_day  = document.getElementById('rec-day').value;
    data.rec_end  = document.getElementById('rec-end').value;
    data.rec_acc  = document.getElementById('rec-acc').value;
  }

  const btn = document.getElementById('btn-save-mov');
  btn.disabled = true; btn.textContent = 'Guardando…';

  await addItem(data);
  closeModal();
  toast('Guardado correctamente ✓');
  btn.disabled = false; btn.textContent = 'Guardar';
}

// ── Login/Logout ─────────────────────────────────────────────────
async function showApp(user, isDemo = false) {
  STATE.uid      = isDemo ? 'demo' : user.uid;
  STATE.demoMode = isDemo;

  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display          = 'flex';
  document.getElementById('fab').style.display          = 'flex';

  document.getElementById('sb-name').textContent  = isDemo ? 'Dani (demo)' : (user.displayName || 'Usuario');
  document.getElementById('sb-email').textContent = isDemo ? 'Modo demo — datos locales' : (user.email || '');

  // Inicializa selector de mes/año al actual
  const now = new Date();
  document.getElementById('month-sel').value = now.getMonth();
  document.getElementById('year-sel').value  = now.getFullYear();

  // Carga config (TC, meta)
  const cfg = isDemo ? demoStore.getConfig() : await loadConfig(STATE.uid);
  STATE.tc        = cfg.tc        || 530;
  STATE.metaAnual = cfg.metaAnual || 500000;
  document.getElementById('tc-display').textContent = '₡' + STATE.tc.toLocaleString('es-CR');

  setSyncStatus(isDemo ? 'offline' : 'syncing');
  startListening();
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display          = 'none';
  document.getElementById('fab').style.display          = 'none';
}

// ── Init ─────────────────────────────────────────────────────────
export function initApp() {
  // Auth state listener (Firebase)
  if (firebaseReady) {
    onAuthChange(user => {
      if (user && !STATE.demoMode) showApp(user);
      else if (!user && !STATE.demoMode) showLogin();
    });
  } else {
    showLogin();
  }

  // ── Botones login ──
  document.getElementById('btn-google').addEventListener('click', async () => {
    try { await loginWithGoogle(); }
    catch { toast('Error al iniciar sesión. Usá el modo demo.'); }
  });
  document.getElementById('btn-demo').addEventListener('click', () => showApp(null, true));

  // ── Logout ──
  document.getElementById('btn-logout').addEventListener('click', async () => {
    if (STATE.unsubscribe) STATE.unsubscribe();
    STATE.demoMode = false; STATE.uid = null;
    await fbLogout();
    showLogin();
  });

  // ── Menu / sidebar ──
  document.getElementById('menu-btn').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  // ── Nav items ──
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });

  // ── Month/Year selectors ──
  document.getElementById('month-sel').addEventListener('change', renderAll);
  document.getElementById('year-sel').addEventListener('change',  renderAll);

  // ── FAB ──
  document.getElementById('fab').addEventListener('click', () => openModal('gasto'));

  // ── TC edit ──
  document.getElementById('tc-edit-btn').addEventListener('click', editTC);

  // ── Modal overlay close ──
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // ── Type toggle ──
  document.querySelectorAll('.type-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => setModalType(btn.dataset.type));
  });

  // ── Cat chips (delegado) ──
  document.getElementById('cat-chips').addEventListener('click', e => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    STATE.selCat = btn.dataset.cat;
    renderCatChips();
  });

  // ── Recurrence toggle ──
  document.getElementById('rec-toggle').addEventListener('click', () => {
    STATE.recActive = !STATE.recActive;
    document.getElementById('rec-toggle').classList.toggle('on', STATE.recActive);
    document.getElementById('rec-card').classList.toggle('active', STATE.recActive);
    document.getElementById('rec-body').classList.toggle('show',   STATE.recActive);
    updateRecPreview();
  });

  // ── Freq buttons ──
  document.querySelectorAll('.freq-btn[data-freq]').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.recFreq = btn.dataset.freq;
      document.querySelectorAll('.freq-btn').forEach(b => b.classList.toggle('active', b.dataset.freq === STATE.recFreq));
      updateRecPreview();
    });
  });

  document.getElementById('rec-day').addEventListener('input', updateRecPreview);
  document.getElementById('f-monto').addEventListener('input', updateRecPreview);

  // ── Save button ──
  document.getElementById('btn-save-mov').addEventListener('click', saveMovimiento);

  // ── Offline/Online detection ──
  window.addEventListener('offline', () => setSyncStatus('offline'));
  window.addEventListener('online',  () => setSyncStatus(STATE.demoMode ? 'offline' : 'synced'));
}

// Exponer openModal globalmente (usado desde páginas)
window.openModal  = openModal;
window.deleteItem = deleteItem;
