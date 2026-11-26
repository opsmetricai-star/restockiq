// Deterministic planning math. No AI involved: precision-sensitive numbers come from here.

export type Point = { date: string; qty: number };

export function zFor(serviceLevel: number): number {
  // Acklam-style rational approximation of the inverse normal CDF
  const p = Math.min(Math.max(serviceLevel, 0.5001), 0.9999);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  if (p > 0.97575) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5, r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Fill missing days with 0 so averages reflect true daily demand. */
export function toDaily(points: Point[]): number[] {
  if (!points.length) return [];
  const m = new Map(points.map((p) => [p.date, p.qty]));
  const days = points.map((p) => p.date).sort();
  const start = new Date(days[0] + "T00:00:00Z"), end = new Date(days[days.length - 1] + "T00:00:00Z");
  const out: number[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) out.push(m.get(new Date(t).toISOString().slice(0, 10)) ?? 0);
  return out;
}

const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const std = (a: number[]) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };

/** Simple exponential smoothing level. */
function ses(series: number[], alpha: number): number {
  let l = series[0] ?? 0;
  for (let i = 1; i < series.length; i++) l = alpha * series[i] + (1 - alpha) * l;
  return l;
}

export type ForecastResult = { method: string; daily: number; total: number; wape: number | null; bias: number | null; sigma: number; days: number };

/**
 * Picks the best of moving average (28d) and exponential smoothing by one-step-ahead
 * backtest on the most recent holdout, then projects flat over the horizon.
 */
export function forecast(series: number[], horizon: number): ForecastResult {
  if (series.length < 7) {
    const d = mean(series);
    return { method: "mean (insufficient history)", daily: d, total: d * horizon, wape: null, bias: null, sigma: std(series), days: series.length };
  }
  const hold = Math.min(14, Math.floor(series.length / 3));
  const candidates: { name: string; f: (hist: number[]) => number }[] = [
    { name: "moving average (28d)", f: (h) => mean(h.slice(-28)) },
    { name: "exponential smoothing (α=0.3)", f: (h) => ses(h, 0.3) },
    { name: "exponential smoothing (α=0.1)", f: (h) => ses(h, 0.1) },
  ];
  let best = { name: "", wape: Infinity, bias: 0 };
  for (const c of candidates) {
    let err = 0, act = 0, signed = 0;
    for (let i = series.length - hold; i < series.length; i++) {
      const f = c.f(series.slice(0, i));
      err += Math.abs(series[i] - f); signed += f - series[i]; act += series[i];
    }
    const wape = act > 0 ? err / act : Infinity;
    if (wape < best.wape) best = { name: c.name, wape, bias: act > 0 ? signed / act : 0 };
  }
  if (!best.name) best = { name: candidates[0].name, wape: NaN, bias: NaN };
  const daily = Math.max(0, candidates.find((c) => c.name === best.name)!.f(series));
  const sigma = std(series.slice(-56));
  return { method: best.name, daily, total: daily * horizon, wape: Number.isFinite(best.wape) ? best.wape : null, bias: Number.isFinite(best.bias) ? best.bias : null, sigma, days: series.length };
}

export type ReplenishInput = { dailyDemand: number; sigma: number; leadTimeDays: number; serviceLevel: number; onHand: number; onOrder: number; minOrderQty: number; reviewDays?: number };
export type ReplenishResult = { safetyStock: number; reorderPoint: number; orderUpTo: number; inventoryPosition: number; orderQty: number; daysOfCover: number; status: "stockout-risk" | "reorder" | "ok" | "overstock" };

export function replenish(i: ReplenishInput): ReplenishResult {
  const review = i.reviewDays ?? 7;
  const z = zFor(i.serviceLevel);
  const safetyStock = Math.ceil(z * i.sigma * Math.sqrt(Math.max(i.leadTimeDays, 1)));
  const reorderPoint = Math.ceil(i.dailyDemand * i.leadTimeDays + safetyStock);
  const orderUpTo = Math.ceil(i.dailyDemand * (i.leadTimeDays + review) + safetyStock);
  const inventoryPosition = i.onHand + i.onOrder;
  let orderQty = 0;
  if (inventoryPosition <= reorderPoint) {
    orderQty = Math.max(orderUpTo - inventoryPosition, 0);
    if (orderQty > 0) orderQty = Math.max(Math.ceil(orderQty / i.minOrderQty) * i.minOrderQty, i.minOrderQty);
  }
  const daysOfCover = i.dailyDemand > 0 ? i.onHand / i.dailyDemand : Infinity;
  let status: ReplenishResult["status"] = "ok";
  if (i.onHand < i.dailyDemand * i.leadTimeDays && inventoryPosition <= reorderPoint && i.onHand <= safetyStock) status = "stockout-risk";
  else if (orderQty > 0) status = "reorder";
  else if (daysOfCover > 120) status = "overstock";
  return { safetyStock, reorderPoint, orderUpTo, inventoryPosition, orderQty, daysOfCover: Number.isFinite(daysOfCover) ? Math.round(daysOfCover * 10) / 10 : 9999, status };
}
