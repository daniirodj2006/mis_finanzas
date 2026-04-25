import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,s as l,t as u,u as d}from"./firebase-DQl45onh.js";var f=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,p=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,m=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,h=[`#1a1a2e`,`#533483`,`#c0392b`,`#e67e22`,`#27ae60`,`#2980b9`,`#7f8c8d`];function g(){let e={blanco:`#63c5c0`,neutro:`#6366f1`,rosa:`#d36998`,celeste:`#0284c7`,amarillo:`#f3ce68`,verde:`#348f72`}[localStorage.getItem(`tema`)||`blanco`]||`#63c5c0`;return[e,...h.filter(t=>t!==e)]}var _=null,v=`CRC`,y=g()[0],b=`Ahorros`;function x(){document.querySelector(`#sheet-overlay`).classList.remove(`hidden`),document.querySelector(`#sheet-cuenta`).classList.remove(`hidden`)}function S(){document.querySelector(`#sheet-overlay`).classList.add(`hidden`),document.querySelector(`#sheet-cuenta`).classList.add(`hidden`),_=null,v=`CRC`,y=g()[0],b=`Ahorros`,document.querySelector(`#cuenta-nombre`).value=``,document.querySelector(`#cuenta-balance`).value=``,document.querySelector(`#sheet-titulo`).textContent=`Nueva cuenta`,document.querySelector(`#btn-guardar-cuenta`).textContent=`Agregar cuenta`,document.querySelectorAll(`.moneda-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),document.querySelector(`[data-moneda="CRC"]`)?.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}function C(){let h=g();document.querySelector(`#main-content`).innerHTML=`
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Cuentas</h1>
          <p class="text-gray-400 text-xs mt-0.5">Tus cuentas bancarias</p>
        </div>
        <button id="btn-nueva-cuenta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <p id="total-consolidado" class="text-gray-500 text-xs mb-4"></p>
      <div id="lista-cuentas" class="mb-4"></div>

      <div id="desglose-cuentas" class="bg-white rounded-2xl p-4 shadow-sm hidden">
        <p class="text-gray-700 font-medium mb-3">Desglose</p>
        <div id="desglose-lista"></div>
      </div>

    </div>

    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <div id="sheet-cuenta" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva cuenta</p>
          <button id="btn-cerrar-sheet" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <input id="cuenta-nombre" type="text" placeholder="Nombre (ej: BAC Colones)"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-3 text-sm outline-none"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">$ Dólares</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Tipo</p>
        <div class="flex gap-2 mb-3">
          <button data-tipo="Ahorros" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">Ahorros</button>
          <button data-tipo="Corriente" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">Corriente</button>
          <button data-tipo="Digital" class="tipo-cuenta-btn flex-1 px-3 py-2 rounded-xl border text-sm transition" style="border-color:#e5e7eb;color:#6b7280">Digital</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Color</p>
        <div class="flex gap-2 mb-4 flex-wrap">
          ${h.map((e,t)=>`
            <button data-color="${e}" class="color-btn w-9 h-9 rounded-full transition-all ${t===0?`ring-2 ring-offset-2 ring-gray-500`:``}" style="background-color: ${e}"></button>
          `).join(``)}
        </div>

        <input id="cuenta-balance" type="number" placeholder="Balance inicial"
          style="background:#fff;color:#1f2937;border-color:#e5e7eb"
          class="w-full border rounded-xl px-4 py-3 mb-4 text-sm outline-none"/>

        <button id="btn-guardar-cuenta" class="w-full bg-indigo-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-indigo-700 transition">
          Agregar cuenta
        </button>
      </div>
    </div>

    <div id="modal-detalle" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <p id="detalle-titulo" class="font-semibold" style="color:#1f2937"></p>
          <button id="btn-cerrar-detalle" style="color:#9ca3af">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-bottom:4px">Balance actual</p>
        <p id="detalle-balance" class="text-2xl font-semibold mb-4" style="color:#1f2937"></p>
        <p class="font-medium mb-3" style="color:#374151">Pagos a tarjetas</p>
        <div id="detalle-lista"></div>
      </div>
    </div>
  `,document.querySelector(`#btn-nueva-cuenta`).addEventListener(`click`,x),document.querySelector(`#btn-cerrar-sheet`).addEventListener(`click`,S),document.querySelector(`#sheet-overlay`).addEventListener(`click`,S),document.querySelector(`#btn-cerrar-detalle`).addEventListener(`click`,()=>document.querySelector(`#modal-detalle`).classList.add(`hidden`)),document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=`#e5e7eb`,e.style.color=`#6b7280`}),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=``,e.style.color=``,v=e.dataset.moneda})}),document.querySelectorAll(`.tipo-cuenta-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.tipo-cuenta-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=`#e5e7eb`,e.style.color=`#6b7280`}),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=``,e.style.color=``,b=e.dataset.tipo})}),document.querySelectorAll(`.color-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.color-btn`).forEach(e=>e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`)),e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`),y=e.dataset.color})}),document.querySelector(`#btn-guardar-cuenta`).addEventListener(`click`,async()=>{let e=document.querySelector(`#cuenta-nombre`).value.trim(),t=parseFloat(document.querySelector(`#cuenta-balance`).value)||0;e&&(_?await d(c(o,`cuentas`,_),{nombre:e,moneda:v,color:y,tipo:b}):await i(r(o,`cuentas`),{uid:u.currentUser.uid,nombre:e,moneda:v,balance:t,color:y,tipo:b,fecha:new Date}),S())});let C=[],w=[];s(a(r(o,`tarjetas`),n(`uid`,`==`,u.currentUser.uid))).then(e=>{w=e.docs.map(e=>({id:e.id,...e.data()}))}),l(a(r(o,`pagosTarjeta`),n(`uid`,`==`,u.currentUser.uid),t(`fecha`,`desc`)),e=>{C=e.docs.map(e=>({id:e.id,...e.data()}))}),l(a(r(o,`cuentas`),n(`uid`,`==`,u.currentUser.uid),t(`fecha`,`desc`)),t=>{let n=document.querySelector(`#lista-cuentas`),r=document.querySelector(`#desglose-cuentas`),i=document.querySelector(`#desglose-lista`),a=document.querySelector(`#total-consolidado`);if(!n)return;if(t.empty){n.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay cuentas aún</p>`,r?.classList.add(`hidden`);return}let s=t.docs.map(e=>({id:e.id,...e.data()})),l=s.filter(e=>e.moneda===`CRC`).reduce((e,t)=>e+(t.balance||0),0),u=s.filter(e=>e.moneda===`USD`).reduce((e,t)=>e+(t.balance||0),0),d=``;l>0&&(d+=`₡${l.toLocaleString()}`),l>0&&u>0&&(d+=` · `),u>0&&(d+=`$${u.toLocaleString()}`),a&&(a.textContent=`Total consolidado: ${d}`),n.innerHTML=s.map(e=>{let t=e.moneda===`USD`?`$`:`₡`,n=e.color||h[0],r=e.tipo||`Cuenta`;return`
        <div class="rounded-2xl p-5 mb-3 relative overflow-hidden cursor-pointer cuenta-card"
          data-id="${e.id}"
          style="background: linear-gradient(135deg, ${n}, ${n}bb)">
          
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: rgba(255,255,255,0.2)">
              ${m}
            </div>
            <div>
              <p class="text-white text-xs" style="opacity:0.75">${r}</p>
              <p class="text-white font-semibold text-sm">${e.nombre}</p>
            </div>
            <div class="ml-auto flex gap-2">
              <button data-id="${e.id}" data-nombre="${e.nombre}" data-moneda="${e.moneda}" data-color="${n}" data-tipo="${r}"
                class="btn-editar" style="color:white;opacity:0.8">${f}</button>
              <button data-id="${e.id}"
                class="btn-borrar" style="color:white;opacity:0.8">${p}</button>
            </div>
          </div>
          <p class="text-white text-2xl font-bold">${t}${(e.balance||0).toLocaleString()}</p>
        </div>
      `}).join(``),r?.classList.remove(`hidden`),i&&(i.innerHTML=s.map(e=>{let t=e.moneda===`USD`?`$`:`₡`;return`
          <div class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${e.color||h[0]}">
                ${m.replace(`width="28" height="28"`,`width="16" height="16"`)}
              </div>
              <div>
                <p class="text-gray-700 text-sm font-medium">${e.nombre}</p>
                <p class="text-gray-400 text-xs">${e.tipo||`Cuenta`}</p>
              </div>
            </div>
            <p class="text-gray-800 font-semibold text-sm">${t}${(e.balance||0).toLocaleString()}</p>
          </div>
        `}).join(``)),document.querySelectorAll(`.cuenta-card`).forEach(e=>{e.addEventListener(`click`,t=>{if(t.target.closest(`.btn-editar`)||t.target.closest(`.btn-borrar`))return;let n=s.find(t=>t.id===e.dataset.id);if(!n)return;let r=n.moneda===`USD`?`$`:`₡`,i=C.filter(e=>e.cuentaId===n.id);document.querySelector(`#detalle-titulo`).textContent=n.nombre,document.querySelector(`#detalle-balance`).textContent=`${r}${(n.balance||0).toLocaleString()}`;let a=document.querySelector(`#detalle-lista`);i.length===0?a.innerHTML=`<p style="color:#9ca3af;font-size:14px;text-align:center;padding:16px">No hay pagos registrados</p>`:a.innerHTML=i.map(e=>{let t=w.find(t=>t.id===e.tarjetaId),n=e.fecha?.toDate?.()||new Date;return`
              <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p class="text-gray-700 text-sm">Pago a ${t?.nombre||`tarjeta`}</p>
                  <p class="text-gray-400 text-xs">${n.toLocaleDateString(`es-CR`)}</p>
                </div>
                <p class="text-red-400 font-semibold text-sm">${r}${e.monto.toLocaleString()}</p>
              </div>
            `}).join(``),document.querySelector(`#modal-detalle`).classList.remove(`hidden`)})}),document.querySelectorAll(`.btn-editar`).forEach(e=>{e.addEventListener(`click`,()=>{_=e.dataset.id,v=e.dataset.moneda,y=e.dataset.color,b=e.dataset.tipo,document.querySelector(`#cuenta-nombre`).value=e.dataset.nombre,document.querySelector(`#sheet-titulo`).textContent=`Editar cuenta`,document.querySelector(`#btn-guardar-cuenta`).textContent=`Guardar cambios`,document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=`#e5e7eb`,e.style.color=`#6b7280`,e.dataset.moneda===v&&(e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=``,e.style.color=``)}),document.querySelectorAll(`.tipo-cuenta-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=`#e5e7eb`,e.style.color=`#6b7280`,e.dataset.tipo===b&&(e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.style.borderColor=``,e.style.color=``)}),document.querySelectorAll(`.color-btn`).forEach(e=>{e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`),e.dataset.color===y&&e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`)}),x()})}),document.querySelectorAll(`.btn-borrar`).forEach(t=>{t.addEventListener(`click`,async()=>{confirm(`¿Borrar esta cuenta?`)&&await e(c(o,`cuentas`,t.dataset.id))})})})}export{C as renderCuentas};