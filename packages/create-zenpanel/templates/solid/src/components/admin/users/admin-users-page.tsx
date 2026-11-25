import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminConfirmDialog } from "@/components/admin/ui/admin-confirm-dialog";
import { AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import { AdminSortHeader } from "@/components/admin/ui/admin-sort-header";
import { UserAvatar } from "@/components/admin/users/user-avatar";
import { UserBadges } from "@/components/admin/users/user-badges";
import { UserEditor, type UserInput } from "@/components/admin/users/user-editor";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store";
import {
  USERS_CSV_HEADERS,
  capitalize,
  dash,
  filterUsers,
  presentProviders,
  usersCsvRows,
  type UserSortKey,
  type UserStatusFilter,
} from "@/lib/admin-resources";
import { useAdminToast } from "@/lib/admin-toast";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { downloadCsv, nextSort, type SortState } from "@/lib/sort";
import { useSearchParams } from "@solidjs/router";
import { Ban, Download, Search, SearchX, ShieldCheck, X } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";

export type { UserInput };

export type AdminUsersPageProps = {
  users: PortalUserRow[];
  /** Persist changes to your API. Omit to edit an in-memory preview copy. */
  onCreate?: (input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onUpdate?: (user: PortalUserRow, input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onDelete?: (user: PortalUserRow) => Promise<void> | void;
};

const plainTh = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";
const statusOptions: { value: UserStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
];

/**
 * Users management: search, filters, sortable table, pagination, CSV export,
 * detail drawer, invite / edit / ban / delete with confirmation.
 */
export function AdminUsersPage(props: AdminUsersPageProps) {
  const { toast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = usePreviewCollection<PortalUserRow>("users", props.users);

  const [query, setQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<UserStatusFilter>("all");
  const [providerFilter, setProviderFilter] = createSignal("all");
  const [sort, setSort] = createSignal<SortState<UserSortKey>>({ key: "createdAt", direction: "desc" });
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(ADMIN_PAGE_SIZE);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [editing, setEditing] = createSignal<PortalUserRow | "new" | null>(searchParams.new === "1" ? "new" : null);
  const [deleting, setDeleting] = createSignal<PortalUserRow | null>(null);
  const [banning, setBanning] = createSignal<PortalUserRow | null>(null);

  const selected = createMemo(() => users().find((u) => u.id === selectedId()) ?? null);
  const providerOptions = createMemo(() => [
    { value: "all", label: "All" },
    ...presentProviders(users()).map((p) => ({ value: p as string, label: capitalize(p) })),
  ]);
  const filtered = createMemo(() => filterUsers(users(), query(), statusFilter(), providerFilter(), sort()));
  const paged = createMemo(() => slicePage(filtered(), page(), pageSize()));
  const hasFilters = () => query().trim() !== "" || statusFilter() !== "all" || providerFilter() !== "all";
  const existingEmails = createMemo(() => {
    const target = editing();
    return users()
      .filter((u) => target === "new" || (target !== null && u.id !== target.id))
      .map((u) => u.email.toLowerCase());
  });
  const detailRows = (user: PortalUserRow) => [
    { label: "Country", value: dash(user.country) },
    { label: "Phone", value: dash(user.phone) },
    { label: "Email verified", value: user.emailVerified ? "Yes" : "No" },
    { label: "Last IP", value: dash(user.lastIp) },
    { label: "Joined", value: new Date(user.createdAt).toLocaleString() },
    { label: "User ID", value: user.id },
  ];

  const errMsg = (err: unknown) => (err instanceof Error ? err.message : undefined);

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setProviderFilter("all");
    setPage(1);
  }

  function closeEditor() {
    setEditing(null);
    if (searchParams.new) setSearchParams({ new: undefined }, { replace: true });
  }

  async function handleSave(input: UserInput) {
    const target = editing();
    try {
      if (target === "new") {
        const created: PortalUserRow = props.onCreate
          ? await props.onCreate(input)
          : {
              id: previewId("u"),
              authProvider: "email",
              createdAt: new Date().toISOString(),
              emailVerified: false,
              lastIp: null,
              ...input,
            };
        setUsers((list) => [created, ...list]);
        setPage(1);
        toast({ title: "User invited", description: `An invitation was sent to ${created.email}.` });
      } else if (target) {
        const updated = props.onUpdate ? await props.onUpdate(target, input) : { ...target, ...input };
        setUsers((list) => list.map((u) => (u.id === target.id ? updated : u)));
        toast({ title: "User updated", description: `${updated.name}'s profile was saved.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save user", description: errMsg(err) });
    }
  }

  async function confirmDelete() {
    const target = deleting();
    if (!target) return;
    setDeleting(null);
    try {
      await props.onDelete?.(target);
      setUsers((list) => list.filter((u) => u.id !== target.id));
      if (selectedId() === target.id) setSelectedId(null);
      toast({ title: "User deleted", description: `${target.name} was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete user", description: errMsg(err) });
    }
  }

  async function confirmBanToggle() {
    const target = banning();
    if (!target) return;
    setBanning(null);
    const status: UserAccountStatus = target.status === "banned" ? "active" : "banned";
    try {
      const updated = props.onUpdate ? await props.onUpdate(target, { ...target, status }) : { ...target, status };
      setUsers((list) => list.map((u) => (u.id === target.id ? updated : u)));
      toast({
        title: status === "banned" ? "User banned" : "User reactivated",
        description: status === "banned" ? `${target.name} can no longer sign in.` : `${target.name} can sign in again.`,
      });
    } catch (err) {
      toast({ variant: "error", title: "Could not update status", description: errMsg(err) });
    }
  }

  function exportCsv() {
    const rows = filtered();
    downloadCsv("users.csv", USERS_CSV_HEADERS, usersCsvRows(rows));
    toast({ variant: "info", title: "Export ready", description: `${rows.length} users exported to CSV.` });
  }

  function sortBy(key: UserSortKey) {
    setSort((s) => nextSort(s, key));
    setPage(1);
  }

  const sortHeader = (label: string, key: UserSortKey) => (
    <AdminSortHeader
      label={label}
      active={sort().key === key}
      direction={sort().direction}
      onSort={() => sortBy(key)}
    />
  );

  return (
    <div class="admin-content">
      <AdminPageHeader
        title="Users"
        actions={
          <>
            <button
              type="button"
              disabled={filtered().length === 0}
              class="admin-btn admin-btn-secondary"
              onClick={exportCsv}
            >
              <Download class="h-4 w-4" aria-hidden />
              Export
            </button>
            <AdminAddButton label="Invite user" onClick={() => setEditing("new")} />
          </>
        }
      />

      <div class="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="relative w-full max-w-md">
          <Search
            class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={query()}
            onInput={(e) => {
              setQuery(e.currentTarget.value);
              setPage(1);
            }}
            placeholder="Search name, email, phone, IP..."
            class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search users"
          />
          <Show when={query()}>
            <button
              type="button"
              class="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
            >
              <X class="h-4 w-4" aria-hidden />
            </button>
          </Show>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
          <AdminFilterGroup
            label="Status"
            ariaLabel="Filter by status"
            value={statusFilter()}
            options={statusOptions}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />
          <AdminFilterGroup
            label="Provider"
            ariaLabel="Filter by sign-in provider"
            value={providerFilter()}
            options={providerOptions()}
            onChange={(v) => {
              setProviderFilter(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div class="admin-card w-full overflow-hidden">
        <Show
          when={filtered().length > 0}
          fallback={
            <div class="flex flex-col items-center px-6 py-16 text-center">
              <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                <SearchX class="h-6 w-6" aria-hidden />
              </span>
              <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                {users().length === 0 ? "No users yet" : "No users match your filters"}
              </p>
              <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                {users().length === 0
                  ? "Invite your first user to get started."
                  : "Try a different search or clear the filters."}
              </p>
              <Show when={hasFilters()}>
                <button type="button" class="admin-btn admin-btn-secondary mt-5" onClick={clearFilters}>
                  Clear filters
                </button>
              </Show>
            </div>
          }
        >
          <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            <For each={paged().rows}>
              {(user) => (
                <li class="px-4 py-3.5">
                  <div class="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      class="flex min-w-0 flex-1 gap-3 rounded-md text-left"
                      onClick={() => setSelectedId(user.id)}
                    >
                      <UserAvatar name={user.name} />
                      <span class="min-w-0 flex-1">
                        <span class="block truncate font-medium text-gray-900 dark:text-white">{user.name}</span>
                        <span class="mt-0.5 block truncate text-sm text-gray-500">{user.email}</span>
                        <span class="mt-2 flex flex-wrap items-center gap-1.5">
                          <UserBadges user={user} />
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
              )}
            </For>
          </ul>

          <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="Users table">
            <table class="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  {sortHeader("User", "name")}
                  {sortHeader("Country", "country")}
                  <th scope="col" class={plainTh}>
                    Phone
                  </th>
                  {sortHeader("Provider", "authProvider")}
                  <th scope="col" class={plainTh}>
                    Status
                  </th>
                  {sortHeader("Joined", "createdAt")}
                  <th scope="col" class={`${plainTh} text-right`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <For each={paged().rows}>
                  {(user) => (
                    <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td class="px-5 py-3">
                        <button
                          type="button"
                          class="group flex items-center gap-3 rounded-md text-left"
                          onClick={() => setSelectedId(user.id)}
                        >
                          <UserAvatar name={user.name} />
                          <span>
                            <span class="block font-medium text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                              {user.name}
                            </span>
                            <span class="mt-0.5 block text-sm text-gray-500">{user.email}</span>
                          </span>
                        </button>
                      </td>
                      <td class="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{dash(user.country)}</td>
                      <td class="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">
                        {dash(user.phone)}
                      </td>
                      <td class="px-5 py-3">
                        <UserBadges user={user} status={false} />
                      </td>
                      <td class="px-5 py-3">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <UserBadges user={user} provider={false} />
                        </div>
                      </td>
                      <td class="px-5 py-3 whitespace-nowrap text-gray-500">
                        <time datetime={user.createdAt}>{formatDate(user.createdAt)}</time>
                      </td>
                      <td class="px-5 py-3">
                        <AdminRowActions
                          itemLabel={user.name}
                          onView={() => setSelectedId(user.id)}
                          onEdit={() => setEditing(user)}
                          onDelete={() => setDeleting(user)}
                        />
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
        <AdminPagination
          page={paged().page}
          pageCount={paged().pageCount}
          total={filtered().length}
          pageSize={pageSize()}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <AdminDialog
        open={selected() !== null}
        placement="right"
        title={selected()?.name ?? ""}
        description={selected()?.email}
        onClose={() => setSelectedId(null)}
        footer={
          <Show when={selected()}>
            {(current) => (
              <>
                <button type="button" class="admin-btn admin-btn-danger-ghost" onClick={() => setDeleting(current())}>
                  Delete
                </button>
                <button type="button" class="admin-btn admin-btn-secondary" onClick={() => setBanning(current())}>
                  <Show
                    when={current().status === "banned"}
                    fallback={
                      <>
                        <Ban class="h-4 w-4" aria-hidden /> Ban user
                      </>
                    }
                  >
                    <ShieldCheck class="h-4 w-4" aria-hidden /> Reactivate
                  </Show>
                </button>
                <button
                  type="button"
                  class="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditing(current());
                    setSelectedId(null);
                  }}
                >
                  Edit user
                </button>
              </>
            )}
          </Show>
        }
      >
        <Show when={selected()}>
          {(user) => (
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <UserAvatar name={user().name} />
                <div class="flex flex-wrap gap-1.5">
                  <UserBadges user={user()} />
                </div>
              </div>
              <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <For each={detailRows(user())}>
                  {(row) => (
                    <div>
                      <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{row.label}</dt>
                      <dd class="mt-1 break-words text-gray-900 dark:text-white">{row.value}</dd>
                    </div>
                  )}
                </For>
              </dl>
            </div>
          )}
        </Show>
      </AdminDialog>

      <Show when={editing()} keyed>
        {(target) => (
          <UserEditor
            user={target === "new" ? null : target}
            existingEmails={existingEmails()}
            onCancel={closeEditor}
            onSave={handleSave}
          />
        )}
      </Show>

      <AdminConfirmDialog
        open={deleting() !== null}
        title="Delete user?"
        confirmLabel="Delete user"
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      >
        <strong class="font-semibold text-gray-900 dark:text-white">{deleting()?.name}</strong> ({deleting()?.email})
        and their data will be permanently removed. This cannot be undone.
      </AdminConfirmDialog>

      <AdminConfirmDialog
        open={banning() !== null}
        tone={banning()?.status === "banned" ? "default" : "danger"}
        title={banning()?.status === "banned" ? "Reactivate user?" : "Ban user?"}
        confirmLabel={banning()?.status === "banned" ? "Reactivate" : "Ban user"}
        onCancel={() => setBanning(null)}
        onConfirm={() => void confirmBanToggle()}
      >
        {banning()?.status === "banned"
          ? `${banning()?.name} will be able to sign in again.`
          : `${banning()?.name} will be signed out and blocked from signing in until reactivated.`}
      </AdminConfirmDialog>
    </div>
  );
}
