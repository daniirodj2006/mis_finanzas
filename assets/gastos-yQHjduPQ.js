import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,s as l,t as u,u as d}from"./firebase-DQl45onh.js";import{n as f,t as p}from"./tipoCambio-D1Uft6On.js";var m=[{id:`comida`,label:`Comida`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`},{id:`transporte`,label:`Transporte`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`},{id:`salud`,label:`Salud`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`},{id:`entretenimiento`,label:`Ocio`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`},{id:`ropa`,label:`Ropa`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`},{id:`servicios`,label:`Servicios`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`},{id:`otros`,label:`Otros`,icon:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`}],h=[{id:`unica`,label:`Única vez`},{id:`semanal`,label:`Semanal`},{id:`quincenal`,label:`Quincenal`},{id:`mensual`,label:`Mensual`},{id:`anual`,label:`Anual`}],g=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,_=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,v=`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,y=``,b=null,x=null,S=`unica`,C=null,w=`CRC`;async function T(){let[T,E]=await Promise.all([s(a(r(o,`tarjetas`),n(`uid`,`==`,u.currentUser.uid))),s(a(r(o,`cuentas`),n(`uid`,`==`,u.currentUser.uid)))]),D=T.docs.map(e=>({id:e.id,...e.data()})),O=E.docs.map(e=>({id:e.id,...e.data()}));document.querySelector(`#main-content`).innerHTML=`
    <div class="max-w-md mx-auto">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Gastos</h1>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4" id="formulario-gasto">
        <input id="gasto-desc" type="text" placeholder="Descripción"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>
        <input id="gasto-monto" type="number" placeholder="Monto"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-indigo-400"/>

        <p class="text-gray-400 text-xs mb-2">Moneda</p>
        <div class="flex gap-2 mb-3">
          <button data-moneda="CRC" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-indigo-400 text-indigo-600 bg-indigo-50 text-sm transition">₡ Colones</button>
          <button data-moneda="USD" class="moneda-btn flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-indigo-400 transition">$ Dólares</button>
        </div>

        <p class="text-gray-400 text-xs mb-2">Categoría</p>
        <div class="flex flex-wrap gap-2 mb-3">
          ${m.map(e=>`
            <button data-cat="${e.id}"
              class="cat-btn flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
              ${e.icon} ${e.label}
            </button>
          `).join(``)}
        </div>

        <p class="text-gray-400 text-xs mb-2">¿Con qué pagás? <span class="text-red-400">*</span></p>
        ${D.length>0?`
          <p class="text-gray-300 text-xs mb-1">Tarjetas</p>
          <div class="flex flex-wrap gap-2 mb-2">
            ${D.map(e=>`
              <button data-id="${e.id}" data-tipo="tarjeta" data-nombre="${e.nombre}" data-saldocrc="${e.saldoCRC||0}" data-saldousd="${e.saldoUSD||0}"
                class="pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 transition">
                ${e.nombre}
              </button>
            `).join(``)}
          </div>
        `:``}
        ${O.length>0?`
          <p class="text-gray-300 text-xs mb-1">Cuentas</p>
          <div class="flex flex-wrap gap-2 mb-3">
            ${O.map(e=>`
              <button data-id="${e.id}" data-tipo="cuenta" data-nombre="${e.nombre}" data-moneda="${e.moneda}" data-balance="${e.balance}"
                class="pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
                ${e.nombre}
              </button>
            `).join(``)}
          </div>
        `:``}
        <p id="error-pago" class="hidden text-red-400 text-xs mb-2">Seleccioná una tarjeta o cuenta</p>

        <p class="text-gray-400 text-xs mb-2">Frecuencia</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${h.map(e=>`
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
          <button id="btn-agregar-gasto" class="w-full bg-red-400 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-500 transition">
            Agregar gasto
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-gray-700 font-medium mb-3">Mis gastos</p>
        <div id="lista-gastos">
          <p class="text-gray-400 text-sm text-center py-4">No hay gastos aún</p>
        </div>
      </div>

    </div>
  `,document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.moneda-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),w=e.dataset.moneda})}),document.querySelectorAll(`.cat-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.cat-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),y=e.dataset.cat})}),document.querySelectorAll(`.pago-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.pago-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`,`border-purple-400`,`text-purple-600`,`bg-purple-50`));let t=e.dataset.tipo===`tarjeta`;e.classList.add(t?`border-purple-400`:`border-indigo-400`,t?`text-purple-600`:`text-indigo-600`,t?`bg-purple-50`:`bg-indigo-50`),b=e.dataset.id,x=e.dataset.tipo,document.querySelector(`#error-pago`).classList.add(`hidden`)})}),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.freq-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),S=e.dataset.freq})}),document.querySelector(`#btn-cancelar`).addEventListener(`click`,()=>{C=null,y=``,b=null,x=null,S=`unica`,document.querySelector(`#gasto-desc`).value=``,document.querySelector(`#gasto-monto`).value=``,document.querySelector(`#btn-agregar-gasto`).textContent=`Agregar gasto`,document.querySelector(`#btn-cancelar`).classList.add(`hidden`),document.querySelectorAll(`.cat-btn, .pago-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`,`border-purple-400`,`text-purple-600`,`bg-purple-50`)),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===`unica`&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)})}),document.querySelector(`#btn-agregar-gasto`).addEventListener(`click`,async()=>{let e=document.querySelector(`#gasto-desc`).value.trim(),t=parseFloat(document.querySelector(`#gasto-monto`).value);if(!e||isNaN(t)||t<=0)return;if(!b){document.querySelector(`#error-pago`).classList.remove(`hidden`);return}let n={uid:u.currentUser.uid,tipo:`gasto`,descripcion:e,monto:t,moneda:w,categoria:y||`otros`,pagoId:b,tipoPago:x,frecuencia:S,fecha:new Date};if(C)await d(c(o,`transacciones`,C),n),C=null,document.querySelector(`#btn-agregar-gasto`).textContent=`Agregar gasto`,document.querySelector(`#btn-cancelar`).classList.add(`hidden`);else if(await i(r(o,`transacciones`),n),x===`tarjeta`){let e=D.find(e=>e.id===b);if(e){let n=w===`CRC`?{saldoCRC:(e.saldoCRC||0)+t}:{saldoUSD:(e.saldoUSD||0)+t};await d(c(o,`tarjetas`,b),n)}}else if(x===`cuenta`){let e=O.find(e=>e.id===b);if(e){let n=await f(),r=p(t,w,e.moneda,n);await d(c(o,`cuentas`,b),{balance:(e.balance||0)-r})}}document.querySelector(`#gasto-desc`).value=``,document.querySelector(`#gasto-monto`).value=``,y=``,b=null,x=null,S=`unica`,C=null,document.querySelector(`#btn-agregar-gasto`).textContent=`Agregar gasto`,document.querySelector(`#btn-cancelar`).classList.add(`hidden`),document.querySelectorAll(`.cat-btn, .pago-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`,`border-purple-400`,`text-purple-600`,`bg-purple-50`)),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===`unica`&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)})}),l(a(r(o,`transacciones`),n(`uid`,`==`,u.currentUser.uid),n(`tipo`,`==`,`gasto`),t(`fecha`,`desc`)),t=>{let n=document.querySelector(`#lista-gastos`);if(!n)return;if(t.empty){n.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay gastos aún</p>`;return}let r=e=>m.find(t=>t.id===e)?.label||`Otros`,i=e=>m.find(t=>t.id===e)?.icon||``,a=(e,t)=>t===`tarjeta`?D.find(t=>t.id===e)?.nombre||``:t===`cuenta`&&O.find(t=>t.id===e)?.nombre||``,s=e=>h.find(t=>t.id===e)?.label||``;n.innerHTML=t.docs.map(e=>{let t=e.data(),n=t.moneda===`USD`?`$`:`₡`,o=t.tipoPago===`tarjeta`?`text-purple-500`:`text-indigo-500`,c=t.frecuencia&&t.frecuencia!==`unica`;return`
        <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-gray-700 text-sm">${t.descripcion}</p>
              ${c?`<span class="text-red-400">${v}</span>`:``}
            </div>
            <div class="flex gap-2 mt-0.5 flex-wrap">
              <p class="text-gray-400 text-xs flex items-center gap-1">${i(t.categoria)} ${r(t.categoria)}</p>
              ${t.pagoId?`<span class="text-xs ${o}">· ${a(t.pagoId,t.tipoPago)}</span>`:``}
              ${c?`<span class="text-xs text-red-400">· ${s(t.frecuencia)}</span>`:``}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-red-400 font-semibold text-sm">${n}${t.monto.toLocaleString()}</p>
            <button data-id="${e.id}" data-desc="${t.descripcion}" data-monto="${t.monto}" data-cat="${t.categoria||``}" data-pagoid="${t.pagoId||``}" data-tipopago="${t.tipoPago||``}" data-freq="${t.frecuencia||`unica`}"
              class="btn-editar text-gray-400 hover:text-indigo-500 transition">${g}</button>
            <button data-id="${e.id}"
              class="btn-borrar text-gray-400 hover:text-red-500 transition">${_}</button>
          </div>
        </div>
      `}).join(``),document.querySelectorAll(`.btn-editar`).forEach(e=>{e.addEventListener(`click`,()=>{C=e.dataset.id,document.querySelector(`#gasto-desc`).value=e.dataset.desc,document.querySelector(`#gasto-monto`).value=e.dataset.monto,y=e.dataset.cat,b=e.dataset.pagoid||null,x=e.dataset.tipopago||null,S=e.dataset.freq||`unica`,document.querySelectorAll(`.cat-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.cat===y&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelectorAll(`.pago-btn`).forEach(e=>{if(e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`,`border-purple-400`,`text-purple-600`,`bg-purple-50`),e.dataset.id===b){let t=e.dataset.tipo===`tarjeta`;e.classList.add(t?`border-purple-400`:`border-indigo-400`,t?`text-purple-600`:`text-indigo-600`,t?`bg-purple-50`:`bg-indigo-50`)}}),document.querySelectorAll(`.freq-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.freq===S&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelector(`#btn-agregar-gasto`).textContent=`Guardar cambios`,document.querySelector(`#btn-cancelar`).classList.remove(`hidden`),document.querySelector(`#formulario-gasto`).scrollIntoView({behavior:`smooth`})})}),document.querySelectorAll(`.btn-borrar`).forEach(t=>{t.addEventListener(`click`,async()=>{confirm(`¿Borrar este gasto?`)&&await e(c(o,`transacciones`,t.dataset.id))})})})}export{T as renderGastos};