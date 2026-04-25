import{a as e}from"./index.esm-Bswo4R-X.js";import{t}from"./firebase-DQl45onh.js";import{n,r,t as i}from"./index-D1YTa2_7.js";function a(){let a=t.currentUser,{temaId:o,darkMode:s}=n(),c=o,l=s;document.querySelector(`#main-content`).innerHTML=`
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Perfil</h1>

      <div class="bg-white rounded-2xl p-6 shadow-sm mb-4 flex items-center gap-4">
        <img src="${a?.photoURL}" class="w-16 h-16 rounded-full" />
        <div>
          <p class="text-gray-800 font-semibold">${a?.displayName}</p>
          <p class="text-gray-400 text-sm">${a?.email}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p class="text-gray-700 font-medium mb-3">Color de la app</p>
        <div class="flex gap-3 mb-5 flex-wrap">
          ${Object.entries(r).map(([e,t])=>`
            <button data-tema="${e}"
              class="tema-btn w-9 h-9 rounded-full transition-all duration-200 ${o===e?`ring-2 ring-offset-2 ring-gray-700`:``}"
              style="background-color: ${t.primary}">
            </button>
          `).join(``)}
        </div>

        <div class="flex items-center justify-between py-1">
          <p class="text-gray-700 text-sm">Modo oscuro</p>
          <div id="toggle-wrap" style="
            width: 48px; height: 28px; border-radius: 999px; cursor: pointer;
            background-color: ${s?r[o]?.primary||`#6366f1`:`#e5e7eb`};
            position: relative; transition: background-color 0.3s;">
            <div id="toggle-circle" style="
              position: absolute; top: 4px;
              left: ${s?`24px`:`4px`};
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
          <p class="text-gray-400 text-sm">${a?.displayName}</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-50">
          <p class="text-gray-700 text-sm">Correo</p>
          <p class="text-gray-400 text-sm">${a?.email}</p>
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
  `,document.querySelectorAll(`.tema-btn`).forEach(e=>{e.addEventListener(`click`,()=>{c=e.dataset.tema,i(c,l),document.querySelectorAll(`.tema-btn`).forEach(e=>{e.style.outline=`none`,e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-700`)}),e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-700`),l&&(document.querySelector(`#toggle-wrap`).style.backgroundColor=r[c]?.primary||`#6366f1`)})}),document.querySelector(`#toggle-wrap`).addEventListener(`click`,()=>{l=!l,i(c,l);let e=document.querySelector(`#toggle-wrap`),t=document.querySelector(`#toggle-circle`);e.style.backgroundColor=l?r[c]?.primary||`#6366f1`:`#e5e7eb`,t.style.left=l?`24px`:`4px`}),document.querySelector(`#btn-logout`).addEventListener(`click`,async()=>{confirm(`¿Cerrar sesión?`)&&await e(t)})}export{a as renderPerfil};