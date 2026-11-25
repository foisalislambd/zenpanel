<script lang="ts">
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import { pageWindow } from "@/lib/admin-resources";
  import { ADMIN_PAGE_SIZE, ADMIN_PAGE_SIZE_OPTIONS } from "@/lib/pagination";

  type Props = {
    page: number;
    pageCount: number;
    total: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    /** Show the "Rows" select when provided. */
    onPageSizeChange?: (size: number) => void;
  };

  let { page, pageCount, total, pageSize = ADMIN_PAGE_SIZE, onPageChange, onPageSizeChange }: Props = $props();

  const sizeId = $props.id();
  const start = $derived((page - 1) * pageSize + 1);
  const end = $derived(Math.min(page * pageSize, total));
  const items = $derived(pageWindow(page, pageCount));

  const button =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const idle =
    "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
  const active = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";
</script>

{#if total > 0}
  <nav
    aria-label="Pagination"
    class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
  >
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
        Showing
        <span class="font-medium text-gray-700 dark:text-gray-200">{start}–{end}</span>
        of <span class="font-medium text-gray-700 dark:text-gray-200">{total}</span>
      </p>
      {#if onPageSizeChange}
        <label for={sizeId} class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          Rows
          <select
            id={sizeId}
            value={pageSize}
            onchange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
            class="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {#each ADMIN_PAGE_SIZE_OPTIONS as size (size)}
              <option value={size}>{size}</option>
            {/each}
          </select>
        </label>
      {/if}
    </div>
    <div class="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        class="{button} {idle}"
        disabled={page <= 1}
        aria-label="Previous page"
        onclick={() => onPageChange(page - 1)}
      >
        <ChevronLeft class="h-4 w-4" aria-hidden={true} />
      </button>
      {#each items as item, index (item === "ellipsis" ? `e-${index}` : item)}
        {#if item === "ellipsis"}
          <span class="px-1 text-sm text-gray-400" aria-hidden="true">…</span>
        {:else}
          <button
            type="button"
            aria-label="Page {item}"
            aria-current={item === page ? "page" : undefined}
            class="{button} {item === page ? active : idle}"
            onclick={() => onPageChange(item)}
          >
            {item}
          </button>
        {/if}
      {/each}
      <button
        type="button"
        class="{button} {idle}"
        disabled={page >= pageCount}
        aria-label="Next page"
        onclick={() => onPageChange(page + 1)}
      >
        <ChevronRight class="h-4 w-4" aria-hidden={true} />
      </button>
    </div>
  </nav>
{/if}
