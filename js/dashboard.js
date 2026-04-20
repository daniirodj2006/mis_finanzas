/**
 * dashboard.js — Renderiza la página principal
 * KPIs, banner de balance, gráfico de barras, donut, últimos movimientos
 */

import { STATE, CATS, CAT_COLORS, MESES, fmtCRC, fmtUSD, fmt, toColones, filterMonth, getSelMonth, getSelYear } from './app.js';

export function renderDashboard() {
  const el = document.getElementById('page-dashboard');

  const all   = STATE.movimientos;
  const items = filterMonth(all);
  const ings  = items.filter(m => m.tipo_mov === 'ingreso');
  const gass  = items.filter(m => m.tipo_mov === 'gasto');
  const ahos  = items.filter(m => m.tipo_mov === 'ahorro');

  const totalIng = ings.reduce((s, m) => s + toColones(m.monto, m.moneda), 0);
  const totalGas = gass.reduce((s, m) => s + toColones(m.monto, m.moneda), 0);
  const totalAho = ahos.reduce((s, m) => s + toColones(m.monto, m.moneda), 0);
  const balance  = totalIng - totalGas;

  const metaM   = STATE.metaAnual / 12;
  const ahoPct  = metaM > 0 ? Math.round(totalAho / metaM * 100) : 0;

  // Banner
  let bannerClass = 'neu', bannerIcon = '', bannerMsg = 'Registrá tu primer movimiento 🌸';
  if (ings.length > 0 || gass.length > 0) {
    if (balance >= 0) { bannerClass = 'pos'; bannerIcon = checkIcon('#2E7D32'); bannerMsg = 'Mes positivo — tus finanzas van bien 💚'; }
    else              { bannerClass = 'neg'; bannerIcon = warnIcon('#C62828');  bannerMsg = 'Mes negativo — los gastos superan los ingresos ⚠️'; }
  }

  el.innerHTML = `
    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card c-green">
        <div class="kpi-lbl">Ingresos del mes</div>
        <div class="kpi-val up">${fmtCRC(totalIng)}</div>
        <div class="kpi-sub">${ings.length} movimiento${ings.length !== 1 ? 's' : ''}</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 16V4M4 10l6-6 6 6"/></svg></div>
      </div>
      <div class="kpi-card c-rose">
        <div class="kpi-lbl">Gastos del mes</div>
        <div class="kpi-val down">${fmtCRC(totalGas)}</div>
        <div class="kpi-sub">${gass.length} movimiento${gass.length !== 1 ? 's' : ''}</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4v12M4 10l6 6 6-6"/></svg></div>
      </div>
      <div class="kpi-card c-mauve">
        <div class="kpi-lbl">Ahorro del mes</div>
        <div class="kpi-val">${fmtCRC(totalAho)}</div>
        <div class="kpi-sub">${ahoPct}% de la meta mensual</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg></div>
      </div>
      <div class="kpi-card c-gold">
        <div class="kpi-lbl">Balance neto</div>
        <div class="kpi-val ${balance >= 0 ? 'up' : 'down'}">${fmtCRC(balance)}</div>
        <div class="kpi-sub">Ingresos − Gastos</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h14M10 4l6 6-6 6"/></svg></div>
      </div>
    </div>

    <!-- Banner -->
    <div class="balance-banner ${bannerClass}">
      ${bannerIcon}
      <span>${bannerMsg}</span>
    </div>

    <!-- Gráficos -->
    <div class="two-col">
      <div class="card">
        <div class="card-hdr"><span class="card-ttl">Gastos por mes</span></div>
        <div class="bar-chart" id="dash-bar-chart"></div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-ttl">Por categoría</span></div>
        <div class="donut-wrap">
          <svg id="dash-donut" width="100" height="100" viewBox="0 0 100 100" style="flex-shrink:0"></svg>
          <div class="donut-legend" id="dash-donut-leg"></div>
        </div>
      </div>
    </div>

    <!-- Últimos movimientos -->
    <div class="card">
      <div class="card-hdr">
        <span class="card-ttl">Últimos movimientos</span>
        <span class="card-lnk" onclick="navigate('gastos')">Ver todos</span>
      </div>
      <div id="dash-recent"></div>
    </div>
  `;

  renderBarChart(all);
  renderDonut(items);
  renderRecent(items);
}

// ── Bar chart (últimos 6 meses) ───────────────────────────────────
function renderBarChart(all) {
  const el = document.getElementById('dash-bar-chart');
  if (!el) return;
  const selM = getSelMonth(), selY = getSelYear();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const offset = i - 5;
    let m = ((selM + offset) % 12 + 12) % 12;
    let y = selY + Math.floor((selM + offset) / 12);
    const items = all.filter(d => {
      const fd = new Date(d.fecha + 'T12:00:00');
      return fd.getMonth() === m && fd.getFullYear() === y;
    });
    const gas = items.filter(d => d.tipo_mov === 'gasto').reduce((s, d) => s + toColones(d.monto, d.moneda), 0);
    months.push({ m, gas, label: MESES[m].slice(0, 3), isCurrent: i === 5 });
  }
  const maxVal = Math.max(...months.map(m => m.gas), 1);
  const H = 80;
  el.innerHTML = months.map(d => {
    const h = Math.max(Math.round((d.gas / maxVal) * H), 3);
    return `<div class="bc-col">
      <div class="bc-val">${d.gas > 0 ? fmtCRC(d.gas).slice(0, 7) : ''}</div>
      <div class="bc-bar${d.isCurrent ? ' current' : ''}" style="height:${h}px" title="${fmtCRC(d.gas)}"></div>
      <div class="bc-lbl">${d.label}</div>
    </div>`;
  }).join('');
}

