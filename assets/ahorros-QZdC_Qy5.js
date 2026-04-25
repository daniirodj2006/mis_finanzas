import{a as e,c as t,d as n,f as r,i,l as a,n as o,p as s,s as c,t as l,u}from"./firebase-DQl45onh.js";var d=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,f=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,p=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,m=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,h=[`#1a1a2e`,`#533483`,`#c0392b`,`#e67e22`,`#27ae60`,`#2980b9`,`#7f8c8d`];function g(){let e={blanco:`#63c5c0`,neutro:`#6366f1`,rosa:`#d36998`,celeste:`#0284c7`,amarillo:`#f3ce68`,verde:`#348f72`}[localStorage.getItem(`tema`)||`blanco`]||`#63c5c0`;return[e,...h.filter(t=>t!==e)]}var _=null,v=g()[0],y=null,b=0;function x(){document.querySelector(`#sheet-overlay`).classList.remove(`hidden`),document.querySelector(`#sheet-ahorro`).classList.remove(`hidden`)}function S(){document.querySelector(`#sheet-overlay`).classList.add(`hidden`),document.querySelector(`#sheet-ahorro`).classList.add(`hidden`),_=null,v=g()[0],document.querySelector(`#ahorro-nombre`).value=``,document.querySelector(`#ahorro-meta`).value=``,document.querySelector(`#sheet-titulo`).textContent=`Nueva meta`,document.querySelector(`#btn-guardar-ahorro`).textContent=`Crear meta`,document.querySelectorAll(`.color-btn`).forEach(e=>e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`)),document.querySelector(`.color-btn`)?.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`)}function C(){let h=g();document.querySelector(`#main-content`).innerHTML=`
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
          ${h.map((e,t)=>`
            <button data-color="${e}" class="color-btn w-9 h-9 rounded-full transition-all ${t===0?`ring-2 ring-offset-2 ring-gray-500`:``}" style="background-color: ${e}"></button>
          `).join(``)}
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
  `,document.querySelector(`#btn-nueva-meta`).addEventListener(`click`,x),document.querySelector(`#btn-cerrar-sheet`).addEventListener(`click`,S),document.querySelector(`#sheet-overlay`).addEventListener(`click`,S),document.querySelector(`#btn-cerrar-abono`).addEventListener(`click`,()=>{document.querySelector(`#modal-abonar`).classList.add(`hidden`),document.querySelector(`#abono-monto`).value=``,y=null}),document.querySelector(`#btn-confirmar-abono`).addEventListener(`click`,async()=>{let e=parseFloat(document.querySelector(`#abono-monto`).value);isNaN(e)||e<=0||!y||(await u(s(o,`ahorros`,y),{ahorrado:b+e}),document.querySelector(`#modal-abonar`).classList.add(`hidden`),document.querySelector(`#abono-monto`).value=``,y=null)}),document.querySelectorAll(`.color-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.color-btn`).forEach(e=>e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`)),e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`),v=e.dataset.color})}),document.querySelector(`#btn-guardar-ahorro`).addEventListener(`click`,async()=>{let e=document.querySelector(`#ahorro-nombre`).value.trim(),t=parseFloat(document.querySelector(`#ahorro-meta`).value);!e||isNaN(t)||t<=0||(_?await u(s(o,`ahorros`,_),{nombre:e,meta:t,color:v}):await i(r(o,`ahorros`),{uid:l.currentUser.uid,nombre:e,meta:t,ahorrado:0,color:v,fecha:new Date}),S())}),c(a(r(o,`ahorros`),n(`uid`,`==`,l.currentUser.uid),t(`fecha`,`desc`)),t=>{let n=document.querySelector(`#lista-ahorros`),r=document.querySelector(`#total-ahorros`);if(!n)return;if(t.empty){n.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay metas aún</p>`;return}let i=t.docs.map(e=>({id:e.id,...e.data()})),a=i.reduce((e,t)=>e+(t.ahorrado||0),0);r&&(r.textContent=`Total ahorrado: ₡${a.toLocaleString()}`),n.innerHTML=i.map(e=>{let t=Math.min(Math.round(e.ahorrado/e.meta*100),100),n=t>=100,r=e.color||h[0],i=Math.max(0,e.meta-e.ahorrado);return`
        <!-- Card meta con gradiente -->
        <div class="rounded-2xl p-5 mb-2 relative overflow-hidden"
          style="background: linear-gradient(135deg, ${r}, ${r}99)">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: rgba(255,255,255,0.2)">
                ${m}
              </div>
              <div>
                <p class="text-white font-semibold text-base">${e.nombre}</p>
                <p class="text-white text-xs" style="opacity:0.7">Faltan ₡${i.toLocaleString()}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <p class="text-white font-bold text-lg">${t}%</p>
              <div class="flex gap-2">
                <button data-id="${e.id}" data-nombre="${e.nombre}" data-meta="${e.meta}" data-color="${r}"
                  class="btn-editar" style="color:white;opacity:0.8">${d}</button>
                <button data-id="${e.id}"
                  class="btn-borrar" style="color:white;opacity:0.8">${f}</button>
              </div>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="w-full rounded-full h-2 mb-2" style="background: rgba(255,255,255,0.3)">
            <div class="h-2 rounded-full transition-all" style="width: ${t}%; background: white"></div>
          </div>

          <div class="flex justify-between text-white text-xs" style="opacity:0.8">
            <span>₡${(e.ahorrado||0).toLocaleString()}</span>
            <span>₡${e.meta.toLocaleString()}</span>
          </div>
        </div>

        <!-- Info debajo -->
        <div class="bg-white rounded-2xl px-4 pt-3 pb-4 mb-4 shadow-sm">
          <button data-id="${e.id}" data-ahorrado="${e.ahorrado}"
            class="btn-abonar w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-100 transition ${n?`opacity-50 pointer-events-none`:``}">
            ${p} ${n?`¡Meta alcanzada! 🎉`:`Agregar abono`}
          </button>
        </div>
      `}).join(``),document.querySelectorAll(`.btn-abonar`).forEach(e=>{e.addEventListener(`click`,()=>{y=e.dataset.id,b=parseFloat(e.dataset.ahorrado),document.querySelector(`#modal-abonar`).classList.remove(`hidden`)})}),document.querySelectorAll(`.btn-editar`).forEach(e=>{e.addEventListener(`click`,()=>{_=e.dataset.id,v=e.dataset.color,document.querySelector(`#ahorro-nombre`).value=e.dataset.nombre,document.querySelector(`#ahorro-meta`).value=e.dataset.meta,document.querySelector(`#sheet-titulo`).textContent=`Editar meta`,document.querySelector(`#btn-guardar-ahorro`).textContent=`Guardar cambios`,document.querySelectorAll(`.color-btn`).forEach(e=>{e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`),e.dataset.color===v&&e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`)}),x()})}),document.querySelectorAll(`.btn-borrar`).forEach(t=>{t.addEventListener(`click`,async()=>{confirm(`¿Borrar esta meta?`)&&await e(s(o,`ahorros`,t.dataset.id))})})})}export{C as renderAhorros};