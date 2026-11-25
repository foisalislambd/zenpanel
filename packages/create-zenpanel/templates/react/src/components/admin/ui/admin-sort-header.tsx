import { cn } from "@/lib/cn";
import type { SortDirection } from "@/lib/sort";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

type Props = {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
  className?: string;
};

/** Clickable, accessible column header (`aria-sort` lives on the <th>). */
export function AdminSortHeader({ label, active, direction, onSort, className }: Props) {
  const Icon = !active ? ChevronsUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-5 py-3", className)}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white",
          active ? "text-gray-900 dark:text-white" : "text-gray-500",
        )}
      >
        {label}
        <Icon className={cn("h-3.5 w-3.5", !active && "opacity-60")} aria-hidden />
      </button>
    </th>
  );
}
