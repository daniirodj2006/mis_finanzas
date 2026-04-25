import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,s as l,t as u,u as d}from"./firebase-DQl45onh.js";import{n as f,t as p}from"./tipoCambio-D1Uft6On.js";var m=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,h=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,g=`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,_=[`#1a1a2e`,`#16213e`,`#533483`,`#c0392b`,`#e67e22`,`#27ae60`,`#2980b9`];function v(){let e={blanco:`#2d6e6a`,neutro:`#3730a3`,rosa:`#9d3b6a`,celeste:`#0369a1`,amarillo:`#92750a`,verde:`#1a5c42`}[localStorage.getItem(`tema`)||`blanco`]||`#1a1a2e`;return[e,..._.filter(t=>t!==e)]}var y=null,b=`credito`,x=`CRC`,S=v()[0],C=null,w=null,T=`CRC`;function E(){document.querySelector(`#sheet-overlay`).classList.remove(`hidden`),document.querySelector(`#sheet-tarjeta`).classList.remove(`hidden`)}function D(){document.querySelector(`#sheet-overlay`).classList.add(`hidden`),document.querySelector(`#sheet-tarjeta`).classList.add(`hidden`),y=null,b=`credito`,x=`CRC`,S=v()[0],document.querySelector(`#tarjeta-nombre`).value=``,document.querySelector(`#tarjeta-limite`).value=``,document.querySelector(`#tarjeta-corte`).value=``,document.querySelector(`#tarjeta-pago-dia`).value=``,document.querySelector(`#sheet-titulo`).textContent=`Nueva tarjeta`,document.querySelector(`#btn-guardar-tarjeta`).textContent=`Agregar tarjeta`,document.querySelectorAll(`.tipo-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),document.querySelectorAll(`.moneda-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),document.querySelector(`[data-tipo="credito"]`).classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),document.querySelector(`[data-moneda="CRC"]`).classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}async function O(){let _=(await s(a(r(o,`cuentas`),n(`uid`,`==`,u.currentUser.uid)))).docs.map(e=>({id:e.id,...e.data()})),O=v();document.querySelector(`#main-content`).innerHTML=`
    <div class="max-w-md mx-auto">

      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Tarjetas</h1>
          <p class="text-gray-400 text-xs mt-0.5">Tus tarjetas de crédito y débito</p>
        </div>
        <button id="btn-nueva-tarjeta" class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div id="lista-tarjetas"></div>

    </div>

    <div id="sheet-overlay" class="hidden fixed inset-0 bg-black bg-opacity-40 z-40"></div>

    <div id="sheet-tarjeta" class="hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 overflow-y-auto max-h-[90vh]">
        <div class="flex items-center justify-between mb-4">
          <p id="sheet-titulo" class="text-gray-800 font-semibold">Nueva tarjeta</p>
          <button id="btn-cerrar-sheet" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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

        <p class="text-gray-400 text-xs mb-2">Color de tarjeta</p>
        <div class="flex gap-2 mb-3 flex-wrap">
          ${O.map((e,t)=>`
            <button data-color="${e}" class="color-btn w-9 h-9 rounded-full transition-all ${t===0?`ring-2 ring-offset-2 ring-gray-500`:``}" style="background-color: ${e}"></button>
          `).join(``)}
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

    <!-- Modal pagar -->
    <div id="modal-pago" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <p class="text-gray-800 font-semibold">Pagar tarjeta</p>
          <button id="btn-cerrar-pago" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="info-saldo-tarjeta" class="rounded-xl p-3 mb-4 text-sm bg-gray-50"></div>
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

    <!-- Modal resumen -->
    <div id="modal-resumen" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <p id="resumen-titulo" class="text-gray-800 font-semibold"></p>
          <button id="btn-cerrar-resumen" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
  `,document.querySelector(`#btn-nueva-tarjeta`).addEventListener(`click`,E),document.querySelector(`#btn-cerrar-sheet`).addEventListener(`click`,D),document.querySelector(`#sheet-overlay`).addEventListener(`click`,D),document.querySelector(`#btn-cerrar-pago`).addEventListener(`click`,()=>document.querySelector(`#modal-pago`).classList.add(`hidden`)),document.querySelector(`#btn-cerrar-resumen`).addEventListener(`click`,()=>document.querySelector(`#modal-resumen`).classList.add(`hidden`)),document.querySelectorAll(`.tipo-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.tipo-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),b=e.dataset.tipo})}),document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.moneda-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),x=e.dataset.moneda})}),document.querySelectorAll(`.color-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.color-btn`).forEach(e=>e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`)),e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`),S=e.dataset.color})}),document.querySelector(`#btn-guardar-tarjeta`).addEventListener(`click`,async()=>{let e=document.querySelector(`#tarjeta-nombre`).value.trim(),t=parseFloat(document.querySelector(`#tarjeta-limite`).value)||0,n=parseInt(document.querySelector(`#tarjeta-corte`).value)||0,a=parseInt(document.querySelector(`#tarjeta-pago-dia`).value)||0;e&&(y?await d(c(o,`tarjetas`,y),{nombre:e,tipo:b,moneda:x,limite:t,corte:n,pago:a,color:S}):await i(r(o,`tarjetas`),{uid:u.currentUser.uid,nombre:e,tipo:b,moneda:x,limite:t,saldoCRC:0,saldoUSD:0,corte:n,pago:a,color:S,fecha:new Date}),D())}),document.querySelectorAll(`.pagar-moneda`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.pagar-moneda`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),T=e.dataset.pagar,k()})});async function k(){let e=document.querySelector(`#info-conversion`);if(!w||!C)return;let t=T===`CRC`?C.saldoCRC:C.saldoUSD;if(T!==w.moneda){let n=await f(),r=p(t,T,w.moneda,n);e.textContent=`Se descontarán ${w.moneda===`CRC`?`₡`:`$`}${r.toLocaleString()} de tu cuenta`,e.classList.remove(`hidden`)}else e.classList.add(`hidden`)}document.querySelector(`#btn-confirmar-pago`).addEventListener(`click`,async()=>{if(!w){document.querySelector(`#error-cuenta-pago`).classList.remove(`hidden`);return}let e=T===`CRC`?C.saldoCRC:C.saldoUSD,t=await f(),n=p(e,T,w.moneda,t);await d(c(o,`cuentas`,w.id),{balance:w.balance-n});let a=T===`CRC`?{saldoCRC:0}:{saldoUSD:0};await d(c(o,`tarjetas`,C.id),a),await i(r(o,`pagosTarjeta`),{uid:u.currentUser.uid,tarjetaId:C.id,cuentaId:w.id,monto:n,moneda:w.moneda,fecha:new Date}),document.querySelector(`#modal-pago`).classList.add(`hidden`)}),l(a(r(o,`tarjetas`),n(`uid`,`==`,u.currentUser.uid),t(`fecha`,`desc`)),t=>{let i=document.querySelector(`#lista-tarjetas`);if(i){if(t.empty){i.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay tarjetas aún</p>`;return}i.innerHTML=t.docs.map(e=>{let t=e.data(),n=t.saldoCRC||0,r=t.saldoUSD||0,i=t.color||O[0],a=t.tipo===`credito`?`Tarjeta de crédito`:`Tarjeta de débito`,o=t.tipo===`credito`?`CARD`:`MC`,s=t.limite>0?Math.min(Math.round(n/t.limite*100),100):0;return`
        <!-- Card tarjeta -->
        <div class="rounded-2xl p-5 mb-2 relative overflow-hidden"
          style="background: linear-gradient(135deg, ${i}, ${i}99)">
          <div class="flex justify-between items-start mb-5">
            <div>
              <p class="text-white text-xs mb-1" style="opacity:0.7">${a}</p>
              <p class="text-white font-bold text-base">${t.nombre}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <p class="text-white font-bold text-lg">${o}</p>
              <div class="flex gap-2">
                <button data-id="${e.id}" class="btn-ver" style="color:white;opacity:0.8">${g}</button>
                <button data-id="${e.id}" data-nombre="${t.nombre}" data-tipo="${t.tipo}" data-moneda="${t.moneda}" data-limite="${t.limite}" data-corte="${t.corte}" data-pago="${t.pago}" data-color="${i}"
                  class="btn-editar" style="color:white;opacity:0.8">${m}</button>
                <button data-id="${e.id}" class="btn-borrar" style="color:white;opacity:0.8">${h}</button>
              </div>
            </div>
          </div>

          <p class="text-white font-mono text-sm mb-4" style="opacity:0.6">**** **** **** ****</p>

          <div class="flex justify-between items-end">
            <div>
              <p class="text-white text-xs mb-0.5" style="opacity:0.6">Disponible</p>
              <p class="text-white font-bold text-lg">₡${Math.max(0,t.limite-n).toLocaleString()}</p>
            </div>
            ${t.limite>0?`
              <div class="text-right">
                <p class="text-white text-xs mb-0.5" style="opacity:0.6">Límite</p>
                <p class="text-white font-semibold">₡${t.limite.toLocaleString()}</p>
              </div>
            `:``}
          </div>
        </div>

        <!-- Info debajo card -->
        <div class="bg-white rounded-2xl px-4 pt-3 pb-4 mb-4 shadow-sm">
          <div class="flex justify-between text-xs text-gray-500 mb-2">
            <div class="flex gap-2">
              <span>₡ <span class="text-red-400 font-medium">${n.toLocaleString()}</span></span>
              <span>$ <span class="text-red-400 font-medium">${r.toLocaleString()}</span></span>
            </div>
            ${t.limite>0?`<span class="font-semibold" style="color: ${s>80?`#ef4444`:`inherit`}">${s}%</span>`:``}
          </div>

          ${t.limite>0?`
            <div class="w-full bg-gray-100 rounded-full h-1.5 mb-3">
              <div class="h-1.5 rounded-full transition-all" style="width: ${s}%; background-color: ${s>80?`#ef4444`:i}"></div>
            </div>
          `:``}

          ${t.corte||t.pago?`
            <div class="flex gap-3 text-xs text-gray-400 mb-3">
              ${t.corte?`<span>Corte: día ${t.corte}</span>`:``}
              ${t.pago?`<span>Pago: día ${t.pago}</span>`:``}
            </div>
          `:``}

          <button data-id="${e.id}" data-nombre="${t.nombre}" data-saldocrc="${n}" data-saldousd="${r}"
            class="btn-pagar w-full bg-indigo-50 text-indigo-600 rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-100 transition">
            Pagar tarjeta
          </button>
        </div>
      `}).join(``),document.querySelectorAll(`.btn-ver`).forEach(e=>{e.addEventListener(`click`,async()=>{let i=t.docs.find(t=>t.id===e.dataset.id);if(!i)return;let c=i.data();document.querySelector(`#resumen-titulo`).textContent=c.nombre,document.querySelector(`#resumen-saldo-crc`).textContent=`₡${(c.saldoCRC||0).toLocaleString()}`,document.querySelector(`#resumen-saldo-usd`).textContent=`$${(c.saldoUSD||0).toLocaleString()}`;let l=await s(a(r(o,`transacciones`),n(`uid`,`==`,u.currentUser.uid),n(`pagoId`,`==`,e.dataset.id),n(`tipo`,`==`,`gasto`))),d=document.querySelector(`#resumen-lista`);l.empty?d.innerHTML=`<p class="text-gray-400 text-sm text-center py-4">No hay gastos con esta tarjeta</p>`:d.innerHTML=l.docs.map(e=>{let t=e.data(),n=t.moneda===`USD`?`$`:`₡`,r=t.fecha?.toDate?.()||new Date;return`
              <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p class="text-gray-700 text-sm">${t.descripcion}</p>
                  <p class="text-gray-400 text-xs">${r.toLocaleDateString(`es-CR`)}</p>
                </div>
                <p class="text-red-400 font-semibold text-sm">${n}${t.monto.toLocaleString()}</p>
              </div>
            `}).join(``),document.querySelector(`#modal-resumen`).classList.remove(`hidden`)})}),document.querySelectorAll(`.btn-editar`).forEach(e=>{e.addEventListener(`click`,()=>{y=e.dataset.id,b=e.dataset.tipo,x=e.dataset.moneda,S=e.dataset.color,document.querySelector(`#tarjeta-nombre`).value=e.dataset.nombre,document.querySelector(`#tarjeta-limite`).value=e.dataset.limite,document.querySelector(`#tarjeta-corte`).value=e.dataset.corte,document.querySelector(`#tarjeta-pago-dia`).value=e.dataset.pago,document.querySelector(`#sheet-titulo`).textContent=`Editar tarjeta`,document.querySelector(`#btn-guardar-tarjeta`).textContent=`Guardar cambios`,document.querySelectorAll(`.tipo-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.tipo===b&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelectorAll(`.moneda-btn`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.moneda===x&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)}),document.querySelectorAll(`.color-btn`).forEach(e=>{e.classList.remove(`ring-2`,`ring-offset-2`,`ring-gray-500`),e.dataset.color===S&&e.classList.add(`ring-2`,`ring-offset-2`,`ring-gray-500`)}),E()})}),document.querySelectorAll(`.btn-borrar`).forEach(t=>{t.addEventListener(`click`,async()=>{confirm(`¿Borrar esta tarjeta?`)&&await e(c(o,`tarjetas`,t.dataset.id))})}),document.querySelectorAll(`.btn-pagar`).forEach(e=>{e.addEventListener(`click`,()=>{C={id:e.dataset.id,nombre:e.dataset.nombre,saldoCRC:parseFloat(e.dataset.saldocrc),saldoUSD:parseFloat(e.dataset.saldousd)},w=null,T=`CRC`,document.querySelector(`#info-saldo-tarjeta`).innerHTML=`
          <p class="font-medium text-gray-800 mb-1">${C.nombre}</p>
          <p class="text-gray-500 text-xs">Saldo ₡: ${C.saldoCRC.toLocaleString()}</p>
          <p class="text-gray-500 text-xs">Saldo $: ${C.saldoUSD.toLocaleString()}</p>
        `,document.querySelectorAll(`.pagar-moneda`).forEach(e=>{e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),e.dataset.pagar===`CRC`&&e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)});let t=document.querySelector(`#cuentas-pago`);t.innerHTML=_.map(e=>`
          <button data-id="${e.id}" data-moneda="${e.moneda}" data-balance="${e.balance}"
            class="cuenta-pago-btn text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition">
            ${e.nombre} (${e.moneda===`CRC`?`₡`:`$`}${(e.balance||0).toLocaleString()})
          </button>
        `).join(``),document.querySelectorAll(`.cuenta-pago-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.cuenta-pago-btn`).forEach(e=>e.classList.remove(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`)),e.classList.add(`border-indigo-400`,`text-indigo-600`,`bg-indigo-50`),w={id:e.dataset.id,moneda:e.dataset.moneda,balance:parseFloat(e.dataset.balance)},document.querySelector(`#error-cuenta-pago`).classList.add(`hidden`),k()})}),document.querySelector(`#info-conversion`).classList.add(`hidden`),document.querySelector(`#modal-pago`).classList.remove(`hidden`)})})}})}export{O as renderTarjetas};