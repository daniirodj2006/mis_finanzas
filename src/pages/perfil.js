import { auth } from '../firebase.js';
import { signOut } from 'firebase/auth';

export function renderPerfil() {
  const user = auth.currentUser;

  document.querySelector('#main-content').innerHTML = `
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Perfil</h1>

      <!-- Info usuario -->
      <div class="bg-white rounded-2xl p-6 shadow-sm mb-4 flex items-center gap-4">
        <img src="${user?.photoURL}" class="w-16 h-16 rounded-full" />
        <div>
          <p class="text-gray-800 font-semibold">${user?.displayName}</p>
          <p class="text-gray-400 text-sm">${user?.email}</p>
        </div>
      </div>

      <!-- Opciones -->
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

      <!-- Cerrar sesión -->
      <button id="btn-logout"
        class="w-full bg-red-50 text-red-400 rounded-2xl py-4 text-sm font-medium hover:bg-red-100 transition">
        Cerrar sesión
      </button>

    </div>
  `;

  document.querySelector('#btn-logout').addEventListener('click', async () => {
    if (confirm('¿Cerrar sesión?')) {
      await signOut(auth);
    }
  });
}