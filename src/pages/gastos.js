import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { getTipoCambio, convertir } from '../utils/tipoCambio.js';

const categorias = [
  { id: 'comida', label: 'Comida', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>` },
  { id: 'transporte', label: 'Transporte', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
  { id: 'salud', label: 'Salud', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
  { id: 'entretenimiento', label: 'Ocio', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>` },
  { id: 'ropa', label: 'Ropa', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>` },
  { id: 'servicios', label: 'Servicios', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
  { id: 'otros', label: 'Otros', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
];

const frecuencias = [
  { id: 'unica', label: 'Única vez' },
  { id: 'semanal', label: 'Semanal' },
  { id: 'quincenal', label: 'Quincenal' },
  { id: 'mensual', label: 'Mensual' },
  { id: 'anual', label: 'Anual' },
];

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const iconRecurrente = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`;

let categoriaSeleccionada = '';
let pagoSeleccionado = null;
let tipoPago = null;
let frecuenciaSeleccionada = 'unica';
let editandoId = null;
let monedaSeleccionada = 'CRC';

export async function renderGastos() {
  const [tarjetasSnap, cuentasSnap] = await Promise.all([
    getDocs(query(collection(db, 'tarjetas'), where('uid', '==', auth.currentUser.uid))),
    getDocs(query(collection(db, 'cuentas'), where('uid', '==', auth.currentUser.uid)))
  ]);

  const tarjetas = tarjetasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const cuentas = cuentasSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Gastos</h1>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4" id="formulario-gasto">
        <input id="gasto-desc" type="text" placeholder="Descripción"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
        <input id="gasto-monto" type="number" placeholder="Monto"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">$ Dólares</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Categoría</p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${categorias.map(c => `
            <button data-cat="${c.id}"
              class="cat-btn flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
              ${c.icon} ${c.label}
            </button>
          `).join('')}
        </div>

        <p class="text-gray-400 text-xs mb-2">¿Con qué pagás? <span class="text-red-400">*</span></p>
        ${tarjetas.length > 0 ? `
          <p class="text-gray-300 text-xs mb-1">Tarjetas</p>
          <div class="flex flex-wrap gap-2 mb-2">
            ${tarjetas.map(t => `
              <button data-id="${t.id}" data-tipo="tarjeta" data-nombre="${t.nombre}" data-saldocrc="${t.saldoCRC || 0}" data-saldousd="${t.saldoUSD || 0}"
                class="pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 transition">
                ${t.nombre}
              </button>
            `).join('')}
          </div>
        ` : ''}
        ${cuentas.length > 0 ? `
          <p class="text-gray-300 text-xs mb-1">Cuentas</p>
          <div class="flex flex-wrap gap-2 mb-3">
            ${cuentas.map(c => `
              <button data-id="${c.id}" data-tipo="cuenta" data-nombre="${c.nombre}" data-moneda="${c.moneda}" data-balance="${c.balance}"
                class="pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
                ${c.nombre}
              </button>
            `).join('')}
          </div>
        ` : ''}
        <p id="error-pago" class="hidden text-red-400 text-xs mb-2">Seleccioná una tarjeta o cuenta</p>

        <p class="text-gray-400 text-xs mb-2">Frecuencia</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${frecuencias.map(f => `
            <button data-freq="${f.id}"
              class="freq-btn text-xs px-3 py-1.5 rounded-full border ${f.id === 'unica' ? 'border-indigo-400 text-indigo-600 bg-indigo-50' : 'border-gray-200 text-gray-500'} hover:border-indigo-400 hover:text-indigo-600 transition">
              ${f.label}
            </button>
          `).join('')}
        </div>

        <div class="flex gap-2">
          <button id="btn-cancelar" class="hidden w-full border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button id="btn-agregar-gasto" class="w-full bg-red-400 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-500 transition">
            Agregar gasto
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-gray-700 font-medium mb-3">Mis gastos</p>
        <div id="lista-gastos">
          <p class="text-gray-400 text-sm text-center py-4">No hay gastos aún</p>
        </div>
      </div>

    </div>
  `;

  // Moneda
  document.querySelectorAll('.moneda-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.moneda-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      monedaSeleccionada = btn.dataset.moneda;
    });
  });

  // Categoría
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      categoriaSeleccionada = btn.dataset.cat;
    });
  });

  // Pago
  document.querySelectorAll('.pago-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pago-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50',
                           'border-purple-400', 'text-purple-600', 'bg-purple-50'));
      const esTarjeta = btn.dataset.tipo === 'tarjeta';
      btn.classList.add(
        esTarjeta ? 'border-purple-400' : 'border-indigo-400',
        esTarjeta ? 'text-purple-600' : 'text-indigo-600',
        esTarjeta ? 'bg-purple-50' : 'bg-indigo-50'
      );
      pagoSeleccionado = btn.dataset.id;
      tipoPago = btn.dataset.tipo;
      document.querySelector('#error-pago').classList.add('hidden');
    });
  });

  // Frecuencia
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.freq-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      frecuenciaSeleccionada = btn.dataset.freq;
    });
  });

  // Cancelar
  document.querySelector('#btn-cancelar').addEventListener('click', () => {
    editandoId = null;
    categoriaSeleccionada = '';
    pagoSeleccionado = null;
    tipoPago = null;
    frecuenciaSeleccionada = 'unica';
    document.querySelector('#gasto-desc').value = '';
    document.querySelector('#gasto-monto').value = '';
    document.querySelector('#btn-agregar-gasto').textContent = 'Agregar gasto';
    document.querySelector('#btn-cancelar').classList.add('hidden');
    document.querySelectorAll('.cat-btn, .pago-btn').forEach(b =>
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50',
                         'border-purple-400', 'text-purple-600', 'bg-purple-50'));
    document.querySelectorAll('.freq-btn').forEach(b => {
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      if (b.dataset.freq === 'unica')
        b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
    });
  });

  // Agregar o editar
  document.querySelector('#btn-agregar-gasto').addEventListener('click', async () => {
    const desc = document.querySelector('#gasto-desc').value.trim();
    const monto = parseFloat(document.querySelector('#gasto-monto').value);
    if (!desc || isNaN(monto) || monto <= 0) return;

    if (!pagoSeleccionado) {
      document.querySelector('#error-pago').classList.remove('hidden');
      return;
    }

    const datos = {
      uid: auth.currentUser.uid,
      tipo: 'gasto',
      descripcion: desc,
      monto,
      moneda: monedaSeleccionada,
      categoria: categoriaSeleccionada || 'otros',
      pagoId: pagoSeleccionado,
      tipoPago,
      frecuencia: frecuenciaSeleccionada,
      fecha: new Date()
    };

    if (editandoId) {
      await updateDoc(doc(db, 'transacciones', editandoId), datos);
      editandoId = null;
      document.querySelector('#btn-agregar-gasto').textContent = 'Agregar gasto';
      document.querySelector('#btn-cancelar').classList.add('hidden');
    } else {
      await addDoc(collection(db, 'transacciones'), datos);

      if (tipoPago === 'tarjeta') {
        const tarjeta = tarjetas.find(t => t.id === pagoSeleccionado);
        if (tarjeta) {
          const update = monedaSeleccionada === 'CRC'
            ? { saldoCRC: (tarjeta.saldoCRC || 0) + monto }
            : { saldoUSD: (tarjeta.saldoUSD || 0) + monto };
          await updateDoc(doc(db, 'tarjetas', pagoSeleccionado), update);
        }
      } else if (tipoPago === 'cuenta') {
        const cuenta = cuentas.find(c => c.id === pagoSeleccionado);
        if (cuenta) {
          const tc = await getTipoCambio();
          const montoConvertido = convertir(monto, monedaSeleccionada, cuenta.moneda, tc);
          await updateDoc(doc(db, 'cuentas', pagoSeleccionado), {
            balance: (cuenta.balance || 0) - montoConvertido
          });
        }
      }
    }

    document.querySelector('#gasto-desc').value = '';
    document.querySelector('#gasto-monto').value = '';
    categoriaSeleccionada = '';
    pagoSeleccionado = null;
    tipoPago = null;
    frecuenciaSeleccionada = 'unica';
    editandoId = null;
    document.querySelector('#btn-agregar-gasto').textContent = 'Agregar gasto';
    document.querySelector('#btn-cancelar').classList.add('hidden');
    document.querySelectorAll('.cat-btn, .pago-btn').forEach(b =>
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50',
                         'border-purple-400', 'text-purple-600', 'bg-purple-50'));
    document.querySelectorAll('.freq-btn').forEach(b => {
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      if (b.dataset.freq === 'unica')
        b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
    });
  });

  // Lista
  const q = query(
    collection(db, 'transacciones'),
    where('uid', '==', auth.currentUser.uid),
    where('tipo', '==', 'gasto'),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-gastos');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay gastos aún</p>`;
      return;
    }

    const catLabel = (id) => categorias.find(c => c.id === id)?.label || 'Otros';
    const catIcon = (id) => categorias.find(c => c.id === id)?.icon || '';
    const pagoNombre = (id, tipo) => {
      if (tipo === 'tarjeta') return tarjetas.find(t => t.id === id)?.nombre || '';
      if (tipo === 'cuenta') return cuentas.find(c => c.id === id)?.nombre || '';
      return '';
    };
    const freqLabel = (id) => frecuencias.find(f => f.id === id)?.label || '';

    lista.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const simbolo = data.moneda === 'USD' ? '$' : '₡';
      const colorPago = data.tipoPago === 'tarjeta' ? 'text-purple-500' : 'text-indigo-500';
      const esRecurrente = data.frecuencia && data.frecuencia !== 'unica';

      return `
        <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-gray-700 text-sm">${data.descripcion}</p>
              ${esRecurrente ? `<span class="text-red-400">${iconRecurrente}</span>` : ''}
            </div>
            <div class="flex gap-2 mt-0.5 flex-wrap">
              <p class="text-gray-400 text-xs flex items-center gap-1">${catIcon(data.categoria)} ${catLabel(data.categoria)}</p>
              ${data.pagoId ? `<span class="text-xs ${colorPago}">· ${pagoNombre(data.pagoId, data.tipoPago)}</span>` : ''}
              ${esRecurrente ? `<span class="text-xs text-red-400">· ${freqLabel(data.frecuencia)}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-red-400 font-semibold text-sm">${simbolo}${data.monto.toLocaleString()}</p>
            <button data-id="${d.id}" data-desc="${data.descripcion}" data-monto="${data.monto}" data-cat="${data.categoria || ''}" data-pagoid="${data.pagoId || ''}" data-tipopago="${data.tipoPago || ''}" data-freq="${data.frecuencia || 'unica'}"
              class="btn-editar text-gray-400 hover:text-indigo-500 transition">${iconEditar}</button>
            <button data-id="${d.id}"
              class="btn-borrar text-gray-400 hover:text-red-500 transition">${iconBorrar}</button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        document.querySelector('#gasto-desc').value = btn.dataset.desc;
        document.querySelector('#gasto-monto').value = btn.dataset.monto;
        categoriaSeleccionada = btn.dataset.cat;
        pagoSeleccionado = btn.dataset.pagoid || null;
        tipoPago = btn.dataset.tipopago || null;
        frecuenciaSeleccionada = btn.dataset.freq || 'unica';

        document.querySelectorAll('.cat-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.cat === categoriaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        document.querySelectorAll('.pago-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50',
                             'border-purple-400', 'text-purple-600', 'bg-purple-50');
          if (b.dataset.id === pagoSeleccionado) {
            const esTarjeta = b.dataset.tipo === 'tarjeta';
            b.classList.add(
              esTarjeta ? 'border-purple-400' : 'border-indigo-400',
              esTarjeta ? 'text-purple-600' : 'text-indigo-600',
              esTarjeta ? 'bg-purple-50' : 'bg-indigo-50'
            );
          }
        });
        document.querySelectorAll('.freq-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.freq === frecuenciaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });

        document.querySelector('#btn-agregar-gasto').textContent = 'Guardar cambios';
        document.querySelector('#btn-cancelar').classList.remove('hidden');
        document.querySelector('#formulario-gasto').scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Borrar este gasto?')) {
          await deleteDoc(doc(db, 'transacciones', btn.dataset.id));
        }
      });
    });
  });
}