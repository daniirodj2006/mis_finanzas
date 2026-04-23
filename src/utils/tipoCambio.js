let tcCache = null;
let tcFecha = null;

export async function getTipoCambio() {
  const ahora = new Date();
  if (tcCache && tcFecha && (ahora - tcFecha) < 3600000) return tcCache;

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    tcCache = data.rates.CRC;
    tcFecha = ahora;
    return tcCache;
  } catch (e) {
    return 500;
  }
}

export function convertir(monto, monedaOrigen, monedaDestino, tc) {
  if (monedaOrigen === monedaDestino) return monto;
  if (monedaOrigen === 'USD' && monedaDestino === 'CRC') return Math.round(monto * tc);
  if (monedaOrigen === 'CRC' && monedaDestino === 'USD') return parseFloat((monto / tc).toFixed(2));
  return monto;
}