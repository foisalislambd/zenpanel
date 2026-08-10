import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | UserAccountStatus;
type ProviderFilter = "all" | "email" | "google";

const providerStyles: Record<string, string> = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

function dash(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

function ProviderBadge({ provider }: { provider: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        providerStyles[provider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800"
      }`}
    >
      {provider}
    </span>
  );
}

function UserDetailPanel({
  user,
  onClose,
}: {
  user: PortalUserRow;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40"
        aria-label="Close user details"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="admin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm">
          {[
            { label: "Provider", value: user.authProvider, capitalize: true },
            { label: "Status", value: user.status, capitalize: true },
            {
              label: "Email verified",
              value: user.emailVerified ? "Yes" : "No",
              capitalize: false,
            },
            { label: "Country", value: dash(user.country), capitalize: false },
            { label: "Phone", value: dash(user.phone), capitalize: false },
            { label: "Last IP", value: dash(user.lastIp), capitalize: false },
            {
              label: "Joined",
              value: new Date(user.createdAt).toLocaleString(),
              capitalize: false,
            },
          ].map((row) => (
            <div key={row.label}>
              <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                {row.label}
              </dt>
              <dd
                className={`mt-1 text-gray-900 dark:text-white ${
                  row.capitalize ? "capitalize" : ""
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

export type AdminUsersPageProps = {
  users: PortalUserRow[];
  onAdd?: () => void;
  onEdit?: (user: PortalUserRow) => void;
  onDelete?: (user: PortalUserRow) => void;
};

/**
 * Reusable users management page: search, filters, table, detail drawer.
 * Wire `onAdd` / `onEdit` / `onDelete` when connecting your API.
 */
export function AdminUsersPage({
  users,
  onAdd,
  onEdit,
  onDelete,
}: AdminUsersPageProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("all");
  const [selected, setSelected] = useState<PortalUserRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (providerFilter !== "all" && user.authProvider !== providerFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        user.name,
        user.email,
        user.phone ?? "",
        user.lastIp ?? "",
        user.country ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [users, query, statusFilter, providerFilter]);

  return (
    <div className="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader title="Users" actions={<AdminAddButton onClick={onAdd} />} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, IP..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
            aria-label="Search users"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AdminFilterGroup
            ariaLabel="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "banned", label: "Banned" },
            ]}
          />
          <AdminFilterGroup
            ariaLabel="Filter by provider"
            value={providerFilter}
            onChange={setProviderFilter}
            options={[
              { value: "all", label: "All" },
              { value: "email", label: "Email" },
              { value: "google", label: "Google" },
            ]}
          />
        </div>
      </div>

      <div className="admin-card w-full overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No users match your filters
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {filtered.map((user) => (
                <li key={user.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {user.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <ProviderBadge provider={user.authProvider} />
                        <StatusBadges user={user} />
                      </div>
                    </div>
                    <AdminRowActions
                      itemLabel={user.name}
                      size="md"
                      onView={() => setSelected(user)}
                      onEdit={onEdit ? () => onEdit(user) : undefined}
                      onDelete={onDelete ? () => onDelete(user) : undefined}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="admin-scrollbar hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {[
                      "User",
                      "Country",
                      "Phone",
                      "Provider",
                      "Status",
                      "Joined",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${
                          heading === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {dash(user.country)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {dash(user.phone)}
                      </td>
                      <td className="px-5 py-3.5">
                        <ProviderBadge provider={user.authProvider} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <StatusBadges user={user} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <AdminRowActions
                          itemLabel={user.name}
                          onView={() => setSelected(user)}
                          onEdit={onEdit ? () => onEdit(user) : undefined}
                          onDelete={onDelete ? () => onDelete(user) : undefined}
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

      {selected && (
        <UserDetailPanel user={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function StatusBadges({ user }: { user: PortalUserRow }) {
  return (
    <>
      {user.status === "active" ? (
        <span className="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
          Active
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15">
          Banned
        </span>
      )}
      {!user.emailVerified && (
        <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
          Unverified
        </span>
      )}
    </>
  );
}
