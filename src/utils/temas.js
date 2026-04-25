export const temas = {
  blanco:   { nombre: 'Blanco',   primary: '#63c5c0', light: '#ffffff' },
  neutro:   { nombre: 'Neutro',   primary: '#6366f1', light: '#eef2ff' },
  rosa:     { nombre: 'Rosa',     primary: '#d36998', light: '#fdf2f8' },
  celeste:  { nombre: 'Celeste',  primary: '#0284c7', light: '#f0f9ff' },
  amarillo: { nombre: 'Amarillo', primary: '#f3ce68', light: '#fffbeb' },
  verde:    { nombre: 'Verde',    primary: '#348f72', light: '#ecfdf5' },
};

export function aplicarTema(temaId, darkMode) {
  const tema = temas[temaId] || temas.blanco;

  document.getElementById('tema-style')?.remove();
  const style = document.createElement('style');
  style.id = 'tema-style';

  const p = tema.primary;
  const l = tema.light;

  const baseColor = `
    .bg-indigo-600 { background-color: ${p} !important; }
    .bg-indigo-700 { background-color: ${p}dd !important; }
    .text-indigo-600 { color: ${p} !important; }
    .text-indigo-500 { color: ${p} !important; }
    .border-indigo-400 { border-color: ${p} !important; }
    .bg-indigo-50 { background-color: ${p}20 !important; }
    .text-indigo-200 { color: ${l} !important; }
    .focus\\:border-indigo-400:focus { border-color: ${p} !important; }
    .hover\\:bg-indigo-700:hover { background-color: ${p}cc !important; }
    .hover\\:bg-indigo-100:hover { background-color: ${p}20 !important; }
    .bg-indigo-100 { background-color: ${p}20 !important; }
    .text-indigo-400 { color: ${p}99 !important; }
  `;

  if (darkMode) {
    style.textContent = `
      ${baseColor}
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
      #btn-mas { background-color: ${p} !important; }
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
    `;
  } else {
    const esBlanco = temaId === 'blanco';
    style.textContent = `
      ${baseColor}
      body, #app { background-color: ${esBlanco ? '#f9fafb' : l} !important; color: #1f2937 !important; }
      .bg-gray-50 { background-color: ${esBlanco ? '#f3f4f6' : l} !important; }
      .bg-white { background-color: ${esBlanco ? '#ffffff' : p + '15'} !important; }
      #navbar nav { background-color: white !important; border-color: ${esBlanco ? '#f3f4f6' : p + '33'} !important; }
      .border-gray-50  { border-color: ${esBlanco ? '#f3f4f6' : p + '15'} !important; }
      .border-gray-100 { border-color: ${esBlanco ? '#e5e7eb' : p + '22'} !important; }
      .border-gray-200 { border-color: ${esBlanco ? '#e5e7eb' : p + '33'} !important; }
      input, select { border-color: ${esBlanco ? '#e5e7eb' : p + '33'} !important; }
      input:focus, select:focus { border-color: ${p} !important; }
      .hover\\:bg-gray-50:hover { background-color: ${esBlanco ? '#f3f4f6' : p + '10'} !important; }

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
    `;
  }

  document.head.appendChild(style);
  document.documentElement.classList.toggle('dark', darkMode);
  localStorage.setItem('tema', temaId);
  localStorage.setItem('darkMode', String(darkMode));
}

export function cargarTema() {
  const temaId = localStorage.getItem('tema') || 'blanco';
  const darkMode = localStorage.getItem('darkMode') === 'true';
  aplicarTema(temaId, darkMode);
  return { temaId, darkMode };
}