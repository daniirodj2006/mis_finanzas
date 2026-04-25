import { getAuth } from 'firebase/auth';

const icons = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  cuentas: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  tarjetas: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L2 7h20l-6-4z"/></svg>`,
  ahorros: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  perfil: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
};

export function renderNavbar(activePage) {
  const items = [
    { id: 'dashboard', label: 'Inicio' },
    { id: 'cuentas', label: 'Cuentas' },
    { id: 'tarjetas', label: 'Tarjetas' },
    { id: 'ahorros', label: 'Ahorros' },
    { id: 'perfil', label: 'Perfil' },
  ];

  document.querySelector('#navbar').innerHTML = `
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 px-2">
      ${items.map(item => `
        <button data-page="${item.id}"
          class="nav-btn flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition
            ${activePage === item.id ? 'text-indigo-600' : 'text-gray-400'}">
          ${icons[item.id]}
          <span class="text-xs font-medium">${item.label}</span>
        </button>
      `).join('')}
    </nav>
  `;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      import(`../pages/${page}.js`).then(module => {
        const fnName = 'render' + page.charAt(0).toUpperCase() + page.slice(1);

        if (page === 'dashboard') {
          const user = getAuth().currentUser;
          module[fnName](user);
        } else {
          module[fnName]();
        }

        renderNavbar(page);
      });
    });
  });
}