import{r as e}from"./index.esm-Bswo4R-X.js";import{t}from"./firebase-DQl45onh.js";import{n}from"./login-naX-lpAH.js";import{n as r}from"./dashboard-Bip2c7ZU.js";import{n as i}from"./navbar-CTJvWvQq.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var a={blanco:{nombre:`Blanco`,primary:`#63c5c0`,light:`#ffffff`},neutro:{nombre:`Neutro`,primary:`#6366f1`,light:`#eef2ff`},rosa:{nombre:`Rosa`,primary:`#d36998`,light:`#fdf2f8`},celeste:{nombre:`Celeste`,primary:`#0284c7`,light:`#f0f9ff`},amarillo:{nombre:`Amarillo`,primary:`#f3ce68`,light:`#fffbeb`},verde:{nombre:`Verde`,primary:`#348f72`,light:`#ecfdf5`}};function o(e,t){let n=a[e]||a.blanco;document.getElementById(`tema-style`)?.remove();let r=document.createElement(`style`);r.id=`tema-style`;let i=n.primary,o=n.light,s=`
    .bg-indigo-600 { background-color: ${i} !important; }
    .bg-indigo-700 { background-color: ${i}dd !important; }
    .text-indigo-600 { color: ${i} !important; }
    .text-indigo-500 { color: ${i} !important; }
    .border-indigo-400 { border-color: ${i} !important; }
    .bg-indigo-50 { background-color: ${i}20 !important; }
    .text-indigo-200 { color: ${o} !important; }
    .focus\\:border-indigo-400:focus { border-color: ${i} !important; }
    .hover\\:bg-indigo-700:hover { background-color: ${i}cc !important; }
    .hover\\:bg-indigo-100:hover { background-color: ${i}20 !important; }
    .bg-indigo-100 { background-color: ${i}20 !important; }
    .text-indigo-400 { color: ${i}99 !important; }
  `;if(t)r.textContent=`
      ${s}
      body, #app { background-color: #13111F !important; color: #e2e8f0 !important; }
      .bg-white { background-color: #201D30 !important; color: #e2e8f0 !important; }
      .bg-gray-50 { background-color: #1a1830 !important; }
      .bg-gray-100 { background-color: #2a2740 !important; }
      .text-gray-800, h1, h2, h3 { color: #f1f5f9 !important; }
      .text-gray-700 { color: #cbd5e1 !important; }
      .text-gray-500 { color: #94a3b8 !important; }
      .text-gray-400 { color: #64748b !important; }
      .text-gray-300 { color: #475569 !important; }
      .border-gray-50, .border-gray-100, .border-gray-200 { border-color: #2d2a42 !important; }
      input, select, textarea { background-color: #2a2740 !important; color: #f1f5f9 !important; border-color: #3d3a55 !important; }
      input::placeholder { color: #64748b !important; }
      #navbar nav, nav.fixed { background-color: #1a1830 !important; border-color: #2d2a42 !important; }
      #btn-mas { background-color: ${i} !important; }
      .shadow-sm { box-shadow: 0 1px 6px rgba(0,0,0,0.5) !important; }
      .hover\\:bg-gray-50:hover { background-color: #2a2740 !important; }
      .hover\\:bg-gray-100:hover { background-color: #2d2a42 !important; }
      #menu-overlay, #sheet-overlay { background-color: rgba(0,0,0,0.7) !important; }
      .bg-green-50 { background-color: #052e16 !important; }
      .bg-red-50 { background-color: #2d0a0a !important; }
      .text-green-600 { color: #34d399 !important; }
      .text-red-400 { color: #f87171 !important; }

      /* Sheets en dark */
      .rounded-t-2xl { background-color: #201D30 !important; color: #e2e8f0 !important; }
      .rounded-t-2xl input { background-color: #2a2740 !important; color: #f1f5f9 !important; border-color: #3d3a55 !important; }
      .rounded-t-2xl .bg-gray-50 { background-color: #2a2740 !important; }
    `;else{let t=e===`blanco`;r.textContent=`
      ${s}
      body, #app { background-color: ${t?`#f9fafb`:o} !important; color: #1f2937 !important; }
      .bg-gray-50 { background-color: ${t?`#f3f4f6`:o} !important; }
      .bg-white { background-color: ${t?`#ffffff`:i+`15`} !important; }
      #navbar nav { background-color: white !important; border-color: ${t?`#f3f4f6`:i+`33`} !important; }
      .border-gray-50  { border-color: ${t?`#f3f4f6`:i+`15`} !important; }
      .border-gray-100 { border-color: ${t?`#e5e7eb`:i+`22`} !important; }
      .border-gray-200 { border-color: ${t?`#e5e7eb`:i+`33`} !important; }
      input, select { border-color: ${t?`#e5e7eb`:i+`33`} !important; }
      input:focus, select:focus { border-color: ${i} !important; }
      .hover\\:bg-gray-50:hover { background-color: ${t?`#f3f4f6`:i+`10`} !important; }

      /* Sheets siempre blancos */
      .rounded-t-2xl { background-color: #ffffff !important; color: #1f2937 !important; }
      .rounded-t-2xl .text-gray-800 { color: #1f2937 !important; }
      .rounded-t-2xl .text-gray-700 { color: #374151 !important; }
      .rounded-t-2xl .text-gray-500 { color: #6b7280 !important; }
      .rounded-t-2xl .text-gray-400 { color: #9ca3af !important; }
      .rounded-t-2xl input { background-color: #ffffff !important; color: #1f2937 !important; border-color: #e5e7eb !important; }
      .rounded-t-2xl input::placeholder { color: #9ca3af !important; }
      .rounded-t-2xl .bg-white { background-color: #ffffff !important; }
      .rounded-t-2xl .bg-gray-50 { background-color: #f9fafb !important; }
      .rounded-t-2xl .border-gray-200 { border-color: #e5e7eb !important; }
      .rounded-t-2xl .border-gray-50 { border-color: #f3f4f6 !important; }
    `}document.head.appendChild(r),document.documentElement.classList.toggle(`dark`,t),localStorage.setItem(`tema`,e),localStorage.setItem(`darkMode`,String(t))}function s(){let e=localStorage.getItem(`tema`)||`blanco`,t=localStorage.getItem(`darkMode`)===`true`;return o(e,t),{temaId:e,darkMode:t}}s(),e(t,e=>{e?(r(e),i(`dashboard`)):n()});export{s as n,a as r,o as t};