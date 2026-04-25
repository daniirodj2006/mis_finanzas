import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

const iconBanco = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`;
const iconCRC = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.15"><circle cx="12" cy="12" r="10"/><path d="M15 9a4 4 0 1 0 0 6"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`;
const iconUSD = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.15"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

const extras = ['#1a1a2e','#533483','#c0392b','#e67e22','#27ae60','#2980b9','#7f8c8d'];

function getColoresCuenta() {
  const temaId = localStorage.getItem('tema') || 'blanco';
  const temaPrimary = {
    blanco:   '#63c5c0',
    neutro:   '#6366f1',
    rosa:     '#d36998',
    celeste:  '#0284c7',
    amarillo: '#f3ce68',
    verde:    '#348f72',
  };
  const primary = temaPrimary[temaId] || '#63c5c0';
  return [primary, ...extras.filter(c => c !== primary)];
}

let editandoId = null;
let monedaSeleccionada = 'CRC';
let colorSeleccionado = getColoresCuenta()[0];
let tipoSeleccionado = 'Ahorros';

function abrirSheet() {
  document.querySelector('#sheet-overlay').classList.remove('hidden');
  document.querySelector('#sheet-cuenta').classList.remove('hidden');
}

function cerrarSheet() {
  document.querySelector('#sheet-overlay').classList.add('hidden');
  document.querySelector('#sheet-cuenta').classList.add('hidden');
  editandoId = null;
  monedaSeleccionada = 'CRC';
  colorSeleccionado = getColoresCuenta()[0];
  tipoSeleccionado = 'Ahorros';
  document.querySelector('#cuenta-nombre').value = '';
  document.querySelector('#cuenta-balance').value = '';
  document.querySelector('#sheet-titulo').textContent = 'Nueva cuenta';
  document.querySelector('#btn-guardar-cuenta').textContent = 'Agregar cuenta';
  document.querySelectorAll('.moneda-btn').forEach(b =>
    b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
  document.querySelector('[data-moneda="CRC"]')?.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
}

export function renderCuentas() {
  const colores = getColoresCuenta();

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Cuentas</h1>
          <p class="text-gray-400 text-xs mt-0.5">Tus cuentas bancarias</p>
        </div>
        <button id="btn-nueva-cuenta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <p id="total-consolidado" class="text-gray-500 text-xs mb-4"></p>
      <div id="lista-cuentas" class="mb-4"></div>

      <div id="desglose-cuentas" class="bg-white rounded-2xl p-4 shadow-sm hidden">
        <p class="text-gray-700 font-medium mb-3">Desglose</p>
        <div id="desglose-lista"></div>
      </div>

    </div>

    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <div id="sheet-cuenta" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva cuenta</p>
          <button id="btn-cerrar-sheet" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <input id="cuenta-nombre" type="text" placeholder="Nombre (ej: BAC Colones)"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-3 text-sm outline-none"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">$ Dólares</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Tipo</p>
        <div class="flex gap-2 mb-3">
          <button data-tipo="Ahorros" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">Ahorros</button>
          <button data-tipo="Corriente" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">Corriente</button>
          <button data-tipo="Digital" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">Digital</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Color</p>
        <div class="flex gap-2 mb-4 flex-wrap">
          ${colores.map((c, i) => `
            <button data-color="${c}" class="color-btn w-9 h-9 rounded-full transition-all ${i === 0 ? 'ring-2 ring-offset-2 ring-gray-500' : ''}" style="background-color: ${c}"></button>
          `).join('')}
        </div>

        <input id="cuenta-balance" type="number" placeholder="Balance inicial"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-4 text-sm outline-none"/>

        <button id="btn-guardar-cuenta" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Agregar cuenta
        </button>
      </div>
    </div>

    <div id="modal-detalle" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <p id="detalle-titulo" class="font-semibold" style="color:#1f2937"></p>
          <button id="btn-cerrar-detalle" style="color:#9ca3af">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-bottom:4px">Balance actual</p>
        <p id="detalle-balance" class="text-2xl font-semibold mb-4" style="color:#1f2937"></p>
        <p class="font-medium mb-3" style="color:#374151">Pagos a tarjetas</p>
        <div id="detalle-lista"></div>
      </div>
    </div>
  `;

  document.querySelector('#btn-nueva-cuenta').addEventListener('click', abrirSheet);
  document.querySelector('#btn-cerrar-sheet').addEventListener('click', cerrarSheet);
  document.querySelector('#sheet-overlay').addEventListener('click', cerrarSheet);
  document.querySelector('#btn-cerrar-detalle').addEventListener('click', () =>
    document.querySelector('#modal-detalle').classList.add('hidden'));

  document.querySelectorAll('.moneda-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.moneda-btn').forEach(b => {
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        b.style.borderColor = '#e5e7eb';
        b.style.color = '#6b7280';
      });
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      btn.style.borderColor = '';
      btn.style.color = '';
      monedaSeleccionada = btn.dataset.moneda;
    });
  });

  document.querySelectorAll('.tipo-cuenta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tipo-cuenta-btn').forEach(b => {
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        b.style.borderColor = '#e5e7eb';
        b.style.color = '#6b7280';
      });
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      btn.style.borderColor = '';
      btn.style.color = '';
      tipoSeleccionado = btn.dataset.tipo;
    });
  });

  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b =>
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500'));
      btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
      colorSeleccionado = btn.dataset.color;
    });
  });

  document.querySelector('#btn-guardar-cuenta').addEventListener('click', async () => {
    const nombre = document.querySelector('#cuenta-nombre').value.trim();
    const balance = parseFloat(document.querySelector('#cuenta-balance').value) || 0;
    if (!nombre) return;

    if (editandoId) {
      await updateDoc(doc(db, 'cuentas', editandoId), {
        nombre, moneda: monedaSeleccionada, color: colorSeleccionado, tipo: tipoSeleccionado
      });
    } else {
      await addDoc(collection(db, 'cuentas'), {
        uid: auth.currentUser.uid,
        nombre, moneda: monedaSeleccionada,
        balance, color: colorSeleccionado,
        tipo: tipoSeleccionado,
        fecha: new Date()
      });
    }
    cerrarSheet();
  });

  let pagosData = [];
  let tarjetasData = [];

  getDocs(query(collection(db, 'tarjetas'), where('uid', '==', auth.currentUser.uid)))
    .then(snap => { tarjetasData = snap.docs.map(d => ({ id: d.id, ...d.data() })); });

  onSnapshot(query(collection(db, 'pagosTarjeta'), where('uid', '==', auth.currentUser.uid), orderBy('fecha', 'desc')), snap => {
    pagosData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  });

  const q = query(collection(db, 'cuentas'), where('uid', '==', auth.currentUser.uid), orderBy('fecha', 'desc'));

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-cuentas');
    const desglose = document.querySelector('#desglose-cuentas');
    const desgloseLista = document.querySelector('#desglose-lista');
    const totalEl = document.querySelector('#total-consolidado');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay cuentas aún</p>`;
      desglose?.classList.add('hidden');
      return;
    }

    const cuentas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalCRC = cuentas.filter(c => c.moneda === 'CRC').reduce((s, c) => s + (c.balance || 0), 0);
    const totalUSD = cuentas.filter(c => c.moneda === 'USD').reduce((s, c) => s + (c.balance || 0), 0);

    let totalStr = '';
    if (totalCRC > 0) totalStr += `₡${totalCRC.toLocaleString()}`;
    if (totalCRC > 0 && totalUSD > 0) totalStr += ' · ';
    if (totalUSD > 0) totalStr += `$${totalUSD.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `Total consolidado: ${totalStr}`;

    lista.innerHTML = cuentas.map(data => {
      const simbolo = data.moneda === 'USD' ? '$' : '₡';
      const color = data.color || colores[0];
      const tipo = data.tipo || 'Cuenta';
      return `
        <div class="rounded-2xl p-5 mb-3 relative overflow-hidden cursor-pointer cuenta-card"
          data-id="${data.id}"
          style="background: linear-gradient(135deg, ${color}, ${color}bb)">
          
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: rgba(255,255,255,0.2)">
              ${iconBanco}
            </div>
            <div>
              <p class="text-white text-xs" style="opacity:0.75">${tipo}</p>
              <p class="text-white font-semibold text-sm">${data.nombre}</p>
            </div>
            <div class="ml-auto flex gap-2">
              <button data-id="${data.id}" data-nombre="${data.nombre}" data-moneda="${data.moneda}" data-color="${color}" data-tipo="${tipo}"
                class="btn-editar" style="color:white;opacity:0.8">${iconEditar}</button>
              <button data-id="${data.id}"
                class="btn-borrar" style="color:white;opacity:0.8">${iconBorrar}</button>
            </div>
          </div>
          <p class="text-white text-2xl font-bold">${simbolo}${(data.balance || 0).toLocaleString()}</p>
        </div>
      `;
    }).join('');

    desglose?.classList.remove('hidden');
    if (desgloseLista) {
      desgloseLista.innerHTML = cuentas.map(data => {
        const simbolo = data.moneda === 'USD' ? '$' : '₡';
        const color = data.color || colores[0];
        return `
          <div class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${color}">
                ${iconBanco.replace('width="28" height="28"', 'width="16" height="16"')}
              </div>
              <div>
                <p class="text-gray-700 text-sm font-medium">${data.nombre}</p>
                <p class="text-gray-400 text-xs">${data.tipo || 'Cuenta'}</p>
              </div>
            </div>
            <p class="text-gray-800 font-semibold text-sm">${simbolo}${(data.balance || 0).toLocaleString()}</p>
          </div>
        `;
      }).join('');
    }

    document.querySelectorAll('.cuenta-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-editar') || e.target.closest('.btn-borrar')) return;
        const cuenta = cuentas.find(c => c.id === card.dataset.id);
        if (!cuenta) return;
        const simbolo = cuenta.moneda === 'USD' ? '$' : '₡';
        const pagosCuenta = pagosData.filter(p => p.cuentaId === cuenta.id);
        document.querySelector('#detalle-titulo').textContent = cuenta.nombre;
        document.querySelector('#detalle-balance').textContent = `${simbolo}${(cuenta.balance || 0).toLocaleString()}`;
        const listaEl = document.querySelector('#detalle-lista');
        if (pagosCuenta.length === 0) {
          listaEl.innerHTML = `<p style="color:#9ca3af;font-size:14px;text-align:center;padding:16px">No hay pagos registrados</p>`;
        } else {
          listaEl.innerHTML = pagosCuenta.map(p => {
            const tarjeta = tarjetasData.find(t => t.id === p.tarjetaId);
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
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        monedaSeleccionada = btn.dataset.moneda;
        colorSeleccionado = btn.dataset.color;
        tipoSeleccionado = btn.dataset.tipo;
        document.querySelector('#cuenta-nombre').value = btn.dataset.nombre;
        document.querySelector('#sheet-titulo').textContent = 'Editar cuenta';
        document.querySelector('#btn-guardar-cuenta').textContent = 'Guardar cambios';
        document.querySelectorAll('.moneda-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          b.style.borderColor = '#e5e7eb';
          b.style.color = '#6b7280';
          if (b.dataset.moneda === monedaSeleccionada) {
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
            b.style.borderColor = '';
            b.style.color = '';
          }
        });
        document.querySelectorAll('.tipo-cuenta-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          b.style.borderColor = '#e5e7eb';
          b.style.color = '#6b7280';
          if (b.dataset.tipo === tipoSeleccionado) {
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
            b.style.borderColor = '';
            b.style.color = '';
          }
        });
        document.querySelectorAll('.color-btn').forEach(b => {
          b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500');
          if (b.dataset.color === colorSeleccionado)
            b.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
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