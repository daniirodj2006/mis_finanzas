import { db } from '../firebase.js';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Chart } from 'chart.js/auto';
import { getTipoCambio, convertir } from '../utils/tipoCambio.js';

let chartInstance = null;
let periodoSeleccionado = 'mes';
let mesSeleccionado = new Date().getMonth();
let anioSeleccionado = new Date().getFullYear();

export async function renderDashboard(user) {
  const nombre = user.displayName.split(' ')[0];
  const tc = await getTipoCambio();

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-gray-400 text-sm font-light">Bienvenida de vuelta</p>
          <h1 class="text-2xl font-semibold text-gray-800">${nombre} 👋</h1>
        </div>
        <img src="${user.photoURL}" class="w-10 h-10 rounded-full" />
      </div>

      <!-- Filtro período -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button data-periodo="semana" class="periodo-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap hover:border-indigo-400 hover:text-indigo-600 transition">
          Esta semana
        </button>
        <button data-periodo="mes" class="periodo-btn text-xs px-3 py-1.5 rounded-full border border-indigo-400 text-indigo-600 bg-indigo-50 whitespace-nowrap transition">
          Este mes
        </button>
        <button data-periodo="anio" class="periodo-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap hover:border-indigo-400 hover:text-indigo-600 transition">
          Este año
        </button>
        <button data-periodo="personalizado" class="periodo-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap hover:border-indigo-400 hover:text-indigo-600 transition">
          Por mes
        </button>
      </div>

      <!-- Selector mes personalizado -->
      <div id="selector-mes" class="hidden bg-white rounded-2xl p-3 shadow-sm mb-4">
        <div class="flex gap-2 items-center">
          <select id="select-mes" class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
            ${meses.map((m, i) => `<option value="${i}" ${i === mesSeleccionado ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
          <select id="select-anio" class="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
            ${[2023,2024,2025,2026].map(a => `<option value="${a}" ${a === anioSeleccionado ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Toggle moneda -->
      <div class="flex gap-2 mb-4">
        <button data-moneda="CRC" class="moneda-dash-btn flex-1 py-2 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm font-medium transition">
          ₡ Colones
        </button>
        <button data-moneda="USD" class="moneda-dash-btn flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-indigo-400 transition">
          $ Dólares
        </button>
        <button data-moneda="AMBAS" class="moneda-dash-btn flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:border-indigo-400 transition">
          Ambas
        </button>
      </div>

      <!-- Balance principal -->
      <div class="bg-indigo-600 rounded-2xl p-6 mb-4 text-white">
        <p class="text-indigo-200 text-sm font-light mb-1">Balance total</p>
        <div id="balance-total-display"></div>
        <p id="periodo-label" class="text-indigo-200 text-xs mt-2"></p>
      </div>

      <!-- Cards ingresos y gastos -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-gray-400 text-xs mb-1">Ingresos</p>
          <div id="total-ingresos-display"></div>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-gray-400 text-xs mb-1">Gastos</p>
          <div id="total-gastos-display"></div>
        </div>
      </div>

      <!-- Shortcuts -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <button id="btn-add-ingreso" class="bg-green-50 text-green-600 rounded-2xl p-4 text-sm font-medium hover:bg-green-100 transition">
          + Agregar ingreso
        </button>
        <button id="btn-add-gasto" class="bg-red-50 text-red-400 rounded-2xl p-4 text-sm font-medium hover:bg-red-100 transition">
          + Agregar gasto
        </button>
      </div>

      <!-- Gráfico -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p class="text-gray-700 font-medium mb-3">Gastos por categoría</p>
        <div id="sin-gastos-grafico" class="hidden">
          <p class="text-gray-400 text-sm text-center py-4">No hay gastos en este período</p>
        </div>
        <canvas id="grafico-categorias" class="max-h-52"></canvas>
      </div>

      <!-- Últimas transacciones -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <p class="text-gray-700 font-medium mb-3">Últimas transacciones</p>
        <div id="ultimas-transacciones">
          <p class="text-gray-400 text-sm text-center py-4">No hay transacciones aún</p>
        </div>
      </div>

    </div>
  `;

  let monedaDash = 'CRC';

  // Shortcuts
  document.querySelector('#btn-add-ingreso').addEventListener('click', () => {
    import('./ingresos.js').then(m => m.renderIngresos());
    import('../components/navbar.js').then(m => m.renderNavbar('ingresos'));
  });
  document.querySelector('#btn-add-gasto').addEventListener('click', () => {
    import('./gastos.js').then(m => m.renderGastos());
    import('../components/navbar.js').then(m => m.renderNavbar('gastos'));
  });

  // Toggle moneda
  document.querySelectorAll('.moneda-dash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.moneda-dash-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      monedaDash = btn.dataset.moneda;
      actualizarUI();
    });
  });

  // Período
  document.querySelectorAll('.periodo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.periodo-btn').forEach(b =>
        b.classList.remove('border-indigo-400', 'text-indigo-600', 'bg-indigo-50'));
      btn.classList.add('border-indigo-400', 'text-indigo-600', 'bg-indigo-50');
      periodoSeleccionado = btn.dataset.periodo;
      document.querySelector('#selector-mes').classList.toggle('hidden', periodoSeleccionado !== 'personalizado');
      actualizarUI();
    });
  });

  document.querySelector('#select-mes').addEventListener('change', (e) => {
    mesSeleccionado = parseInt(e.target.value);
    actualizarUI();
  });
  document.querySelector('#select-anio').addEventListener('change', (e) => {
    anioSeleccionado = parseInt(e.target.value);
    actualizarUI();
  });

  let todasTransacciones = [];

  function filtrarPorPeriodo(transacciones) {
    const ahora = new Date();
    return transacciones.filter(d => {
      const fecha = d.fecha?.toDate?.() || new Date();
      if (periodoSeleccionado === 'semana') {
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(ahora.getDate() - ahora.getDay());
        return fecha >= inicioSemana;
      }
      if (periodoSeleccionado === 'mes') {
        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
      }
      if (periodoSeleccionado === 'anio') {
        return fecha.getFullYear() === ahora.getFullYear();
      }
      if (periodoSeleccionado === 'personalizado') {
        return fecha.getMonth() === mesSeleccionado && fecha.getFullYear() === anioSeleccionado;
      }
      return true;
    });
  }

  function getPeriodoLabel() {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const ahora = new Date();
    if (periodoSeleccionado === 'semana') return 'Esta semana';
    if (periodoSeleccionado === 'mes') return `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;
    if (periodoSeleccionado === 'anio') return `Año ${ahora.getFullYear()}`;
    if (periodoSeleccionado === 'personalizado') return `${meses[mesSeleccionado]} ${anioSeleccionado}`;
    return '';
  }

  function actualizarUI() {
    const filtradas = filtrarPorPeriodo(todasTransacciones);

    let ingresosCRC = 0, ingresosUSD = 0;
    let gastosCRC = 0, gastosUSD = 0;
    const categoriasTotales = {};
    const ultimas = [];

    filtradas.forEach(d => {
      if (d.tipo === 'ingreso') {
        if (d.moneda === 'USD') ingresosUSD += d.monto;
        else ingresosCRC += d.monto;
      }
      if (d.tipo === 'gasto') {
        if (d.moneda === 'USD') gastosUSD += d.monto;
        else gastosCRC += d.monto;
        const cat = d.categoria || 'otros';
        const montoEnCRC = convertir(d.monto, d.moneda || 'CRC', 'CRC', tc);
        categoriasTotales[cat] = (categoriasTotales[cat] || 0) + montoEnCRC;
      }
      ultimas.push({ ...d, fechaDate: d.fecha?.toDate?.() || new Date() });
    });

    const balanceEl = document.querySelector('#balance-total-display');
    const ingresosEl = document.querySelector('#total-ingresos-display');
    const gastosEl = document.querySelector('#total-gastos-display');
    const periodoEl = document.querySelector('#periodo-label');

    if (periodoEl) periodoEl.textContent = getPeriodoLabel();

    if (monedaDash === 'AMBAS') {
      const balCRC = ingresosCRC - gastosCRC;
      const balUSD = ingresosUSD - gastosUSD;
      if (balanceEl) balanceEl.innerHTML = `
        <p class="text-3xl font-semibold">₡${balCRC.toLocaleString()}</p>
        <p class="text-xl font-medium text-indigo-200 mt-1">$${balUSD.toLocaleString()}</p>
      `;
      if (ingresosEl) ingresosEl.innerHTML = `
        <p class="text-green-500 text-base font-semibold">₡${ingresosCRC.toLocaleString()}</p>
        <p class="text-green-400 text-xs">$${ingresosUSD.toLocaleString()}</p>
      `;
      if (gastosEl) gastosEl.innerHTML = `
        <p class="text-red-400 text-base font-semibold">₡${gastosCRC.toLocaleString()}</p>
        <p class="text-red-300 text-xs">$${gastosUSD.toLocaleString()}</p>
      `;
    } else {
      const moneda = monedaDash;
      const simbolo = moneda === 'USD' ? '$' : '₡';
      const ingresos = moneda === 'USD'
        ? ingresosUSD + convertir(ingresosCRC, 'CRC', 'USD', tc)
        : ingresosCRC + convertir(ingresosUSD, 'USD', 'CRC', tc);
      const gastos = moneda === 'USD'
        ? gastosUSD + convertir(gastosCRC, 'CRC', 'USD', tc)
        : gastosCRC + convertir(gastosUSD, 'USD', 'CRC', tc);
      const balance = ingresos - gastos;

      if (balanceEl) balanceEl.innerHTML = `<p class="text-4xl font-semibold">${simbolo}${balance.toLocaleString()}</p>`;
      if (ingresosEl) ingresosEl.innerHTML = `<p class="text-green-500 text-xl font-semibold">${simbolo}${ingresos.toLocaleString()}</p>`;
      if (gastosEl) gastosEl.innerHTML = `<p class="text-red-400 text-xl font-semibold">${simbolo}${gastos.toLocaleString()}</p>`;
    }

    // Gráfico
    const catNombres = {
      comida: 'Comida', transporte: 'Transporte', salud: 'Salud',
      entretenimiento: 'Ocio', ropa: 'Ropa', servicios: 'Servicios', otros: 'Otros'
    };
    const colores = ['#6366f1','#f472b6','#34d399','#fb923c','#60a5fa','#a78bfa','#94a3b8'];
    const labels = Object.keys(categoriasTotales).map(k => catNombres[k] || k);
    const valores = Object.values(categoriasTotales);
    const canvas = document.querySelector('#grafico-categorias');
    const sinGastos = document.querySelector('#sin-gastos-grafico');

    if (canvas) {
      if (valores.length === 0) {
        canvas.classList.add('hidden');
        sinGastos?.classList.remove('hidden');
      } else {
        canvas.classList.remove('hidden');
        sinGastos?.classList.add('hidden');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{ data: valores, backgroundColor: colores.slice(0, valores.length), borderWidth: 0 }]
          },
          options: {
            plugins: {
              legend: { position: 'bottom', labels: { font: { family: 'Montserrat', size: 11 }, padding: 12 } }
            },
            cutout: '65%',
          }
        });
      }
    }

    // Últimas transacciones
    const ultimasEl = document.querySelector('#ultimas-transacciones');
    if (ultimasEl) {
      const recientes = ultimas.sort((a, b) => b.fechaDate - a.fechaDate).slice(0, 5);
      if (recientes.length === 0) {
        ultimasEl.innerHTML = `<p class="text-gray-400 text-sm text-center py-4">No hay transacciones en este período</p>`;
      } else {
        ultimasEl.innerHTML = recientes.map(d => {
          const simbolo = d.moneda === 'USD' ? '$' : '₡';
          return `
            <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <div>
                <p class="text-gray-700 text-sm">${d.descripcion}</p>
                <p class="text-gray-400 text-xs">${d.fechaDate.toLocaleDateString('es-CR')}</p>
              </div>
              <p class="${d.tipo === 'ingreso' ? 'text-green-500' : 'text-red-400'} font-semibold text-sm">
                ${d.tipo === 'ingreso' ? '+' : '-'}${simbolo}${d.monto.toLocaleString()}
              </p>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Escuchar transacciones
  const q = query(
    collection(db, 'transacciones'),
    where('uid', '==', user.uid)
  );

  onSnapshot(q, (snapshot) => {
    todasTransacciones = snapshot.docs.map(d => d.data());
    actualizarUI();
  });
}