// Generated from the shared ZenPanel TypeScript core - edit freely.
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString() : "-";
}
function formatRelativeTime(iso, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.round(diff / 6e4);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString();
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
export {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime
};
