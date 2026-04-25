import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,s as l,t as u,u as d}from"./firebase-DQl45onh.js";var f=[{id:`salario`,label:`Salario`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20l-6-4z"/></svg>`},{id:`freelance`,label:`Freelance`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`},{id:`negocio`,label:`Negocio`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`},{id:`inversion`,label:`Inversión`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>`},{id:`regalo`,label:`Regalo`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`},{id:`otros`,label:`Otros`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`}],p=[{id:`unica`,label:`Única vez`},{id:`semanal`,label:`Semanal`},{id:`quincenal`,label:`Quincenal`},{id:`mensual`,label:`Mensual`},{id:`anual`,label:`Anual`}],m=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,h=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,g=`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,_=``,v=null,y=`unica`,b=null,x=`CRC`;async function S(){let S=(await s(a(r(o,`cuentas`),n(`uid`,`==`,u.currentUser.uid)))).docs.map(e=>({id:e.id,...e.data()}));document.querySelector(`#main-content`).innerHTML=`
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Ingresos</h1>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4" id="formulario-ingreso">
        <input id="ingreso-desc" type="text" placeholder="Descripción"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
        <input id="ingreso-monto" type="number" placeholder="Monto"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">
            ₡ Colones
          </button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">
            $ Dólares
          </button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Categoría</p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${f.map(e=>`
            <button data-cat="${e.id}"
              class="cat-btn flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
              ${e.icon} ${e.label}
            </button>
          `).join(``)}
        </div>

        <p class="text-gray-400 text-xs mb-2">¿A qué cuenta entra? <span class="text-red-400">*</span></p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${S.map(e=>`
            <button data-id="${e.id}" data-nombre="${e.nombre}"
              class="cuenta-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
              ${e.nombre}
            </button>
          `).join(``)}
        </div>
        <p id="error-cuenta" class="hidden text-red-400 text-xs mb-2">Seleccioná una cuenta</p>

        <p class="text-gray-400 text-xs mb-2">Frecuencia</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${p.map(e=>`
            <button data-freq="${e.id}"
              class="freq-btn text-xs px-3 py-1.5 rounded-full border ${e.id===`unica`?`border-indigo-400 text-indigo-600 bg-indigo-50`:`border-gray-200 text-gray-500`} hover:border-indigo-400 hover:text-indigo-600 transition">
              ${e.label}
            </button>
          `).join(``)}
        </div>

        <div class="flex gap-2">
          <button id="btn-cancelar" class="hidden w-full border border-gray-200 text-gray-500 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button id="btn-agregar-ingreso" class="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition">
            Agregar ingreso
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-gray-700 font-medium mb-3">Mis ingresos</p>
        <div id="lista-ingresos">
          <p class="text-gray-400 text-sm text-center py-4">No hay ingresos aún</p>
        </div>
      </div>

    </div>
  `,document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.moneda-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),x=e.dataset.moneda})}),document.querySelectorAll(`.cat-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.cat-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),_=e.dataset.cat})}),document.querySelectorAll(`.cuenta-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.cuenta-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),v=e.dataset.id,document.querySelector(`#error-cuenta`).classList.add(`hidden`)})}),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.freq-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),y=e.dataset.freq})}),document.querySelector(`#btn-cancelar`).addEventListener(`click`,()=>{b=null,_=``,v=null,y=`unica`,document.querySelector(`#ingreso-desc`).value=``,document.querySelector(`#ingreso-monto`).value=``,document.querySelector(`#btn-agregar-ingreso`).textContent=`Agregar ingreso`,document.querySelector(`#btn-cancelar`).classList.add(`hidden`),document.querySelectorAll(`.cat-btn, .cuenta-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===`unica`&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)})}),document.querySelector(`#btn-agregar-ingreso`).addEventListener(`click`,async()=>{let e=document.querySelector(`#ingreso-desc`).value.trim(),t=parseFloat(document.querySelector(`#ingreso-monto`).value);if(!e||isNaN(t)||t<=0)return;if(!v){document.querySelector(`#error-cuenta`).classList.remove(`hidden`);return}let n={uid:u.currentUser.uid,tipo:`ingreso`,descripcion:e,monto:t,moneda:x,categoria:_||`otros`,cuentaId:v,frecuencia:y,fecha:new Date};if(b)await d(c(o,`transacciones`,b),n),b=null,document.querySelector(`#btn-agregar-ingreso`).textContent=`Agregar ingreso`,document.querySelector(`#btn-cancelar`).classList.add(`hidden`);else{await i(r(o,`transacciones`),n);let e=S.find(e=>e.id===v);e&&await d(c(o,`cuentas`,v),{balance:(e.balance||0)+t})}document.querySelector(`#ingreso-desc`).value=``,document.querySelector(`#ingreso-monto`).value=``,_=``,v=null,y=`unica`,document.querySelectorAll(`.cat-btn, .cuenta-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===`unica`&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)})}),l(a(r(o,`transacciones`),n(`uid`,`==`,u.currentUser.uid),n(`tipo`,`==`,`ingreso`),t(`fecha`,`desc`)),t=>{let n=document.querySelector(`#lista-ingresos`);if(!n)return;if(t.empty){n.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay ingresos aún</p>`;return}let r=e=>f.find(t=>t.id===e)?.label||`Otros`,i=e=>S.find(t=>t.id===e)?.nombre||``,a=e=>p.find(t=>t.id===e)?.label||``;n.innerHTML=t.docs.map(e=>{let t=e.data(),n=t.moneda===`USD`?`$`:`₡`,o=t.frecuencia&&t.frecuencia!==`unica`;return`
        <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-gray-700 text-sm">${t.descripcion}</p>
              ${o?`<span class="text-indigo-400">${g}</span>`:``}
            </div>
            <div class="flex gap-2 mt-0.5 flex-wrap">
              <p class="text-gray-400 text-xs">${r(t.categoria)}</p>
              ${t.cuentaId?`<span class="text-xs text-indigo-500">· ${i(t.cuentaId)}</span>`:``}
              ${o?`<span class="text-xs text-indigo-400">· ${a(t.frecuencia)}</span>`:``}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-green-500 font-semibold text-sm">${n}${t.monto.toLocaleString()}</p>
            <button data-id="${e.id}" data-desc="${t.descripcion}" data-monto="${t.monto}" data-cat="${t.categoria||``}" data-cuentaid="${t.cuentaId||``}" data-freq="${t.frecuencia||`unica`}"
              class="btn-editar text-gray-400 hover:text-indigo-500 transition">${m}</button>
            <button data-id="${e.id}"
              class="btn-borrar text-gray-400 hover:text-red-500 transition">${h}</button>
          </div>
        </div>
      `}).join(``),document.querySelectorAll(`.btn-editar`).forEach(e=>{e.addEventListener(`click`,()=>{b=e.dataset.id,document.querySelector(`#ingreso-desc`).value=e.dataset.desc,document.querySelector(`#ingreso-monto`).value=e.dataset.monto,_=e.dataset.cat,v=e.dataset.cuentaid,y=e.dataset.freq||`unica`,document.querySelectorAll(`.cat-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.cat===_&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelectorAll(`.cuenta-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.id===v&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===y&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelector(`#btn-agregar-ingreso`).textContent=`Guardar cambios`,document.querySelector(`#btn-cancelar`).classList.remove(`hidden`),document.querySelector(`#formulario-ingreso`).scrollIntoView({behavior:`smooth`})})}),document.querySelectorAll(`.btn-borrar`).forEach(t=>{t.addEventListener(`click`,async()=>{confirm(`¿Borrar este ingreso?`)&&await e(c(o,`transacciones`,t.dataset.id))})})})}export{S as renderIngresos};