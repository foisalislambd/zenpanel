import { cn } from "@/lib/cn";
import type { SortDirection } from "@/lib/sort";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-solid";
import { Dynamic } from "solid-js/web";

/** Clickable, accessible column header (`aria-sort` lives on the <th>). */
export function AdminSortHeader(props: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
}) {
  const icon = () => (!props.active ? ChevronsUpDown : props.direction === "asc" ? ArrowUp : ArrowDown);
  return (
    <th
      scope="col"
      aria-sort={props.active ? (props.direction === "asc" ? "ascending" : "descending") : "none"}
      class="px-5 py-3"
    >
      <button
        type="button"
        class={cn(
          "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white",
          props.active ? "text-gray-900 dark:text-white" : "text-gray-500",
        )}
        onClick={() => props.onSort()}
      >
        {props.label}
        <Dynamic component={icon()} class={cn("h-3.5 w-3.5", !props.active && "opacity-60")} aria-hidden />
      </button>
    </th>
  );
}
