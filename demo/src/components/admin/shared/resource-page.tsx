import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import type {
  AdminResource,
  AdminResourceStatus,
} from "@/lib/admin-data/resources";
import { Database, Search } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | AdminResourceStatus;

const statusStyles: Record<AdminResourceStatus, string> = {
  published:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const irregularPlurals: Record<string, string> = {
  category: "categories",
  post: "posts",
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

export type ResourcePageProps = {
  title: string;
  resourceLabel: string;
  items: AdminResource[];
  searchPlaceholder?: string;
  /** Optional handlers — omit to keep the UI-shell preview (disabled actions) */
  onAdd?: () => void;
  onView?: (item: AdminResource) => void;
  onEdit?: (item: AdminResource) => void;
  onDelete?: (item: AdminResource) => void;
};

/**
 * Reusable admin resource list page: search, status filters, table, row actions.
 * Drop into any project and pass `items` + optional action handlers.
 */
export function ResourcePage({
  title,
  resourceLabel,
  items,
  searchPlaceholder = "Search title, details...",
  onAdd,
  onView,
  onEdit,
  onDelete,
}: ResourcePageProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [item.title, item.meta ?? "", item.id]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, statusFilter]);

  return (
    <div className="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader title={title} actions={<AdminAddButton onClick={onAdd} />} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
            aria-label={`Search ${pluralize(resourceLabel, 2)}`}
          />
        </div>

        <AdminFilterGroup
          ariaLabel="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </div>

      <div className="admin-card w-full overflow-hidden">
        {filtered.length === 0 ? (
          items.length === 0 ? (
            <AdminEmptyState
              icon={Database}
              title={`No ${resourceLabel.toLowerCase()} yet`}
              description={`This page is ready for your data. Connect your backend API to load, create, and manage ${resourceLabel.toLowerCase()} from here.`}
            />
          ) : (
            <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No {pluralize(resourceLabel, 2)} match your filters
            </div>
          )
        ) : (
          <>
            <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {filtered.map((item) => (
                <li key={item.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {item.meta ?? "—"}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <AdminRowActions
                      itemLabel={item.title}
                      size="md"
                      onView={onView ? () => onView(item) : undefined}
                      onEdit={onEdit ? () => onEdit(item) : undefined}
                      onDelete={onDelete ? () => onDelete(item) : undefined}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="admin-scrollbar hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {["Title", "Status", "Details", "Updated", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className={`px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${
                            heading === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-gray-500">
                        {item.meta ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <AdminRowActions
                          itemLabel={item.title}
                          onView={onView ? () => onView(item) : undefined}
                          onEdit={onEdit ? () => onEdit(item) : undefined}
                          onDelete={onDelete ? () => onDelete(item) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminResourceStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
