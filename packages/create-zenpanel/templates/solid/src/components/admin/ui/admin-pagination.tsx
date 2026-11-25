import { pageWindow } from "@/lib/admin-resources";
import { ADMIN_PAGE_SIZE, ADMIN_PAGE_SIZE_OPTIONS } from "@/lib/pagination";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { createUniqueId, For, Show } from "solid-js";

export { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";

type AdminPaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  /** Show the "Rows" select when provided. */
  onPageSizeChange?: (size: number) => void;
};

const button =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const idle =
  "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
const active = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";

export function AdminPagination(props: AdminPaginationProps) {
  const sizeId = createUniqueId();
  const pageSize = () => props.pageSize ?? ADMIN_PAGE_SIZE;
  const start = () => (props.page - 1) * pageSize() + 1;
  const end = () => Math.min(props.page * pageSize(), props.total);
  const items = () => pageWindow(props.page, props.pageCount);

  return (
    <Show when={props.total > 0}>
      <nav
        aria-label="Pagination"
        class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            Showing{" "}
            <span class="font-medium text-gray-700 dark:text-gray-200">
              {start()}–{end()}
            </span>{" "}
            of <span class="font-medium text-gray-700 dark:text-gray-200">{props.total}</span>
          </p>
          <Show when={props.onPageSizeChange}>
            <label for={sizeId} class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Rows
              <select
                id={sizeId}
                value={pageSize()}
                onChange={(e) => props.onPageSizeChange?.(Number(e.currentTarget.value))}
                class="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <For each={[...ADMIN_PAGE_SIZE_OPTIONS]}>
                  {(size) => (
                    <option value={size} selected={size === pageSize()}>
                      {size}
                    </option>
                  )}
                </For>
              </select>
            </label>
          </Show>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            class={`${button} ${idle}`}
            disabled={props.page <= 1}
            onClick={() => props.onPageChange(props.page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft class="h-4 w-4" aria-hidden />
          </button>
          <For each={items()}>
            {(item) => (
              <Show
                when={item !== "ellipsis" ? item : false}
                fallback={
                  <span class="px-1 text-sm text-gray-400" aria-hidden="true">
                    …
                  </span>
                }
              >
                {(value) => (
                  <button
                    type="button"
                    aria-label={`Page ${value()}`}
                    aria-current={value() === props.page ? "page" : undefined}
                    onClick={() => props.onPageChange(value())}
                    class={`${button} ${value() === props.page ? active : idle}`}
                  >
                    {value()}
                  </button>
                )}
              </Show>
            )}
          </For>
          <button
            type="button"
            class={`${button} ${idle}`}
            disabled={props.page >= props.pageCount}
            onClick={() => props.onPageChange(props.page + 1)}
            aria-label="Next page"
          >
            <ChevronRight class="h-4 w-4" aria-hidden />
          </button>
        </div>
      </nav>
    </Show>
  );
}
