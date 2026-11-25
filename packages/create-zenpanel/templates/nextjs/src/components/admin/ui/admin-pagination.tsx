"use client";

import { ADMIN_PAGE_SIZE, ADMIN_PAGE_SIZE_OPTIONS } from "@/lib/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId } from "react";

function pageWindow(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);
  return items;
}

type AdminPaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  /** Show a "Rows per page" select when provided. */
  onPageSizeChange?: (size: number) => void;
};

export function AdminPagination({
  page,
  pageCount,
  total,
  pageSize = ADMIN_PAGE_SIZE,
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  const sizeId = useId();
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const items = pageWindow(page, pageCount);
  const button =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const idle =
    "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
  const active = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {start}–{end}
          </span>{" "}
          of <span className="font-medium text-gray-700 dark:text-gray-200">{total}</span>
        </p>
        {onPageSizeChange && (
          <label htmlFor={sizeId} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            Rows
            <select
              id={sizeId}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              {ADMIN_PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={`${button} ${idle}`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${button} ${item === page ? active : idle}`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className={`${button} ${idle}`}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
