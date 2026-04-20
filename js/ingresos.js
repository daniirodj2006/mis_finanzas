/**
 * ingresos.js — Página de ingresos
 */
import { STATE, fmtCRC, fmt, toColones, filterMonth } from './app.js';
import { rowHTML } from './dashboard.js';

export function renderIngresos() {
  const el = document.getElementById('page-ingresos');
  const items = filterMonth(STATE.movimientos).filter(m => m.tipo_mov === 'ingreso')
                .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const total = items.reduce((s, m) => s + toColones(m.monto, m.moneda), 0);

  // Totales por tipo
  const tipos = ['Salario', 'Ingreso extra', 'Freelance', 'Beca', 'Otro'];
  const porTipo = tipos.map(t => ({
    tipo: t,
    total: items.filter(m => (m.sub_tipo || m.tipo) === t).reduce((s, m) => s + toColones(m.monto, m.moneda), 0)
  })).filter(t => t.total > 0);

  el.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
      <button class="btn-primary" style="width:auto;padding:10px 22px" onclick="openModal('ingreso')">+ Agregar ingreso</button>
    </div>

    <!-- Resumen -->
    <div class="kpi-grid" style="margin-bottom:16px">
      <div class="kpi-card c-green">
        <div class="kpi-lbl">Total del mes</div>
        <div class="kpi-val up">${fmtCRC(total)}</div>
        <div class="kpi-sub">${items.length} registro${items.length !== 1 ? 's' : ''}</div>
        <div class="kpi-icon"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 16V4M4 10l6-6 6 6"/></svg></div>
      </div>
      ${porTipo.map(t => `
        <div class="kpi-card c-mauve">
          <div class="kpi-lbl">${t.tipo}</div>
          <div class="kpi-val">${fmtCRC(t.total)}</div>
          <div class="kpi-sub">${total > 0 ? Math.round(t.total / total * 100) : 0}% del total</div>
        </div>
      `).join('')}
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-hdr">
        <span class="card-ttl">Ingresos del mes</span>
        <span style="font-size:13px;font-weight:700;color:var(--green)">${fmtCRC(total)}</span>
      </div>
      ${items.length === 0
        ? `<div class="empty"><svg viewBox="0 0 24 24"><path d="M12 20V4M4 12l8-8 8 8"/></svg><p>Sin ingresos este mes</p></div>`
        : `<table class="data-table">
            <thead><tr><th></th><th>Descripción</th><th>Tipo</th><th>Fecha</th><th style="text-align:right">Monto</th><th></th></tr></thead>
            <tbody>${items.map(m => `
              <tr>
                <td><div class="row-icon" style="background:#E8F5E9">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#2E7D32" stroke-width="2"><path d="M12 20V4M4 12l8-8 8 8"/></svg>
                </div></td>
                <td>
                  <div style="font-size:12px;font-weight:600">${m.descripcion || '—'}</div>
                  ${m.recurrente ? `<span class="badge rec">↻ ${m.rec_freq || 'Mensual'}</span>` : ''}
                </td>
                <td><span class="badge cat">${m.sub_tipo || m.tipo || '—'}</span></td>
                <td style="color:var(--text-s);font-size:11px">${m.fecha}</td>
                <td style="text-align:right"><span class="amount pos">+${fmt(m.monto, m.moneda)}</span></td>
                <td><button class="btn-icon" onclick="deleteItem('${m.id}')">✕</button></td>
              </tr>
            `).join('')}</tbody>
          </table>`
      }
    </div>
  `;
}
