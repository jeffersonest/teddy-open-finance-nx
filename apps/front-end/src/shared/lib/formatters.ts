const brazilCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const brazilRoundedCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const brazilCompactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const brazilShortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const brazilLongDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const brazilDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCurrency(value: number) {
  return brazilCurrencyFormatter.format(value);
}

export function formatRoundedCurrency(value: number) {
  return brazilRoundedCurrencyFormatter.format(value);
}

export function formatCompactCurrency(value: number) {
  return brazilCompactCurrencyFormatter.format(value);
}

export function formatShortDate(value: string) {
  return brazilShortDateFormatter.format(new Date(value));
}

export function formatLongDate(value: string) {
  return brazilLongDateFormatter.format(new Date(value));
}

export function formatDateTime(value: string) {
  return brazilDateTimeFormatter.format(new Date(value));
}
