export function formatNaira(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '₦0';
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(n));
  return `₦${formatted}`;
}
