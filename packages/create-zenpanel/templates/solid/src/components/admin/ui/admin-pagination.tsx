import { ChevronLeft, ChevronRight } from "lucide-solid";
import { For, Show } from "solid-js";

export const ADMIN_PAGE_SIZE = 5;

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

function pageWindow(page: number, pageCount: number): Array<{ id: string; value: number | "ellipsis" }> {
  const values: Array<number | "ellipsis"> =
    pageCount <= 7
      ? Array.from({ length: pageCount }, (_, index) => index + 1)
      : (() => {
          const items: Array<number | "ellipsis"> = [1];
          const start = Math.max(2, page - 1);
          const end = Math.min(pageCount - 1, page + 1);
          if (start > 2) items.push("ellipsis");
          for (let index = start; index <= end; index += 1) items.push(index);
          if (end < pageCount - 1) items.push("ellipsis");
          items.push(pageCount);
          return items;
        })();
  return values.map((value, index) => ({
    id: value === "ellipsis" ? `ellipsis-${index}` : String(value),
    value,
  }));
}

type AdminPaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
};

export function AdminPagination(props: AdminPaginationProps) {
  const pageSize = () => props.pageSize ?? ADMIN_PAGE_SIZE;
  const start = () => (props.page - 1) * pageSize() + 1;
  const end = () => Math.min(props.page * pageSize(), props.total);
  const items = () => pageWindow(props.page, props.pageCount);
  const button =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const idle =
    "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
  const active = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";

  return (
    <Show when={props.total > 0}>
      <nav
        aria-label="Pagination"
        class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span class="font-medium text-gray-700 dark:text-gray-200">
            {start()}–{end()}
          </span>{" "}
          of <span class="font-medium text-gray-700 dark:text-gray-200">{props.total}</span>
        </p>
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            class={`${button} ${idle}`}
            disabled={props.page <= 1}
            onClick={() => props.onPageChange(props.page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <For each={items()}>
            {(item) => (
              <Show
                when={item.value !== "ellipsis"}
                fallback={<span class="px-1 text-sm text-gray-400">…</span>}
              >
                <button
                  type="button"
                  aria-current={item.value === props.page ? "page" : undefined}
                  onClick={() => props.onPageChange(item.value as number)}
                  class={`${button} ${item.value === props.page ? active : idle}`}
                >
                  {item.value}
                </button>
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
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </nav>
    </Show>
  );
}
