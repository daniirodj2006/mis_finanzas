/**
 * cuentas.js — Página de cuentas y tarjetas
 */
import { STATE, fmtCRC, fmtUSD, fmt, toColones } from './app.js';

const ACCOUNTS = [
  { id: 'CRC',  label: 'Cuenta CRC',  currency: 'CRC', gradient: 'linear-gradient(135deg,#66BB6A,#388E3C)' },
  { id: 'USD',  label: 'Cuenta USD',  currency: 'USD', gradient: 'linear-gradient(135deg,#4A90D9,#2867B2)' },
  { id: 'AMEX', label: 'Tarjeta AMEX', currency: 'CRC', gradient: 'linear-gradient(135deg,#7E57C2,#4527A0)' },
  { id: 'GOLD', label: 'Tarjeta Gold', currency: 'CRC', gradient: 'linear-gradient(135deg,#FFB74D,#E65100)' },
];

export function renderCuentas() {
  const el = document.getElementById('page-cuentas');

  // Calcula saldo por cuenta
  const balances = {};
  ACCOUNTS.forEach(a => balances[a.id] = 0);

  STATE.movimientos.forEach(m => {
    const acc = (m.cuenta || 'CRC').toUpperCase();
    if (!(acc in balances)) return;
    balances[acc] += m.tipo_mov === 'ingreso' ? m.monto : -m.monto;
  });

  el.innerHTML = `
    <!-- Cards de cuentas -->
    <div class="acc-grid" style="margin-bottom:16px">
      ${ACCOUNTS.map(a => {
        const bal    = balances[a.id] || 0;
        const balFmt = a.currency === 'USD' ? fmtUSD(bal) : fmtCRC(bal);
        return `<div class="acc-card" style="background:${a.gradient}" onclick="viewAccount('${a.id}')">
          <div class="acc-lbl">${a.label.toUpperCase()}</div>
          <div class="acc-bal" style="margin-top:6px">${balFmt}</div>
          <div class="acc-footer">
            <span class="acc-sub">${a.currency}</span>
            <span class="acc-chip">Ver movimientos</span>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Detalle de cuenta -->
    <div class="card">
      <div class="card-hdr">
        <span class="card-ttl" id="acc-detail-title">Seleccioná una cuenta</span>
        <span class="card-lnk" id="acc-add-btn" style="display:none" onclick="openModal('gasto')">+ Agregar</span>
      </div>
      <div id="acc-detail-list">
        <div class="empty">
          <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 9h20"/></svg>
          <p>Tocá una cuenta para ver sus movimientos</p>
        </div>
      </div>
    </div>
  `;

  window.viewAccount = (accId) => {
    STATE.currentAcc = accId;
    const acc    = ACCOUNTS.find(a => a.id === accId);
    const items  = STATE.movimientos
      .filter(m => (m.cuenta || 'CRC').toUpperCase() === accId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    document.getElementById('acc-detail-title').textContent = acc ? acc.label : accId;
    document.getElementById('acc-add-btn').style.display = 'inline';

    const listEl = document.getElementById('acc-detail-list');
    if (!items.length) {
      listEl.innerHTML = `<div class="empty"><p>Sin movimientos en esta cuenta</p></div>`;
      return;
    }

    // Calcula balance acumulado
    let running = 0;
    const withBal = items.slice().reverse().map(m => {
      running += m.tipo_mov === 'ingreso' ? m.monto : -m.monto;
      return { ...m, runningBal: running };
    }).reverse();

    listEl.innerHTML = `<table class="data-table">
      <thead><tr><th>Descripción</th><th>Fecha</th><th style="text-align:right">Monto</th><th style="text-align:right">Balance</th><th></th></tr></thead>
      <tbody>${withBal.map(m => {
        const isIng = m.tipo_mov === 'ingreso';
        const sign  = isIng ? '+' : '-';
        const cls   = isIng ? 'pos' : 'neg';
        const currency = acc ? acc.currency : 'CRC';
        const balFmt   = currency === 'USD' ? fmtUSD(m.runningBal) : fmtCRC(m.runningBal);
        const balColor = m.runningBal >= 0 ? 'var(--green)' : 'var(--rose)';
        return `<tr>
          <td>
            <div style="font-size:12px;font-weight:600;color:var(--text)">${m.descripcion || '—'}</div>
            ${m.recurrente ? `<span class="badge rec">↻ ${m.rec_freq}</span>` : ''}
          </td>
          <td style="font-size:11px;color:var(--text-s)">${m.fecha}</td>
          <td style="text-align:right"><span class="amount ${cls}">${sign}${fmt(m.monto, m.moneda)}</span></td>
          <td style="text-align:right;font-size:12px;font-weight:700;color:${balColor}">${balFmt}</td>
          <td><button class="btn-icon" onclick="deleteItem('${m.id}')">✕</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  };
}
