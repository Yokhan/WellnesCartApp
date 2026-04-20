export function formatRub(rub: number): string {
  return `${Math.round(rub).toLocaleString('ru-RU')} ₽`;
}

export function formatRubShort(rub: number): string {
  if (rub >= 1000) return `${(rub / 1000).toFixed(1)}к ₽`;
  return formatRub(rub);
}

export function formatPerProtein(price_rub: number, protein_g: number): string {
  if (protein_g <= 0) return '—';
  return `${(price_rub / protein_g).toFixed(2)} ₽/г белка`;
}

export function formatPer100Kcal(price_rub: number, kcal: number): string {
  if (kcal <= 0) return '—';
  const per100 = (price_rub / kcal) * 100;
  return `${per100.toFixed(2)} ₽/100 ккал`;
}

export function formatGrams(g: number): string {
  if (g >= 1000) return `${(g / 1000).toFixed(1)} кг`;
  return `${Math.round(g)} г`;
}
