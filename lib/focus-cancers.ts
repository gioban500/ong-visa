function normalizeCancerName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function isFocusCancer(name: string): boolean {
  const normalizedName = normalizeCancerName(name);

  return /\b(sein|mammaire)\b/.test(normalizedName)
    || /\b(uterus|uterin|uterine|endometre|cervix|cervical|col)\b/.test(normalizedName);
}
