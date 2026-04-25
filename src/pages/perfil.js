import { auth } from '../firebase.js';
import { signOut } from 'firebase/auth';
import { temas, aplicarTema, cargarTema } from '../utils/temas.js';

export function renderPerfil() {
  const user = auth.currentUser;
  const { temaId, darkMode } = cargarTema();

  let temaActual = temaId;
  let darkActual = darkMode;

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Perfil</h1>

      <div class="bg-white rounded-2xl p-6 shadow-sm mb-4 flex items-center gap-4">
        <img src="${user?.photoURL}" class="w-16 h-16 rounded-full" />
        <div>
          <p class="text-gray-800 font-semibold">${user?.displayName}</p>
          <p class="text-gray-400 text-sm">${user?.email}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p class="text-gray-700 font-medium mb-3">Color de la app</p>
        <div class="flex gap-3 mb-5 flex-wrap">
          ${Object.entries(temas).map(([id, t]) => `
            <button data-tema="${id}"
              class="tema-btn w-9 h-9 rounded-full transition-all duration-200 ${temaId === id ? 'ring-2 ring-offset-2 ring-gray-700' : ''}"
              style="background-color: ${t.primary}">
            </button>
          `).join('')}
        </div>

        <div class="flex items-center justify-between py-1">
          <p class="text-gray-700 text-sm">Modo oscuro</p>
          <div id="toggle-wrap" style="
            width: 48px; height: 28px; border-radius: 999px; cursor: pointer;
            background-color: ${darkMode ? temas[temaId]?.primary || '#6366f1' : '#e5e7eb'};
            position: relative; transition: background-color 0.3s;">
            <div id="toggle-circle" style="
              position: absolute; top: 4px;
              left: ${darkMode ? '24px' : '4px'};
              width: 20px; height: 20px; border-radius: 50%;
              background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              transition: left 0.3s;">
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-50">
          <p class="text-gray-700 text-sm">Nombre</p>
          <p class="text-gray-400 text-sm">${user?.displayName}</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-50">
          <p class="text-gray-700 text-sm">Correo</p>
          <p class="text-gray-400 text-sm">${user?.email}</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4">
          <p class="text-gray-700 text-sm">Cuenta</p>
          <p class="text-gray-400 text-sm">Google</p>
        </div>
      </div>

      <button id="btn-logout"
        class="w-full bg-red-50 text-red-400 rounded-2xl py-4 text-sm font-medium hover:bg-red-100 transition">
        Cerrar sesión
      </button>

    </div>
  `;

  // Cambiar tema
  document.querySelectorAll('.tema-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      temaActual = btn.dataset.tema;
      aplicarTema(temaActual, darkActual);

      document.querySelectorAll('.tema-btn').forEach(b => {
        b.style.outline = 'none';
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-700');
      });
      btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-700');

      // Actualizar color toggle si dark está activo
      if (darkActual) {
        document.querySelector('#toggle-wrap').style.backgroundColor = temas[temaActual]?.primary || '#6366f1';
      }
    });
  });

  // Toggle dark
  document.querySelector('#toggle-wrap').addEventListener('click', () => {
    darkActual = !darkActual;
    aplicarTema(temaActual, darkActual);

    const wrap = document.querySelector('#toggle-wrap');
    const circle = document.querySelector('#toggle-circle');

    wrap.style.backgroundColor = darkActual ? (temas[temaActual]?.primary || '#6366f1') : '#e5e7eb';
    circle.style.left = darkActual ? '24px' : '4px';
  });

  // Cerrar sesión
  document.querySelector('#btn-logout').addEventListener('click', async () => {
    if (confirm('¿Cerrar sesión?')) {
      await signOut(auth);
    }
  });
}