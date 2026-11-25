export type SortDirection = "asc" | "desc";
export type SortState<K extends string> = { key: K; direction: SortDirection };

/** Toggle direction when the same key is clicked, otherwise start with `asc`. */
export function nextSort<K extends string>(current: SortState<K>, key: K): SortState<K> {
  if (current.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { key, direction: key === ("updatedAt" as K) || key === ("createdAt" as K) ? "desc" : "asc" };
}

export function compareValues(a: unknown, b: unknown, direction: SortDirection) {
  const mul = direction === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" }) * mul;
}

/** Download rows as CSV (client-side). */
export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const escape = (v: string | number) => {
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
