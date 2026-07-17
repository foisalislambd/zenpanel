"use client";

import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import type { AdminResource } from "@/lib/admin-data/resources";
import { Database, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

const statusStyles: Record<AdminResource["status"], string> = {
  published:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const disabledActionTitle = "Available after you connect your API";

const irregularPlurals: Record<string, string> = {
  category: "categories",
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

type Props = {
  items: AdminResource[];
  resourceLabel: string;
};

export function ResourceList({ items, resourceLabel }: Props) {
  return (
    <div className="admin-card w-full overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {items.length} {pluralize(resourceLabel, items.length)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            UI shell — wire your API to enable create, edit, and delete.
          </p>
        </div>
        <button
          type="button"
          disabled
          title={disabledActionTitle}
          className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-brand-500/50 px-4 text-sm font-semibold text-white/90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add new
        </button>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState
          icon={Database}
          title={`No ${resourceLabel.toLowerCase()} yet`}
          description={`This page is ready for your data. Connect your backend API to load, create, and manage ${resourceLabel.toLowerCase()} from here.`}
        />
      ) : (
        <div className="admin-scrollbar overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-white/[0.02]">
                <th scope="col" className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Title
                </th>
                <th scope="col" className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Details
                </th>
                <th scope="col" className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Updated
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white/90">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.meta ?? "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        disabled
                        title={disabledActionTitle}
                        className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled
                        title={disabledActionTitle}
                        className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        aria-label={`More actions for ${item.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled
                        title={disabledActionTitle}
                        className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
