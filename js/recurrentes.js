/**
 * recurrentes.js — Página de movimientos recurrentes
 */
import { STATE, fmtCRC, fmt, toColones, MESES } from './app.js';

export function renderRecurrentes() {
  const el    = document.getElementById('page-recurrentes');
  const items = STATE.movimientos.filter(m => m.recurrente);

  const totalIng = items.filter(m => m.tipo_mov === 'ingreso').reduce((s, m) => s + toColones(m.monto, m.moneda), 0);
  const totalGas = items.filter(m => m.tipo_mov === 'gasto').reduce((s, m) => s + toColones(m.monto, m.moneda), 0);

  el.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
      <button class="btn-primary" style="width:auto;padding:10px 22px" onclick="openModal('gasto')">+ Agregar recurrente</button>
    </div>

    <!-- Resumen -->
    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card c-green">
        <div class="kpi-lbl">Ingresos fijos</div>
        <div class="kpi-val up">${fmtCRC(totalIng)}</div>
        <div class="kpi-sub">por mes</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 16V4M4 10l6-6 6 6"/></svg></div>
      </div>
      <div class="kpi-card c-rose">
        <div class="kpi-lbl">Gastos fijos</div>
        <div class="kpi-val down">${fmtCRC(totalGas)}</div>
        <div class="kpi-sub">por mes</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4v12M4 10l6 6 6-6"/></svg></div>
      </div>
      <div class="kpi-card c-mauve">
        <div class="kpi-lbl">Neto fijo</div>
        <div class="kpi-val ${totalIng - totalGas >= 0 ? 'up' : 'down'}">${fmtCRC(totalIng - totalGas)}</div>
        <div class="kpi-sub">por mes</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h14"/></svg></div>
      </div>
    </div>

    <!-- Lista -->
    <div class="card">
      <div class="card-hdr"><span class="card-ttl">Movimientos recurrentes</span></div>
      ${items.length === 0
        ? `<div class="empty">
            <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 109 9"/><path d="M3 6v6h6"/></svg>
            <p>Sin movimientos recurrentes aún</p>
            <p style="font-size:11px;margin-top:6px">Activá "¿Se repite?" al agregar un movimiento</p>
          </div>`
        : `<table class="data-table">
            <thead>
              <tr>
                <th></th><th>Descripción</th><th>Frecuencia</th><th>Día</th>
                <th>Cuenta</th><th style="text-align:right">Monto</th><th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map(m => {
                const isIng   = m.tipo_mov === 'ingreso';
                const bg      = isIng ? '#E8F5E9' : '#FFEBEE';
                const clr     = isIng ? '#2E7D32' : '#C62828';
                const icon    = isIng ? '<path d="M12 20V4M4 12l8-8 8 8"/>' : '<path d="M12 4v16M4 12l8 8 8-8"/>';
                const nextDate = getNextDate(m);
                return `<tr>
                  <td><div class="row-icon" style="background:${bg}">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="${clr}" stroke-width="2">${icon}</svg>
                  </div></td>
                  <td>
                    <div style="font-size:12px;font-weight:600;color:var(--text)">${m.descripcion}</div>
                    <div style="margin-top:3px;display:flex;gap:4px;flex-wrap:wrap">
                      <span class="badge ${isIng ? 'pos' : 'neg'}">${m.tipo_mov}</span>
                      ${m.categoria ? `<span class="badge cat">${m.categoria}</span>` : ''}
                    </div>
                    ${nextDate ? `<div style="font-size:10px;color:var(--text-s);margin-top:3px">Próximo: ${nextDate}</div>` : ''}
                  </td>
                  <td><span class="badge rec">↻ ${m.rec_freq || 'Mensual'}</span></td>
                  <td style="font-size:12px;color:var(--text-m)">${m.rec_day || '—'}</td>
                  <td style="font-size:12px;color:var(--text-m)">${m.rec_acc || m.cuenta || '—'}</td>
                  <td style="text-align:right"><span class="amount ${isIng ? 'pos' : 'neg'}">${fmt(m.monto, m.moneda)}</span></td>
                  <td><button class="btn-icon" onclick="deleteItem('${m.id}')">✕</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>`
      }
    </div>
  `;
}

function getNextDate(m) {
  if (!m.rec_freq || !m.rec_day) return null;
  const now = new Date();
  try {
    if (m.rec_freq === 'Mensual') {
      const d = new Date(now.getFullYear(), now.getMonth() + 1, parseInt(m.rec_day));
      return d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (m.rec_freq === 'Anual') {
      const d = new Date(now.getFullYear() + 1, parseInt(m.rec_day) - 1, 1);
      return d.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' });
    }
  } catch { return null; }
  return null;
}
