import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

export function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-semibold text-gray-800">Mis Finanzas</h1>
        <p class="text-gray-400 mt-2 font-light">Controlá tu dinero, fácil</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <button id="btn-google" class="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          <span class="font-medium text-gray-700">Continuar con Google</span>
        </button>
      </div>

    </div>
  `;

  document.querySelector('#btn-google').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  });
}