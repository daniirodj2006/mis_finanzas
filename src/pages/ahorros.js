import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const iconAbonar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

const iconMeta = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

const extras = ['#1a1a2e','#533483','#c0392b','#e67e22','#27ae60','#2980b9','#7f8c8d'];

function getColoresAhorro() {
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
let colorSeleccionado = getColoresAhorro()[0];
let metaActivaId = null;
let metaActivaAhorro = 0;

function abrirSheet() {
  document.querySelector('#sheet-overlay').classList.remove('hidden');
  document.querySelector('#sheet-ahorro').classList.remove('hidden');
}

function cerrarSheet() {
  document.querySelector('#sheet-overlay').classList.add('hidden');
  document.querySelector('#sheet-ahorro').classList.add('hidden');
  editandoId = null;
  colorSeleccionado = getColoresAhorro()[0];
  document.querySelector('#ahorro-nombre').value = '';
  document.querySelector('#ahorro-meta').value = '';
  document.querySelector('#sheet-titulo').textContent = 'Nueva meta';
  document.querySelector('#btn-guardar-ahorro').textContent = 'Crear meta';
  document.querySelectorAll('.color-btn').forEach(b =>
    b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500'));
  document.querySelector('.color-btn')?.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
}

export function renderAhorros() {
  const colores = getColoresAhorro();

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Ahorros</h1>
          <p class="text-gray-400 text-xs mt-0.5">Tus objetivos financieros</p>
        </div>
        <button id="btn-nueva-meta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <p id="total-ahorros" class="text-gray-500 text-xs mb-4"></p>
      <div id="lista-ahorros"></div>

    </div>

    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <!-- Sheet nueva meta -->
    <div id="sheet-ahorro" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva meta</p>
          <button id="btn-cerrar-sheet" style="color:#9ca3af">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <input id="ahorro-nombre" type="text" placeholder="Nombre (ej: Vacaciones)"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-3 text-sm outline-none"/>

        <input id="ahorro-meta" type="number" placeholder="Meta (₡)"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-3 text-sm outline-none"/>

        <p style="color:#9ca3af;font-size:12px;margin-bottom:8px">Color</p>
        <div class="flex gap-2 mb-4 flex-wrap">
          ${colores.map((c, i) => `
            <button data-color="${c}" class="color-btn w-9 h-9 rounded-full transition-all ${i === 0 ? 'ring-2 ring-offset-2 ring-gray-500' : ''}" style="background-color: ${c}"></button>
          `).join('')}
        </div>

        <button id="btn-guardar-ahorro" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Crear meta
        </button>
      </div>
    </div>

    <!-- Modal abonar -->
    <div id="modal-abonar" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold" style="color:#1f2937">Agregar abono</p>
          <button id="btn-cerrar-abono" style="color:#9ca3af">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <input id="abono-monto" type="number" placeholder="Monto (₡)"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-4 text-sm outline-none"/>
        <button id="btn-confirmar-abono" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Abonar
        </button>
      </div>
    </div>
  `;

  document.querySelector('#btn-nueva-meta').addEventListener('click', abrirSheet);
  document.querySelector('#btn-cerrar-sheet').addEventListener('click', cerrarSheet);
  document.querySelector('#sheet-overlay').addEventListener('click', cerrarSheet);

  document.querySelector('#btn-cerrar-abono').addEventListener('click', () => {
    document.querySelector('#modal-abonar').classList.add('hidden');
    document.querySelector('#abono-monto').value = '';
    metaActivaId = null;
  });

  document.querySelector('#btn-confirmar-abono').addEventListener('click', async () => {
    const monto = parseFloat(document.querySelector('#abono-monto').value);
    if (isNaN(monto) || monto <= 0 || !metaActivaId) return;
    await updateDoc(doc(db, 'ahorros', metaActivaId), {
      ahorrado: metaActivaAhorro + monto
    });
    document.querySelector('#modal-abonar').classList.add('hidden');
    document.querySelector('#abono-monto').value = '';
    metaActivaId = null;
  });

  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b =>
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500'));
      btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
      colorSeleccionado = btn.dataset.color;
    });
  });

  document.querySelector('#btn-guardar-ahorro').addEventListener('click', async () => {
    const nombre = document.querySelector('#ahorro-nombre').value.trim();
    const meta = parseFloat(document.querySelector('#ahorro-meta').value);
    if (!nombre || isNaN(meta) || meta <= 0) return;

    if (editandoId) {
      await updateDoc(doc(db, 'ahorros', editandoId), {
        nombre, meta, color: colorSeleccionado
      });
    } else {
      await addDoc(collection(db, 'ahorros'), {
        uid: auth.currentUser.uid,
        nombre, meta, ahorrado: 0,
        color: colorSeleccionado,
        fecha: new Date()
      });
    }
    cerrarSheet();
  });

  const q = query(
    collection(db, 'ahorros'),
    where('uid', '==', auth.currentUser.uid),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-ahorros');
    const totalEl = document.querySelector('#total-ahorros');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay metas aún</p>`;
      return;
    }

    const ahorros = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalAhorrado = ahorros.reduce((s, a) => s + (a.ahorrado || 0), 0);
    if (totalEl) totalEl.textContent = `Total ahorrado: ₡${totalAhorrado.toLocaleString()}`;

    lista.innerHTML = ahorros.map(data => {
      const porcentaje = Math.min(Math.round((data.ahorrado / data.meta) * 100), 100);
      const completa = porcentaje >= 100;
      const color = data.color || colores[0];
      const faltan = Math.max(0, data.meta - data.ahorrado);

      return `
        <!-- Card meta con gradiente -->
        <div class="rounded-2xl p-5 mb-2 relative overflow-hidden"
          style="background: linear-gradient(135deg, ${color}, ${color}99)">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: rgba(255,255,255,0.2)">
                ${iconMeta}
              </div>
              <div>
                <p class="text-white font-semibold text-base">${data.nombre}</p>
                <p class="text-white text-xs" style="opacity:0.7">Faltan ₡${faltan.toLocaleString()}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <p class="text-white font-bold text-lg">${porcentaje}%</p>
              <div class="flex gap-2">
                <button data-id="${data.id}" data-nombre="${data.nombre}" data-meta="${data.meta}" data-color="${color}"
                  class="btn-editar" style="color:white;opacity:0.8">${iconEditar}</button>
                <button data-id="${data.id}"
                  class="btn-borrar" style="color:white;opacity:0.8">${iconBorrar}</button>
              </div>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="w-full rounded-full h-2 mb-2" style="background: rgba(255,255,255,0.3)">
            <div class="h-2 rounded-full transition-all" style="width: ${porcentaje}%; background: white"></div>
          </div>

          <div class="flex justify-between text-white text-xs" style="opacity:0.8">
            <span>₡${(data.ahorrado || 0).toLocaleString()}</span>
            <span>₡${data.meta.toLocaleString()}</span>
          </div>
        </div>

        <!-- Info debajo -->
        <div class="bg-white rounded-2xl px-4 pt-3 pb-4 mb-4 shadow-sm">
          <button data-id="${data.id}" data-ahorrado="${data.ahorrado}"
            class="btn-abonar w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-100 transition ${completa ? 'opacity-50 pointer-events-none' : ''}">
            ${iconAbonar} ${completa ? '¡Meta alcanzada! 🎉' : 'Agregar abono'}
          </button>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-abonar').forEach(btn => {
      btn.addEventListener('click', () => {
        metaActivaId = btn.dataset.id;
        metaActivaAhorro = parseFloat(btn.dataset.ahorrado);
        document.querySelector('#modal-abonar').classList.remove('hidden');
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        colorSeleccionado = btn.dataset.color;
        document.querySelector('#ahorro-nombre').value = btn.dataset.nombre;
        document.querySelector('#ahorro-meta').value = btn.dataset.meta;
        document.querySelector('#sheet-titulo').textContent = 'Editar meta';
        document.querySelector('#btn-guardar-ahorro').textContent = 'Guardar cambios';
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
        if (confirm('¿Borrar esta meta?')) {
          await deleteDoc(doc(db, 'ahorros', btn.dataset.id));
        }
      });
    });
  });
}