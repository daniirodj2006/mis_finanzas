import { db, auth } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { getTipoCambio, convertir } from '../utils/tipoCambio.js';

const iconEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const iconBorrar = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
const iconVer = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

let editandoId = null;
let tipoSeleccionado = 'credito';
let monedaSeleccionada = 'CRC';
let tarjetaPagando = null;
let cuentaPagoSeleccionada = null;
let monedaPagando = 'CRC';

function abrirSheet() {
  document.querySelector('#sheet-overlay').classList.remove('hidden');
  document.querySelector('#sheet-tarjeta').classList.remove('hidden');
}

function cerrarSheet() {
  document.querySelector('#sheet-overlay').classList.add('hidden');
  document.querySelector('#sheet-tarjeta').classList.add('hidden');
  editandoId = null;
  tipoSeleccionado = 'credito';
  monedaSeleccionada = 'CRC';
  document.querySelector('#tarjeta-nombre').value = '';
  document.querySelector('#tarjeta-limite').value = '';
  document.querySelector('#tarjeta-corte').value = '';
  document.querySelector('#tarjeta-pago-dia').value = '';
  document.querySelector('#sheet-titulo').textContent = 'Nueva tarjeta';
  document.querySelector('#btn-guardar-tarjeta').textContent = 'Agregar tarjeta';
  document.querySelectorAll('.tipo-btn').forEach(b =>
    b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
  document.querySelectorAll('.moneda-btn').forEach(b =>
    b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
  document.querySelector('[data-tipo="credito"]').classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
  document.querySelector('[data-moneda="CRC"]').classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
}

export async function renderTarjetas() {
  const cuentasSnap = await getDocs(query(
    collection(db, 'cuentas'),
    where('uid', '==', auth.currentUser.uid)
  ));
  const cuentas = cuentasSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Tarjetas</h1>
        <button id="btn-nueva-tarjeta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div id="lista-tarjetas"></div>

    </div>

    <!-- Overlay -->
    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <!-- Bottom sheet nueva tarjeta -->
    <div id="sheet-tarjeta" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 overflow-y-auto max-h-[90vh]">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva tarjeta</p>
          <button id="btn-cerrar-sheet" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <input id="tarjeta-nombre" type="text" placeholder="Nombre (ej: Visa BAC)"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Tipo</p>
        <div class="flex gap-2 mb-3">
          <button data-tipo="credito" class="tipo-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">Crédito</button>
          <button data-tipo="debito" class="tipo-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">Débito</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Moneda principal</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">$ Dólares</button>
        </div>

        <input id="tarjeta-limite" type="number" placeholder="Límite de crédito (opcional)"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <div class="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p class="text-gray-400 text-xs mb-1">Día de corte</p>
            <input id="tarjeta-corte" type="number" min="1" max="31" placeholder="ej: 15"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"/>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-1">Día de pago</p>
            <input id="tarjeta-pago-dia" type="number" min="1" max="31" placeholder="ej: 25"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"/>
          </div>
        </div>

        <button id="btn-guardar-tarjeta" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Agregar tarjeta
        </button>
      </div>
    </div>

    <!-- Modal pagar tarjeta -->
    <div id="modal-pago" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p class="text-gray-800 font-semibold">Pagar tarjeta</p>
          <button id="btn-cerrar-pago" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="info-saldo-tarjeta" class="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600"></div>
        <p class="text-gray-400 text-xs mb-2">¿Qué saldo pagás?</p>
        <div class="flex gap-2 mb-3">
          <button data-pagar="CRC" class="pagar-moneda flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-pagar="USD" class="pagar-moneda flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">$ Dólares</button>
        </div>
        <p class="text-gray-400 text-xs mb-2">¿De qué cuenta sale?</p>
        <div id="cuentas-pago" class="flex flex-wrap gap-2 mb-3"></div>
        <p id="error-cuenta-pago" class="hidden text-red-400 text-xs mb-2">Seleccioná una cuenta</p>
        <p id="info-conversion" class="text-indigo-500 text-xs mb-3 hidden"></p>
        <button id="btn-confirmar-pago" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Confirmar pago
        </button>
      </div>
    </div>

    <!-- Modal resumen gastos tarjeta -->
    <div id="modal-resumen" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <p id="resumen-titulo" class="text-gray-800 font-semibold"></p>
          <button id="btn-cerrar-resumen" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-gray-400 text-xs mb-1">Saldo ₡</p>
            <p id="resumen-saldo-crc" class="text-gray-800 font-semibold"></p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-gray-400 text-xs mb-1">Saldo $</p>
            <p id="resumen-saldo-usd" class="text-gray-800 font-semibold"></p>
          </div>
        </div>
        <p class="text-gray-700 font-medium mb-3">Gastos con esta tarjeta</p>
        <div id="resumen-lista"></div>
      </div>
    </div>
  `;

  document.querySelector('#btn-nueva-tarjeta').addEventListener('click', abrirSheet);
  document.querySelector('#btn-cerrar-sheet').addEventListener('click', cerrarSheet);
  document.querySelector('#sheet-overlay').addEventListener('click', cerrarSheet);
  document.querySelector('#btn-cerrar-pago').addEventListener('click', () =>
    document.querySelector('#modal-pago').classList.add('hidden'));
  document.querySelector('#btn-cerrar-resumen').addEventListener('click', () =>
    document.querySelector('#modal-resumen').classList.add('hidden'));

  document.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tipo-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      tipoSeleccionado = btn.dataset.tipo;
    });
  });

  document.querySelectorAll('.moneda-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.moneda-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      monedaSeleccionada = btn.dataset.moneda;
    });
  });

  document.querySelector('#btn-guardar-tarjeta').addEventListener('click', async () => {
    const nombre = document.querySelector('#tarjeta-nombre').value.trim();
    const limite = parseFloat(document.querySelector('#tarjeta-limite').value) || 0;
    const corte = parseInt(document.querySelector('#tarjeta-corte').value) || 0;
    const pago = parseInt(document.querySelector('#tarjeta-pago-dia').value) || 0;
    if (!nombre) return;

    if (editandoId) {
      await updateDoc(doc(db, 'tarjetas', editandoId), {
        nombre, tipo: tipoSeleccionado, moneda: monedaSeleccionada, limite, corte, pago
      });
    } else {
      await addDoc(collection(db, 'tarjetas'), {
        uid: auth.currentUser.uid,
        nombre,
        tipo: tipoSeleccionado,
        moneda: monedaSeleccionada,
        limite,
        saldoCRC: 0,
        saldoUSD: 0,
        corte,
        pago,
        fecha: new Date()
      });
    }
    cerrarSheet();
  });

  // Pagar moneda toggle
  document.querySelectorAll('.pagar-moneda').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pagar-moneda').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      monedaPagando = btn.dataset.pagar;
      actualizarInfoConversion();
    });
  });

  async function actualizarInfoConversion() {
    const infoEl = document.querySelector('#info-conversion');
    if (!cuentaPagoSeleccionada || !tarjetaPagando) return;
    const saldo = monedaPagando === 'CRC' ? tarjetaPagando.saldoCRC : tarjetaPagando.saldoUSD;
    if (monedaPagando !== cuentaPagoSeleccionada.moneda) {
      const tc = await getTipoCambio();
      const convertido = convertir(saldo, monedaPagando, cuentaPagoSeleccionada.moneda, tc);
      const simbolo = cuentaPagoSeleccionada.moneda === 'CRC' ? '₡' : '$';
      infoEl.textContent = `Se descontarán ${simbolo}${convertido.toLocaleString()} de tu cuenta`;
      infoEl.classList.remove('hidden');
    } else {
      infoEl.classList.add('hidden');
    }
  }

  document.querySelector('#btn-confirmar-pago').addEventListener('click', async () => {
    if (!cuentaPagoSeleccionada) {
      document.querySelector('#error-cuenta-pago').classList.remove('hidden');
      return;
    }

    const saldoAPagar = monedaPagando === 'CRC'
      ? tarjetaPagando.saldoCRC
      : tarjetaPagando.saldoUSD;

    const tc = await getTipoCambio();
    const montoDescontarCuenta = convertir(saldoAPagar, monedaPagando, cuentaPagoSeleccionada.moneda, tc);

    await updateDoc(doc(db, 'cuentas', cuentaPagoSeleccionada.id), {
      balance: cuentaPagoSeleccionada.balance - montoDescontarCuenta
    });

    const updateTarjeta = monedaPagando === 'CRC' ? { saldoCRC: 0 } : { saldoUSD: 0 };
    await updateDoc(doc(db, 'tarjetas', tarjetaPagando.id), updateTarjeta);

    await addDoc(collection(db, 'pagosTarjeta'), {
      uid: auth.currentUser.uid,
      tarjetaId: tarjetaPagando.id,
      cuentaId: cuentaPagoSeleccionada.id,
      monto: montoDescontarCuenta,
      moneda: cuentaPagoSeleccionada.moneda,
      fecha: new Date()
    });

    document.querySelector('#modal-pago').classList.add('hidden');
  });

  // Lista tarjetas
  const q = query(
    collection(db, 'tarjetas'),
    where('uid', '==', auth.currentUser.uid),
    orderBy('fecha', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    const lista = document.querySelector('#lista-tarjetas');
    if (!lista) return;

    if (snapshot.empty) {
      lista.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay tarjetas aún</p>`;
      return;
    }

    lista.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const colorTipo = data.tipo === 'credito' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600';
      const colorMoneda = data.moneda === 'USD' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';
      const saldoCRC = data.saldoCRC || 0;
      const saldoUSD = data.saldoUSD || 0;

      return `
        <div class="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-gray-800 font-medium text-sm">${data.nombre}</p>
              <div class="flex gap-1 mt-1">
                <span class="text-xs px-2 py-0.5 rounded-full ${colorTipo}">${data.tipo}</span>
                <span class="text-xs px-2 py-0.5 rounded-full ${colorMoneda}">${data.moneda}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button data-id="${d.id}" class="btn-ver text-gray-400 hover:text-indigo-500 transition">${iconVer}</button>
              <button data-id="${d.id}" data-nombre="${data.nombre}" data-tipo="${data.tipo}" data-moneda="${data.moneda}" data-limite="${data.limite}" data-corte="${data.corte}" data-pago="${data.pago}"
                class="btn-editar text-gray-400 hover:text-indigo-500 transition">${iconEditar}</button>
              <button data-id="${d.id}" class="btn-borrar text-gray-400 hover:text-red-500 transition">${iconBorrar}</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="bg-gray-50 rounded-xl p-2 text-center">
              <p class="text-gray-400 text-xs">Saldo ₡</p>
              <p class="text-gray-800 font-semibold text-sm">₡${saldoCRC.toLocaleString()}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-2 text-center">
              <p class="text-gray-400 text-xs">Saldo $</p>
              <p class="text-gray-800 font-semibold text-sm">$${saldoUSD.toLocaleString()}</p>
            </div>
          </div>

          ${data.corte || data.pago ? `
            <div class="flex gap-3 text-xs text-gray-400 mb-3">
              ${data.corte ? `<span>Corte: día ${data.corte}</span>` : ''}
              ${data.pago ? `<span>Pago: día ${data.pago}</span>` : ''}
            </div>
          ` : ''}

          <button data-id="${d.id}" data-nombre="${data.nombre}" data-saldocrc="${saldoCRC}" data-saldousd="${saldoUSD}"
            class="btn-pagar w-full bg-indigo-50 text-indigo-600 rounded-xl py-2 text-sm font-medium hover:bg-indigo-100 transition">
            Pagar tarjeta
          </button>
        </div>
      `;
    }).join('');

    // Ver resumen
    document.querySelectorAll('.btn-ver').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tarjeta = snapshot.docs.find(d => d.id === btn.dataset.id);
        if (!tarjeta) return;
        const data = tarjeta.data();

        document.querySelector('#resumen-titulo').textContent = data.nombre;
        document.querySelector('#resumen-saldo-crc').textContent = `₡${(data.saldoCRC || 0).toLocaleString()}`;
        document.querySelector('#resumen-saldo-usd').textContent = `$${(data.saldoUSD || 0).toLocaleString()}`;

        // Cargar gastos de esta tarjeta
        const gastosSnap = await getDocs(query(
          collection(db, 'transacciones'),
          where('uid', '==', auth.currentUser.uid),
          where('pagoId', '==', btn.dataset.id),
          where('tipo', '==', 'gasto')
        ));

        const listaEl = document.querySelector('#resumen-lista');
        if (gastosSnap.empty) {
          listaEl.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay gastos con esta tarjeta</p>`;
        } else {
          listaEl.innerHTML = gastosSnap.docs.map(d => {
            const g = d.data();
            const simbolo = g.moneda === 'USD' ? '$' : '₡';
            const fecha = g.fecha?.toDate?.() || new Date();
            return `
              <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p class="text-gray-700 text-sm">${g.descripcion}</p>
                  <p class="text-gray-400 text-xs">${fecha.toLocaleDateString('es-CR')}</p>
                </div>
                <p class="text-red-400 font-semibold text-sm">${simbolo}${g.monto.toLocaleString()}</p>
              </div>
            `;
          }).join('');
        }

        document.querySelector('#modal-resumen').classList.remove('hidden');
      });
    });

    // Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editandoId = btn.dataset.id;
        tipoSeleccionado = btn.dataset.tipo;
        monedaSeleccionada = btn.dataset.moneda;
        document.querySelector('#tarjeta-nombre').value = btn.dataset.nombre;
        document.querySelector('#tarjeta-limite').value = btn.dataset.limite;
        document.querySelector('#tarjeta-corte').value = btn.dataset.corte;
        document.querySelector('#tarjeta-pago-dia').value = btn.dataset.pago;
        document.querySelector('#sheet-titulo').textContent = 'Editar tarjeta';
        document.querySelector('#btn-guardar-tarjeta').textContent = 'Guardar cambios';
        document.querySelectorAll('.tipo-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.tipo === tipoSeleccionado)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        document.querySelectorAll('.moneda-btn').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.moneda === monedaSeleccionada)
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });
        abrirSheet();
      });
    });

    // Borrar
    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('¿Borrar esta tarjeta?')) {
          await deleteDoc(doc(db, 'tarjetas', btn.dataset.id));
        }
      });
    });

    // Pagar tarjeta
    document.querySelectorAll('.btn-pagar').forEach(btn => {
      btn.addEventListener('click', () => {
        tarjetaPagando = {
          id: btn.dataset.id,
          nombre: btn.dataset.nombre,
          saldoCRC: parseFloat(btn.dataset.saldocrc),
          saldoUSD: parseFloat(btn.dataset.saldousd),
        };
        cuentaPagoSeleccionada = null;
        monedaPagando = 'CRC';

        document.querySelector('#info-saldo-tarjeta').innerHTML = `
          <p class="font-medium mb-1">${tarjetaPagando.nombre}</p>
          <p>Saldo ₡: ${tarjetaPagando.saldoCRC.toLocaleString()}</p>
          <p>Saldo $: ${tarjetaPagando.saldoUSD.toLocaleString()}</p>
        `;

        document.querySelectorAll('.pagar-moneda').forEach(b => {
          b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
          if (b.dataset.pagar === 'CRC')
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
        });

        const cuentasDiv = document.querySelector('#cuentas-pago');
        cuentasDiv.innerHTML = cuentas.map(c => `
          <button data-id="${c.id}" data-moneda="${c.moneda}" data-balance="${c.balance}"
            class="cuenta-pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
            ${c.nombre} (${c.moneda === 'CRC' ? '₡' : '$'}${c.balance.toLocaleString()})
          </button>
        `).join('');

        document.querySelectorAll('.cuenta-pago-btn').forEach(b => {
          b.addEventListener('click', () => {
            document.querySelectorAll('.cuenta-pago-btn').forEach(x =>
              x.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
            b.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
            cuentaPagoSeleccionada = {
              id: b.dataset.id,
              moneda: b.dataset.moneda,
              balance: parseFloat(b.dataset.balance)
            };
            document.querySelector('#error-cuenta-pago').classList.add('hidden');
            actualizarInfoConversion();
          });
        });

        document.querySelector('#info-conversion').classList.add('hidden');
        document.querySelector('#modal-pago').classList.remove('hidden');
      });
    });
  });
}