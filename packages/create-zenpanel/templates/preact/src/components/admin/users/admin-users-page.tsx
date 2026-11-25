import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminConfirmDialog, AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import { AdminSortHeader } from "@/components/admin/ui/admin-sort-header";
import { useAdminToast } from "@/components/admin/ui/admin-toast-provider";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { compareValues, downloadCsv, nextSort, type SortState } from "@/lib/sort";
import { Ban, Download, Search, SearchX, ShieldCheck, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

type StatusFilter = "all" | UserAccountStatus;
type SortKey = "name" | "country" | "authProvider" | "createdAt";

const providerStyles: Record<string, string> = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
};

const PROVIDERS = ["email", "google", "apple", "discord"] as const;

function dash(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
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

function Avatar({ name }: { name: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export type AdminUsersPageProps = {
  users: PortalUserRow[];
  /** Optional API handlers - omitted = in-memory preview mode. */
  onCreate?: (input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onUpdate?: (user: PortalUserRow, input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onDelete?: (user: PortalUserRow) => Promise<void> | void;
};

export type UserInput = Pick<PortalUserRow, "name" | "email" | "country" | "phone" | "status">;

/**
 * Users management: search, filters, sortable table, pagination, CSV export,
 * detail drawer, invite / edit / ban / delete with confirmation.
 */
export function AdminUsersPage({ users: initialUsers, onCreate, onUpdate, onDelete }: AdminUsersPageProps) {
  const { toast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = usePreviewCollection("users", initialUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PortalUserRow | "new" | null>(() =>
    searchParams.get("new") === "1" ? "new" : null,
  );
  const [deleting, setDeleting] = useState<PortalUserRow | null>(null);
  const [banning, setBanning] = useState<PortalUserRow | null>(null);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  const providers = useMemo(() => {
    const present = new Set(users.map((u) => u.authProvider));
    return PROVIDERS.filter((p) => present.has(p));
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (providerFilter !== "all" && user.authProvider !== providerFilter) return false;
      if (!q) return true;
      return [user.name, user.email, user.phone ?? "", user.lastIp ?? "", user.country ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
  }, [users, query, statusFilter, providerFilter, sort]);

  const { page: currentPage, pageCount, rows: pageRows } = useMemo(
    () => slicePage(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  const hasFilters = query.trim() !== "" || statusFilter !== "all" || providerFilter !== "all";

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setProviderFilter("all");
    setPage(1);
  }

  function closeEditor() {
    setEditing(null);
    if (searchParams.has("new")) {
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  }

  async function handleSave(input: UserInput) {
    try {
      if (editing === "new") {
        const created: PortalUserRow = onCreate
          ? await onCreate(input)
          : {
              id: previewId("u"),
              authProvider: "email",
              createdAt: new Date().toISOString(),
              emailVerified: false,
              lastIp: null,
              ...input,
            };
        setUsers((prev) => [created, ...prev]);
        setPage(1);
        toast({ title: "User invited", description: `An invitation was sent to ${created.email}.` });
      } else if (editing) {
        const updated = onUpdate ? await onUpdate(editing, input) : { ...editing, ...input };
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? updated : u)));
        toast({ title: "User updated", description: `${updated.name}'s profile was saved.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save user", description: err instanceof Error ? err.message : undefined });
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    try {
      await onDelete?.(target);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      if (selectedId === target.id) setSelectedId(null);
      toast({ title: "User deleted", description: `${target.name} was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete user", description: err instanceof Error ? err.message : undefined });
    }
  }

  async function confirmBanToggle() {
    if (!banning) return;
    const target = banning;
    setBanning(null);
    const status: UserAccountStatus = target.status === "banned" ? "active" : "banned";
    try {
      const input: UserInput = { ...target, status };
      const updated = onUpdate ? await onUpdate(target, input) : { ...target, status };
      setUsers((prev) => prev.map((u) => (u.id === target.id ? updated : u)));
      toast({
        title: status === "banned" ? "User banned" : "User reactivated",
        description: status === "banned" ? `${target.name} can no longer sign in.` : `${target.name} can sign in again.`,
      });
    } catch (err) {
      toast({ variant: "error", title: "Could not update status", description: err instanceof Error ? err.message : undefined });
    }
  }

  function exportCsv() {
    downloadCsv(
      "users.csv",
      ["ID", "Name", "Email", "Country", "Phone", "Provider", "Status", "Verified", "Joined"],
      filtered.map((u) => [u.id, u.name, u.email, u.country ?? "", u.phone ?? "", u.authProvider, u.status, u.emailVerified ? "yes" : "no", u.createdAt]),
    );
    toast({ variant: "info", title: "Export ready", description: `${filtered.length} users exported to CSV.` });
  }

  const sortHeader = (key: SortKey, text: string) => (
    <AdminSortHeader
      label={text}
      active={sort.key === key}
      direction={sort.direction}
      onSort={() => {
        setSort((s) => nextSort(s, key));
        setPage(1);
      }}
    />
  );

  const plainTh = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";

  return (
    <div className="admin-content">
      <AdminPageHeader
        title="Users"
        actions={
          <>
            <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className="admin-btn admin-btn-secondary">
              <Download className="h-4 w-4" aria-hidden />
              Export
            </button>
            <AdminAddButton label="Invite user" onClick={() => setEditing("new")} />
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setPage(1);
            }}
            placeholder="Search name, email, phone, IP..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search users"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <AdminFilterGroup
            label="Status"
            ariaLabel="Filter by status"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "banned", label: "Banned" },
            ]}
          />
          <AdminFilterGroup
            label="Provider"
            ariaLabel="Filter by sign-in provider"
            value={providerFilter}
            onChange={(value) => {
              setProviderFilter(value);
              setPage(1);
            }}
            options={[
              { value: "all", label: "All" },
              ...providers.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) })),
            ]}
          />
        </div>
      </div>

      <div className="admin-card w-full overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
              <SearchX className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              {users.length === 0 ? "No users yet" : "No users match your filters"}
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {users.length === 0 ? "Invite your first user to get started." : "Try a different search or clear the filters."}
            </p>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="admin-btn admin-btn-secondary mt-5">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {pageRows.map((user) => (
                <li key={user.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => setSelectedId(user.id)} className="flex min-w-0 flex-1 gap-3 rounded-md text-left">
                      <Avatar name={user.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-gray-900 dark:text-white">{user.name}</span>
                        <span className="mt-0.5 block truncate text-sm text-gray-500">{user.email}</span>
                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          <ProviderBadge provider={user.authProvider} />
                          <StatusBadges user={user} />
                        </span>
                      </span>
                    </button>
                    <AdminRowActions
                      itemLabel={user.name}
                      size="md"
                      onView={() => setSelectedId(user.id)}
                      onEdit={() => setEditing(user)}
                      onDelete={() => setDeleting(user)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="admin-scrollbar hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Users table">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {sortHeader("name", "User")}
                    {sortHeader("country", "Country")}
                    <th scope="col" className={plainTh}>Phone</th>
                    {sortHeader("authProvider", "Provider")}
                    <th scope="col" className={plainTh}>Status</th>
                    {sortHeader("createdAt", "Joined")}
                    <th scope="col" className={`${plainTh} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pageRows.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <button type="button" onClick={() => setSelectedId(user.id)} className="group flex items-center gap-3 rounded-md text-left">
                          <Avatar name={user.name} />
                          <span>
                            <span className="block font-medium text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                              {user.name}
                            </span>
                            <span className="mt-0.5 block text-sm text-gray-500">{user.email}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{dash(user.country)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">{dash(user.phone)}</td>
                      <td className="px-5 py-3">
                        <ProviderBadge provider={user.authProvider} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <StatusBadges user={user} />
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-gray-500">
                        <time dateTime={user.createdAt}>{formatDate(user.createdAt)}</time>
                      </td>
                      <td className="px-5 py-3">
                        <AdminRowActions
                          itemLabel={user.name}
                          onView={() => setSelectedId(user.id)}
                          onEdit={() => setEditing(user)}
                          onDelete={() => setDeleting(user)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <AdminPagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <AdminDialog
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        placement="right"
        title={selected?.name ?? ""}
        description={selected?.email}
        footer={
          selected && (
            <>
              <button type="button" className="admin-btn admin-btn-danger-ghost" onClick={() => setDeleting(selected)}>
                Delete
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setBanning(selected)}>
                {selected.status === "banned" ? (
                  <>
                    <ShieldCheck className="h-4 w-4" aria-hidden /> Reactivate
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" aria-hidden /> Ban user
                  </>
                )}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  setEditing(selected);
                  setSelectedId(null);
                }}
              >
                Edit user
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} />
              <div className="flex flex-wrap gap-1.5">
                <ProviderBadge provider={selected.authProvider} />
                <StatusBadges user={selected} />
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              {[
                { label: "Country", value: dash(selected.country) },
                { label: "Phone", value: dash(selected.phone) },
                { label: "Email verified", value: selected.emailVerified ? "Yes" : "No" },
                { label: "Last IP", value: dash(selected.lastIp) },
                { label: "Joined", value: new Date(selected.createdAt).toLocaleString() },
                { label: "User ID", value: selected.id },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">{row.label}</dt>
                  <dd className="mt-1 break-words text-gray-900 dark:text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </AdminDialog>

      {editing && (
        <UserEditor
          key={editing === "new" ? "new" : editing.id}
          user={editing === "new" ? null : editing}
          existingEmails={users.filter((u) => editing === "new" || u.id !== editing.id).map((u) => u.email.toLowerCase())}
          onCancel={closeEditor}
          onSave={handleSave}
        />
      )}

      <AdminConfirmDialog
        open={deleting !== null}
        title="Delete user?"
        description={
          <>
            <strong className="font-semibold text-gray-900 dark:text-white">{deleting?.name}</strong> ({deleting?.email}) and
            their data will be permanently removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete user"
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />

      <AdminConfirmDialog
        open={banning !== null}
        tone={banning?.status === "banned" ? "default" : "danger"}
        title={banning?.status === "banned" ? "Reactivate user?" : "Ban user?"}
        description={
          banning?.status === "banned"
            ? `${banning?.name} will be able to sign in again.`
            : `${banning?.name} will be signed out and blocked from signing in until reactivated.`
        }
        confirmLabel={banning?.status === "banned" ? "Reactivate" : "Ban user"}
        onCancel={() => setBanning(null)}
        onConfirm={() => void confirmBanToggle()}
      />
    </div>
  );
}

function UserEditor({
  user,
  existingEmails,
  onCancel,
  onSave,
}: {
  user: PortalUserRow | null;
  existingEmails: string[];
  onCancel: () => void;
  onSave: (input: UserInput) => Promise<void>;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [status, setStatus] = useState<UserAccountStatus>(user?.status ?? "active");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "phone", string>>>({});
  const [saving, setSaving] = useState(false);
  const id = "user-form";

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Enter the user's full name.";
    const mail = email.trim().toLowerCase();
    if (!mail) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) next.email = "Enter a valid email address.";
    else if (existingEmails.includes(mail)) next.email = "A user with this email already exists.";
    if (phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(phone.trim())) next.phone = "Enter a valid phone number.";
    setErrors(next);
    const firstError = (["name", "email", "phone"] as const).find((k) => next[k]);
    if (firstError) {
      document.getElementById(`${id}-${firstError}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        email: mail,
        country: country.trim() || null,
        phone: phone.trim() || null,
        status,
      });
    } finally {
      setSaving(false);
    }
  }

  const input = (key: "name" | "email" | "phone") => ({
    id: `${id}-${key}`,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": fieldDescribedBy(`${id}-${key}`, errors[key]),
    className: cn(adminInputClass, errors[key] && adminInputErrorClass),
  });

  return (
    <AdminDialog
      open
      onClose={onCancel}
      title={user ? "Edit user" : "Invite user"}
      description={user ? "Update profile details and account status." : "They'll receive an email invitation to set a password."}
      footer={
        <>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary">
            Cancel
          </button>
          <button type="submit" form={id} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : user ? "Save changes" : "Send invite"}
          </button>
        </>
      }
    >
      <form id={id} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <AdminFormField id={`${id}-name`} label="Full name" required error={errors.name} className="sm:col-span-2">
          <input {...input("name")} data-autofocus value={name} onChange={(e) => setName(e.currentTarget.value)} autoComplete="off" />
        </AdminFormField>
        <AdminFormField id={`${id}-email`} label="Email" required error={errors.email} className="sm:col-span-2">
          <input {...input("email")} type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} autoComplete="off" placeholder="name@example.com" />
        </AdminFormField>
        <AdminFormField id={`${id}-country`} label="Country">
          <input id={`${id}-country`} className={adminInputClass} value={country} onChange={(e) => setCountry(e.currentTarget.value)} />
        </AdminFormField>
        <AdminFormField id={`${id}-phone`} label="Phone" error={errors.phone}>
          <input {...input("phone")} type="tel" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} placeholder="+1 555 000 0000" />
        </AdminFormField>
        <AdminFormField id={`${id}-status`} label="Account status" className="sm:col-span-2">
          <select id={`${id}-status`} className={adminInputClass} value={status} onChange={(e) => setStatus(e.currentTarget.value as UserAccountStatus)}>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </AdminFormField>
      </form>
    </AdminDialog>
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
        <span className="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]">
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
