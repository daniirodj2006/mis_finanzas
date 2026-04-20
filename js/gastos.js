/**
 * gastos.js — Página de gastos
 */
import { STATE, CATS, CAT_COLORS, fmtCRC, fmt, toColones, filterMonth } from './app.js';

export function renderGastos() {
  const el = document.getElementById('page-gastos');
  const items = filterMonth(STATE.movimientos).filter(m => m.tipo_mov === 'gasto')
                .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const total = items.reduce((s, m) => s + toColones(m.monto, m.moneda), 0);

  // Totales por categoría
  const porCat = CATS.map((cat, i) => ({
    cat, color: CAT_COLORS[i],
    total: items.filter(m => m.categoria === cat).reduce((s, m) => s + toColones(m.monto, m.moneda), 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  el.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
      <button class="btn-primary" style="width:auto;padding:10px 22px" onclick="openModal('gasto')">+ Agregar gasto</button>
    </div>

    <!-- Resumen por categoría -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-hdr">
        <span class="card-ttl">Por categoría</span>
        <span style="font-size:13px;font-weight:700;color:var(--rose)">${fmtCRC(total)}</span>
      </div>
      ${porCat.length === 0
        ? `<div class="empty"><p>Sin gastos este mes</p></div>`
        : `<div style="display:flex;flex-direction:column;gap:10px">
            ${porCat.map(c => {
              const pct = total > 0 ? Math.round(c.total / total * 100) : 0;
              return `<div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span style="font-size:12px;font-weight:600;color:var(--text)">${c.cat}</span>
                  <span style="font-size:12px;color:var(--text-m)">${fmtCRC(c.total)} <span style="color:var(--text-s)">(${pct}%)</span></span>
                </div>
                <div style="background:var(--rose-xs);border-radius:6px;height:7px;overflow:hidden">
                  <div style="height:100%;border-radius:6px;background:${c.color};width:${pct}%;transition:width .4s"></div>
                </div>
              </div>`;
            }).join('')}
          </div>`
      }
    </div>

    <!-- Tabla completa -->
    <div class="card">
      <div class="card-hdr"><span class="card-ttl">Todos los gastos</span></div>
      ${items.length === 0
        ? `<div class="empty"><svg viewBox="0 0 24 24"><path d="M12 4v16M4 12l8 8 8-8"/></svg><p>Sin gastos este mes</p></div>`
        : `<table class="data-table">
            <thead><tr><th></th><th>Descripción</th><th>Categoría</th><th>Método</th><th>Fecha</th><th style="text-align:right">Monto</th><th></th></tr></thead>
            <tbody>${items.map(m => `
              <tr>
                <td><div class="row-icon" style="background:#FFEBEE">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#C62828" stroke-width="2"><path d="M12 4v16M4 12l8 8 8-8"/></svg>
                </div></td>
                <td>
                  <div style="font-size:12px;font-weight:600">${m.descripcion || '—'}</div>
                  ${m.recurrente ? `<span class="badge rec">↻ ${m.rec_freq || 'Mensual'}</span>` : ''}
                </td>
                <td><span class="badge cat">${m.categoria || '—'}</span></td>
                <td><span class="badge method">${m.metodo || '—'}</span></td>
                <td style="color:var(--text-s);font-size:11px">${m.fecha}</td>
                <td style="text-align:right"><span class="amount neg">-${fmt(m.monto, m.moneda)}</span></td>
                <td><button class="btn-icon" onclick="deleteItem('${m.id}')">✕</button></td>
              </tr>
            `).join('')}</tbody>
          </table>`
      }
    </div>
  `;
}
