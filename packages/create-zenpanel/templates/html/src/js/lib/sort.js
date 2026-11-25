// Generated from the shared ZenPanel TypeScript core - edit freely.
function nextSort(current, key) {
  if (current.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { key, direction: key === "updatedAt" || key === "createdAt" ? "desc" : "asc" };
}
function compareValues(a, b, direction) {
  const mul = direction === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
  return String(a ?? "").localeCompare(String(b ?? ""), void 0, { numeric: true, sensitivity: "base" }) * mul;
}
function downloadCsv(filename, headers, rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
export {
  compareValues,
  downloadCsv,
  nextSort
};
