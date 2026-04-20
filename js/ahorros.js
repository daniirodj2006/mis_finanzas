/**
 * ahorros.js — Página de ahorros
 */
import { STATE, MESES, fmtCRC, fmtUSD, toColones, getSelYear, saveMeta } from './app.js';

export function renderAhorros() {
  const el = document.getElementById('page-ahorros');
  const y  = getSelYear();

  // Calcula ahorro real por mes
  const porMes = MESES.map((mes, i) => {
    const items = STATE.movimientos.filter(d => {
      const fd = new Date(d.fecha + 'T12:00:00');
      return d.tipo_mov === 'ahorro' && fd.getMonth() === i && fd.getFullYear() === y;
    });
    return { mes, i, total: items.reduce((s, m) => s + toColones(m.monto, m.moneda), 0) };
  });

  const metaAnual = STATE.metaAnual;
  const metaMes   = metaAnual / 12;
  const totalAho  = porMes.reduce((s, m) => s + m.total, 0);
  const pctTotal  = metaAnual > 0 ? Math.min(Math.round(totalAho / metaAnual * 100), 100) : 0;
  const metaUSD   = STATE.tc > 0 ? metaAnual / STATE.tc : 0;

  el.innerHTML = `
    <!-- Meta anual -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-hdr"><span class="card-ttl">Meta anual de ahorro</span></div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px">
        <div>
          <div class="form-label">Meta anual (₡)</div>
          <input type="number" id="meta-anual-input" class="form-input" value="${metaAnual}" style="width:180px"
            oninput="onMetaChange(this.value)"/>
        </div>
        <div>
          <div class="form-label">Equivalente USD</div>
          <div style="font-size:16px;font-weight:700;color:var(--rose-d)">${fmtUSD(metaUSD)}</div>
        </div>
        <div style="flex:1;min-width:160px">
          <div class="form-label">Progreso anual</div>
          <div style="font-size:22px;font-weight:700;color:var(--rose-d)">${fmtCRC(totalAho)}</div>
          <div style="font-size:11px;color:var(--text-s);margin-top:2px">${pctTotal}% alcanzado</div>
          <div style="background:var(--rose-xs);border-radius:6px;height:8px;overflow:hidden;margin-top:6px">
            <div style="height:100%;border-radius:6px;background:linear-gradient(to right,var(--rose),var(--mauve));width:${pctTotal}%;transition:width .5s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Por mes -->
    <div class="card">
      <div class="card-hdr">
        <span class="card-ttl">Ahorro mensual ${y}</span>
        <span class="card-lnk" onclick="openModal('ahorro')">+ Registrar</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${porMes.map(({ mes, total: tot }) => {
          const pct    = metaMes > 0 ? Math.min(Math.round(tot / metaMes * 100), 100) : 0;
          const status = tot >= metaMes ? '✅' : tot > 0 ? '⚠️' : '—';
          return `<div class="saving-row">
            <span class="saving-month">${mes}</span>
            <div class="saving-bar-bg"><div class="saving-bar-fill" style="width:${pct}%"></div></div>
            <span class="saving-pct">${pct}%</span>
            <span class="saving-amt">${fmtCRC(tot)}</span>
            <span class="saving-stat">${status}</span>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:700;color:var(--text)">Total anual</span>
        <span style="font-size:16px;font-weight:700;color:var(--rose-d)">${fmtCRC(totalAho)}</span>
      </div>
    </div>
  `;

  // Handler para cambiar la meta en tiempo real
  window.onMetaChange = async (val) => {
    await saveMeta(val);
    renderAhorros();
  };
}
