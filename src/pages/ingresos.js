import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';

const categorias = [
  { id: 'salario', label: 'Salario', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20l-6-4z"/></svg>` },
  { id: 'freelance', label: 'Freelance', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  { id: 'negocio', label: 'Negocio', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>` },
  { id: 'inversion', label: 'Inversión', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>` },
  { id: 'regalo', label: 'Regalo', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>` },
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
let cuentaSeleccionada = null;
let frecuenciaSeleccionada = 'unica';
let editandoId = null;
let monedaSeleccionada = 'CRC';

export async function renderIngresos() {
  const cuentasSnap = await getDocs(query(
    collection(db, 'cuentas'),
    where('uid', '==', auth.currentUser.uid)
  ));
  const cuentas = cuentasSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Ingresos</h1>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4" id="formulario-ingreso">
        <input id="ingreso-desc" type="text" placeholder="Descripción"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
        <input id="ingreso-monto" type="number" placeholder="Monto"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">
            ₡ Colones
          </button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">
            $ Dólares
          </button>
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

        <p class="text-gray-400 text-xs mb-2">¿A qué cuenta entra? <span class="text-red-400">*</span></p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${cuentas.map(c => `
            <button data-id="${c.id}" data-nombre="${c.nombre}"
              class="cuenta-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
              ${c.nombre}
            </button>
          `).join('')}
        </div>
        <p id="error-cuenta" class="hidden text-red-400 text-xs mb-2">Seleccioná una cuenta</p>

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
          <button id="btn-agregar-ingreso" class="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition">
            Agregar ingreso
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-gray-700 font-medium mb-3">Mis ingresos</p>
        <div id="lista-ingresos">
          <p class="text-gray-400 text-sm text-center py-4">No hay ingresos aún</p>
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

  // Cuenta
  document.querySelectorAll('.cuenta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cuenta-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      cuentaSeleccionada = btn.dataset.id;
      document.querySelector('#error-cuenta').classList.add('hidden');
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
    cuentaSeleccionada = null;
    frecuenciaSeleccionada = 'unica';
    document.querySelector('#ingreso-desc').value = '';
    document.querySelector('#ingreso-monto').value = '';
    document.querySelector('#btn-agregar-ingreso').textContent = 'Agregar ingreso';
    document.querySelector('#btn-cancelar').classList.add('hidden');
    document.querySelectorAll('.cat-btn, .cuenta-btn').forEach(b =>
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
    document.querySelectorAll('.freq-btn').forEach(b => {
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      if (b.dataset.freq === 'unica')
        b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
    });
  });

  // Agregar o editar
  document.querySelector('#btn-agregar-ingreso').addEventListener('click', async () => {
    const desc = document.querySelector('#ingreso-desc').value.trim();
    const monto = parseFloat(document.querySelector('#ingreso-monto').value);
    if (!desc || isNaN(monto) || monto <= 0) return;

    if (!cuentaSeleccionada) {
      document.querySelector('#error-cuenta').classList.remove('hidden');
      return;
    }

    const datos = {
      uid: auth.currentUser.uid,
      tipo: 'ingreso',
      descripcion: desc,
      monto,
      moneda: monedaSeleccionada,
      categoria: categoriaSeleccionada || 'otros',
      cuentaId: cuentaSeleccionada,
      frecuencia: frecuenciaSeleccionada,
      fecha: new Date()
    };

    if (editandoId) {
      await updateDoc(doc(db, 'transacciones', editandoId), datos);
      editandoId = null;
      document.querySelector('#btn-agregar-ingreso').textContent = 'Agregar ingreso';
      document.querySelector('#btn-cancelar').classList.add('hidden');
    } else {
      await addDoc(collection(db, 'transacciones'), datos);
      // Actualizar balance cuenta
      const cuenta = cuentas.find(c => c.id === cuentaSeleccionada);
      if (cuenta) {
        await updateDoc(doc(db, 'cuentas', cuentaSeleccionada), {
          balance: (cuenta.balance || 0) + monto
        });
      }
    }

    document.querySelector('#ingreso-desc').value = '';
    document.querySelector('#ingreso-monto').value = '';
    categoriaSeleccionada = '';
    cuentaSeleccionada = null;
    frecuenciaSeleccionada = 'unica';
    document.querySelectorAll('.cat-btn, .cuenta-btn').forEach(b =>
      b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
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
    where('tipo', '==', 'ingreso'),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-ingresos');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay ingresos aún</p>`;
      return;
    }

    const catLabel = (id) => categorias.find(c => c.id === id)?.label || 'Otros';
    const cuentaNombre = (id) => cuentas.find(c => c.id === id)?.nombre || '';
    const freqLabel = (id) => frecuencias.find(f => f.id === id)?.label || '';

    lista.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const simbolo = data.moneda === 'USD' ? '$' : '₡';
      const esRecurrente = data.frecuencia && data.frecuencia !== 'unica';

      return `
        <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-gray-700 text-sm">${data.descripcion}</p>
              ${esRecurrente ? `<span class="text-indigo-400">${iconRecurrente}</span>` : ''}
            </div>
            <div class="flex gap-2 mt-0.5 flex-wrap">
              <p class="text-gray-400 text-xs">${catLabel(data.categoria)}</p>
              ${data.cuentaId ? `<span class="text-xs text-indigo-500">· ${cuentaNombre(data.cuentaId)}</span>` : ''}
              ${esRecurrente ? `<span class="text-xs text-indigo-400">· ${freqLabel(data.frecuencia)}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-green-500 font-semibold text-sm">${simbolo}${data.monto.toLocaleString()}</p>
            <button data-id="${d.id}" data-desc="${data.descripcion}" data-monto="${data.monto}" data-cat="${data.categoria || ''}" data-cuentaid="${data.cuentaId || ''}" data-freq="${data.frecuencia || 'unica'}"
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
        document.querySelector('#ingreso-desc').value = btn.dataset.desc;
        document.querySelector('#ingreso-monto').value = btn.dataset.monto;
        categoriaSeleccionada = btn.dataset.cat;
        cuentaSeleccionada = btn.dataset.cuentaid;
        frecuenciaSeleccionada = btn.dataset.freq || 'unica';

        document.querySelectorAll('.cat-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.cat === categoriaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        document.querySelectorAll('.cuenta-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.id === cuentaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        document.querySelectorAll('.freq-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.freq === frecuenciaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });

        document.querySelector('#btn-agregar-ingreso').textContent = 'Guardar cambios';
        document.querySelector('#btn-cancelar').classList.remove('hidden');
        document.querySelector('#formulario-ingreso').scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Borrar este ingreso?')) {
          await deleteDoc(doc(db, 'transacciones', btn.dataset.id));
        }
      });
    });
  });
}