// ── Donut ─────────────────────────────────────────────────────────
function renderDonut(items) {
  const svg = document.getElementById('dash-donut');
  const leg = document.getElementById('dash-donut-leg');
  if (!svg || !leg) return;

  const gass = items.filter(m => m.tipo_mov === 'gasto');
  const totByCAT = {};
  CATS.forEach(c => totByCAT[c] = 0);
  gass.forEach(m => { if (m.categoria in totByCAT) totByCAT[m.categoria] += toColones(m.monto, m.moneda); });
  const total   = Object.values(totByCAT).reduce((a, b) => a + b, 0);
  const entries = CATS.map((c, i) => ({ cat: c, val: totByCAT[c], color: CAT_COLORS[i] }))
                      .filter(e => e.val > 0).sort((a, b) => b.val - a.val);

  const R = 38, C = 50, circ = 2 * Math.PI * R;

  if (!entries.length) {
    svg.innerHTML = `<circle cx="50" cy="50" r="${R}" fill="none" stroke="#FCE4EC" stroke-width="14"/>
      <text x="50" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#2D1F2A">—</text>`;
    leg.innerHTML = `<div class="dl-row"><div class="dl-dot" style="background:var(--rose-ll)"></div><span class="dl-name" style="color:var(--text-s)">Sin datos</span></div>`;
    return;
  }

  let arcs = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#FCE4EC" stroke-width="14"/>`;
  let offset = 0;
  entries.forEach(e => {
    const pct  = e.val / total;
    const dash = pct * circ;
    const off  = -(offset * circ) + circ / 4;
    arcs += `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${e.color}" stroke-width="14"
      stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
      stroke-dashoffset="${off.toFixed(2)}" stroke-linecap="butt"/>`;
    offset += pct;
  });
  arcs += `<text x="50" y="47" text-anchor="middle" font-size="9" fill="#7A5A6E">Total</text>
    <text x="50" y="58" text-anchor="middle" font-size="9" font-weight="700" fill="#2D1F2A">${fmtCRC(total).slice(0, 9)}</text>`;
  svg.innerHTML = arcs;

  leg.innerHTML = entries.slice(0, 5).map(e => {
    const pct = total > 0 ? Math.round(e.val / total * 100) : 0;
    return `<div class="dl-row">
      <div class="dl-dot" style="background:${e.color}"></div>
      <span class="dl-name">${e.cat}</span>
      <span class="dl-pct">${pct}%</span>
    </div>`;
  }).join('');
}

// ── Recent list ───────────────────────────────────────────────────
function renderRecent(items) {
  const el = document.getElementById('dash-recent');
  if (!el) return;
  const sorted = items.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 7);
  if (!sorted.length) {
    el.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg><p>Sin movimientos este mes</p></div>`;
    return;
  }
  el.innerHTML = `<table class="data-table">
    <thead><tr><th></th><th>Descripción</th><th>Fecha</th><th style="text-align:right">Monto</th><th></th></tr></thead>
    <tbody>${sorted.map(rowHTML).join('')}</tbody>
  </table>`;
}

export function rowHTML(m) {
  const isIng = m.tipo_mov === 'ingreso';
  const isAho = m.tipo_mov === 'ahorro';
  const bg    = isIng ? '#E8F5E9' : isAho ? '#FCE4EC' : '#FFEBEE';
  const clr   = isIng ? '#2E7D32' : isAho ? '#C2185B' : '#C62828';
  const icon  = isIng
    ? '<path d="M12 20V4M4 12l8-8 8 8"/>'
    : isAho
      ? '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>'
      : '<path d="M12 4v16M4 12l8 8 8-8"/>';
  const sign   = isIng || isAho ? '+' : '-';
  const cls    = isIng || isAho ? 'pos' : 'neg';
  const recBdg = m.recurrente ? `<span class="badge rec">↻ ${m.rec_freq || 'Mensual'}</span>` : '';
  const catBdg = m.categoria  ? `<span class="badge cat">${m.categoria}</span>` : '';
  return `<tr>
    <td><div class="row-icon" style="background:${bg}">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="${clr}" stroke-width="2">${icon}</svg>
    </div></td>
    <td>
      <div style="font-size:12px;font-weight:600;color:var(--text)">${m.descripcion || '—'}</div>
      <div style="display:flex;gap:4px;margin-top:3px;flex-wrap:wrap">${catBdg}${recBdg}</div>
    </td>
    <td style="color:var(--text-s);font-size:11px;white-space:nowrap">${m.fecha}</td>
    <td style="text-align:right"><span class="amount ${cls}">${sign}${fmt(m.monto, m.moneda)}</span></td>
    <td><button class="btn-icon" onclick="deleteItem('${m.id}')" title="Eliminar">✕</button></td>
  </tr>`;
}

// ── Icon helpers ──────────────────────────────────────────────────
function checkIcon(color) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" style="flex-shrink:0"><path d="M20 6L9 17l-5-5"/></svg>`;
}
function warnIcon(color) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}

// exponer navigate globalmente
window.navigate = (p) => import('./app.js').then(m => m.navigate(p));
