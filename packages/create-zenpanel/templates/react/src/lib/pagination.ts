export const ADMIN_PAGE_SIZE = 5;
export const ADMIN_PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export function slicePage<T>(items: T[], page: number, pageSize = ADMIN_PAGE_SIZE) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pageCount,
    rows: items.slice(start, start + pageSize),
  };
}
