<script lang="ts">
  import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-svelte";
  import { cn } from "@/lib/cn";
  import type { SortDirection } from "@/lib/sort";

  /** Clickable, accessible column header (`aria-sort` lives on the <th>). */
  type Props = { label: string; active: boolean; direction: SortDirection; onSort: () => void };
  let { label, active, direction, onSort }: Props = $props();

  const Icon = $derived(!active ? ChevronsUpDown : direction === "asc" ? ArrowUp : ArrowDown);
</script>

<th scope="col" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"} class="px-5 py-3">
  <button
    type="button"
    class={cn(
      "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white",
      active ? "text-gray-900 dark:text-white" : "text-gray-500",
    )}
    onclick={onSort}
  >
    {label}
    <Icon class={cn("h-3.5 w-3.5", !active && "opacity-60")} aria-hidden={true} />
  </button>
</th>
