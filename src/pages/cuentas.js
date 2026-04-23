import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const iconVer = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

let editandoId = null;
let monedaSeleccionada = 'CRC';
let cuentaDetalle = null;

function abrirSheet() {
  document.querySelector('#sheet-overlay').classList.remove('hidden');
  document.querySelector('#sheet-cuenta').classList.remove('hidden');
}

function cerrarSheet() {
  document.querySelector('#sheet-overlay').classList.add('hidden');
  document.querySelector('#sheet-cuenta').classList.add('hidden');
  editandoId = null;
  monedaSeleccionada = 'CRC';
  document.querySelector('#cuenta-nombre').value = '';
  document.querySelector('#cuenta-balance').value = '';
  document.querySelector('#sheet-titulo').textContent = 'Nueva cuenta';
  document.querySelector('#btn-guardar-cuenta').textContent = 'Agregar cuenta';
  document.querySelectorAll('.moneda-btn').forEach(b =>
    b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
  document.querySelector('[data-moneda="CRC"]').classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
}

function abrirDetalle(cuenta, pagos, tarjetas) {
  cuentaDetalle = cuenta;
  const simbolo = cuenta.moneda === 'USD' ? '$' : '₡';
  const pagosCuenta = pagos.filter(p => p.cuentaId === cuenta.id);

  document.querySelector('#detalle-titulo').textContent = cuenta.nombre;
  document.querySelector('#detalle-balance').textContent = `${simbolo}${cuenta.balance.toLocaleString()}`;

  const lista = document.querySelector('#detalle-lista');
  if (pagosCuenta.length === 0) {
    lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay pagos registrados</p>`;
  } else {
    lista.innerHTML = pagosCuenta.map(p => {
      const tarjeta = tarjetas.find(t => t.id === p.tarjetaId);
      const fecha = p.fecha?.toDate?.() || new Date();
      return `
        <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
          <div>
            <p class="text-gray-700 text-sm">Pago a ${tarjeta?.nombre || 'tarjeta'}</p>
            <p class="text-gray-400 text-xs">${fecha.toLocaleDateString('es-CR')}</p>
          </div>
          <p class="text-red-400 font-semibold text-sm">${simbolo}${p.monto.toLocaleString()}</p>
        </div>
      `;
    }).join('');
  }

  document.querySelector('#modal-detalle').classList.remove('hidden');
}

export function renderCuentas() {
  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Cuentas</h1>
        <button id="btn-nueva-cuenta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div id="lista-cuentas"></div>

    </div>

    <!-- Overlay -->
    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <!-- Bottom sheet nueva cuenta -->
    <div id="sheet-cuenta" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva cuenta</p>
          <button id="btn-cerrar-sheet" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <input id="cuenta-nombre" type="text" placeholder="Nombre (ej: BAC Colones)"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">$ Dólares</button>
        </div>

        <input id="cuenta-balance" type="number" placeholder="Balance inicial"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm outline-none focus:border-indigo-400"/>

        <button id="btn-guardar-cuenta" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Agregar cuenta
        </button>
      </div>
    </div>

    <!-- Modal detalle cuenta -->
    <div id="modal-detalle" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <p id="detalle-titulo" class="text-gray-800 font-semibold"></p>
          <button id="btn-cerrar-detalle" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-400 text-xs mb-1">Balance actual</p>
        <p id="detalle-balance" class="text-2xl font-semibold text-gray-800 mb-4"></p>
        <p class="text-gray-700 font-medium mb-3">Pagos a tarjetas</p>
        <div id="detalle-lista"></div>
      </div>
    </div>
  `;

  document.querySelector('#btn-nueva-cuenta').addEventListener('click', abrirSheet);
  document.querySelector('#btn-cerrar-sheet').addEventListener('click', cerrarSheet);
  document.querySelector('#sheet-overlay').addEventListener('click', cerrarSheet);
  document.querySelector('#btn-cerrar-detalle').addEventListener('click', () => {
    document.querySelector('#modal-detalle').classList.add('hidden');
  });

  document.querySelectorAll('.moneda-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.moneda-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      monedaSeleccionada = btn.dataset.moneda;
    });
  });

  document.querySelector('#btn-guardar-cuenta').addEventListener('click', async () => {
    const nombre = document.querySelector('#cuenta-nombre').value.trim();
    const balance = parseFloat(document.querySelector('#cuenta-balance').value) || 0;
    if (!nombre) return;

    if (editandoId) {
      await updateDoc(doc(db, 'cuentas', editandoId), { nombre, moneda: monedaSeleccionada });
    } else {
      await addDoc(collection(db, 'cuentas'), {
        uid: auth.currentUser.uid,
        nombre,
        moneda: monedaSeleccionada,
        balance,
        fecha: new Date()
      });
    }
    cerrarSheet();
  });

  // Cargar pagos y tarjetas para el detalle
  let pagosData = [];
  let tarjetasData = [];

  getDocs(query(collection(db, 'tarjetas'), where('uid', '==', auth.currentUser.uid)))
    .then(snap => { tarjetasData = snap.docs.map(d => ({ id: d.id, ...d.data() })); });

  onSnapshot(query(collection(db, 'pagosTarjeta'), where('uid', '==', auth.currentUser.uid), orderBy('fecha', 'desc')), snap => {
    pagosData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });

  const q = query(
    collection(db, 'cuentas'),
    where('uid', '==', auth.currentUser.uid),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-cuentas');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay cuentas aún</p>`;
      return;
    }

    lista.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const simbolo = data.moneda === 'USD' ? '$' : '₡';
      const colorMoneda = data.moneda === 'USD' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';

      return `
        <div class="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-gray-800 font-medium text-sm">${data.nombre}</p>
              <span class="text-xs px-2 py-1 rounded-full mt-1 inline-block ${colorMoneda}">${data.moneda}</span>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-gray-800 font-semibold">${simbolo}${(data.balance || 0).toLocaleString()}</p>
              <button data-id="${d.id}" class="btn-ver text-gray-400 hover:text-indigo-500 transition">${iconVer}</button>
              <button data-id="${d.id}" data-nombre="${data.nombre}" data-moneda="${data.moneda}"
                class="btn-editar text-gray-400 hover:text-indigo-500 transition">${iconEditar}</button>
              <button data-id="${d.id}"
                class="btn-borrar text-gray-400 hover:text-red-500 transition">${iconBorrar}</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Ver detalle
    document.querySelectorAll('.btn-ver').forEach(btn => {
      btn.addEventListener('click', () => {
        const cuenta = snapshot.docs.find(d => d.id === btn.dataset.id);
        if (cuenta) abrirDetalle({ id: cuenta.id, ...cuenta.data() }, pagosData, tarjetasData);
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        monedaSeleccionada = btn.dataset.moneda;
        document.querySelector('#cuenta-nombre').value = btn.dataset.nombre;
        document.querySelector('#sheet-titulo').textContent = 'Editar cuenta';
        document.querySelector('#btn-guardar-cuenta').textContent = 'Guardar cambios';
        document.querySelectorAll('.moneda-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.moneda === monedaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        abrirSheet();
      });
    });

    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Borrar esta cuenta?')) {
          await deleteDoc(doc(db, 'cuentas', btn.dataset.id));
        }
      });
    });
  });
}