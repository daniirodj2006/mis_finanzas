import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const iconAbonar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

let editandoId = null;

export function renderAhorros() {
  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Ahorros</h1>

      <!-- Formulario nueva meta -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4" id="formulario-ahorro">
        <p class="text-gray-500 text-xs mb-2 font-medium">Nueva meta</p>
        <input id="ahorro-nombre" type="text" placeholder="Nombre (ej: Vacaciones)"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
        <input id="ahorro-meta" type="number" placeholder="Meta (₡)"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <div class="flex gap-2">
          <button id="btn-cancelar" class="hidden w-full border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button id="btn-agregar-ahorro" class="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition">
            Crear meta
          </button>
        </div>
      </div>

      <!-- Lista de metas -->
      <div id="lista-ahorros"></div>

      <!-- Modal abonar -->
      <div id="modal-abonar" class="hidden fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50">
        <div class="bg-white rounded-t-2xl p-6 w-full max-w-md">
          <p class="text-gray-700 font-medium mb-3">Agregar abono</p>
          <input id="abono-monto" type="number" placeholder="Monto (₡)"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
          <div class="flex gap-2">
            <button id="btn-cancelar-abono" class="w-full border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium">
              Cancelar
            </button>
            <button id="btn-confirmar-abono" class="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition">
              Abonar
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  let metaActivaId = null;
  let metaActivaAhorro = 0;

  // Cerrar modal
  document.querySelector('#btn-cancelar-abono').addEventListener('click', () => {
    document.querySelector('#modal-abonar').classList.add('hidden');
    document.querySelector('#abono-monto').value = '';
    metaActivaId = null;
  });

  // Confirmar abono
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

  // Cancelar edición
  document.querySelector('#btn-cancelar').addEventListener('click', () => {
    editandoId = null;
    document.querySelector('#ahorro-nombre').value = '';
    document.querySelector('#ahorro-meta').value = '';
    document.querySelector('#btn-agregar-ahorro').textContent = 'Crear meta';
    document.querySelector('#btn-cancelar').classList.add('hidden');
  });

  // Crear o editar meta
  document.querySelector('#btn-agregar-ahorro').addEventListener('click', async () => {
    const nombre = document.querySelector('#ahorro-nombre').value.trim();
    const meta = parseFloat(document.querySelector('#ahorro-meta').value);
    if (!nombre || isNaN(meta) || meta <= 0) return;

    if (editandoId) {
      await updateDoc(doc(db, 'ahorros', editandoId), { nombre, meta });
      editandoId = null;
      document.querySelector('#btn-agregar-ahorro').textContent = 'Crear meta';
      document.querySelector('#btn-cancelar').classList.add('hidden');
    } else {
      await addDoc(collection(db, 'ahorros'), {
        uid: auth.currentUser.uid,
        nombre,
        meta,
        ahorrado: 0,
        fecha: new Date()
      });
    }

    document.querySelector('#ahorro-nombre').value = '';
    document.querySelector('#ahorro-meta').value = '';
  });

  // Lista en tiempo real
  const q = query(
    collection(db, 'ahorros'),
    where('uid', '==', auth.currentUser.uid),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-ahorros');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay metas aún</p>`;
      return;
    }

    lista.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const porcentaje = Math.min(Math.round((data.ahorrado / data.meta) * 100), 100);
      const completa = porcentaje >= 100;

      return `
        <div class="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-gray-800 font-medium text-sm">${data.nombre}</p>
              <p class="text-gray-400 text-xs mt-0.5">₡${data.ahorrado.toLocaleString()} de ₡${data.meta.toLocaleString()}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold ${completa ? 'text-green-500' : 'text-indigo-600'}">${porcentaje}%</span>
              <button data-id="${d.id}" data-nombre="${data.nombre}" data-meta="${data.meta}"
                class="btn-editar text-gray-400 hover:text-indigo-500 transition">${iconEditar}</button>
              <button data-id="${d.id}"
                class="btn-borrar text-gray-400 hover:text-red-500 transition">${iconBorrar}</button>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div class="h-2 rounded-full transition-all ${completa ? 'bg-green-400' : 'bg-indigo-500'}"
              style="width: ${porcentaje}%"></div>
          </div>

          <button data-id="${d.id}" data-ahorrado="${data.ahorrado}"
            class="btn-abonar w-full flex items-center justify-center gap-2 border border-indigo-200 text-indigo-600 rounded-xl py-2 text-sm hover:bg-indigo-50 transition ${completa ? 'opacity-50 pointer-events-none' : ''}">
            ${iconAbonar} Agregar abono
          </button>
        </div>
      `;
    }).join('');

    // Abonar
    document.querySelectorAll('.btn-abonar').forEach(btn => {
      btn.addEventListener('click', () => {
        metaActivaId = btn.dataset.id;
        metaActivaAhorro = parseFloat(btn.dataset.ahorrado);
        document.querySelector('#modal-abonar').classList.remove('hidden');
      });
    });

    // Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        document.querySelector('#ahorro-nombre').value = btn.dataset.nombre;
        document.querySelector('#ahorro-meta').value = btn.dataset.meta;
        document.querySelector('#btn-agregar-ahorro').textContent = 'Guardar cambios';
        document.querySelector('#btn-cancelar').classList.remove('hidden');
        document.querySelector('#formulario-ahorro').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Borrar
    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Borrar esta meta?')) {
          await deleteDoc(doc(db, 'ahorros', btn.dataset.id));
        }
      });
    });
  });
}