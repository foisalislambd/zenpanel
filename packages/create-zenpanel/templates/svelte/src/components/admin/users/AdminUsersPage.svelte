<script lang="ts">
  import { Ban, Download, Search, SearchX, ShieldCheck, X } from "lucide-svelte";
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import AdminAddButton from "@/components/admin/ui/AdminAddButton.svelte";
  import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog.svelte";
  import AdminDialog from "@/components/admin/ui/AdminDialog.svelte";
  import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.svelte";
  import AdminPagination from "@/components/admin/ui/AdminPagination.svelte";
  import AdminRowActions from "@/components/admin/ui/AdminRowActions.svelte";
  import AdminSortHeader from "@/components/admin/ui/AdminSortHeader.svelte";
  import UserAvatar from "@/components/admin/users/UserAvatar.svelte";
  import UserBadges from "@/components/admin/users/UserBadges.svelte";
  import UserEditor from "@/components/admin/users/UserEditor.svelte";
  import type { UserInput } from "@/components/admin/users/user-types";
  import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
  import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store.svelte";
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
  import { useAdminToast } from "@/lib/admin-toast.svelte";
  import { formatDate } from "@/lib/format";
  import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
  import { getSearchParams, setSearchParams } from "@/lib/router.svelte";
  import { downloadCsv, nextSort, type SortState } from "@/lib/sort";

  /**
   * Users management: search, filters, sortable table, pagination, CSV export,
   * detail drawer, invite / edit / ban / delete with confirmation.
   */
  type Props = {
    users: PortalUserRow[];
    onCreate?: (input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
    onUpdate?: (user: PortalUserRow, input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
    onDelete?: (user: PortalUserRow) => Promise<void> | void;
  };
  let { users: initialUsers, onCreate, onUpdate, onDelete }: Props = $props();

  const { toast } = useAdminToast();
  // svelte-ignore state_referenced_locally
  const store = usePreviewCollection<PortalUserRow>("users", initialUsers);

  let query = $state("");
  let statusFilter = $state<UserStatusFilter>("all");
  let providerFilter = $state("all");
  let sort = $state<SortState<UserSortKey>>({ key: "createdAt", direction: "desc" });
  let page = $state(1);
  let pageSize = $state(ADMIN_PAGE_SIZE);
  let selectedId = $state<string | null>(null);
  let editing = $state<PortalUserRow | "new" | null>(getSearchParams().get("new") === "1" ? "new" : null);
  let deleting = $state<PortalUserRow | null>(null);
  let banning = $state<PortalUserRow | null>(null);

  const selected = $derived(store.items.find((u) => u.id === selectedId) ?? null);
  const providerOptions = $derived([
    { value: "all", label: "All" },
    ...presentProviders(store.items).map((p) => ({ value: p as string, label: capitalize(p) })),
  ]);
  const statusOptions: { value: UserStatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
  ];
  const filtered = $derived(filterUsers(store.items, query, statusFilter, providerFilter, sort));
  const paged = $derived(slicePage(filtered, page, pageSize));
  const hasFilters = $derived(query.trim() !== "" || statusFilter !== "all" || providerFilter !== "all");
  const existingEmails = $derived(
    store.items
      .filter((u) => editing === "new" || (editing !== null && u.id !== editing.id))
      .map((u) => u.email.toLowerCase()),
  );
  const detailRows = $derived(
    selected
      ? [
          { label: "Country", value: dash(selected.country) },
          { label: "Phone", value: dash(selected.phone) },
          { label: "Email verified", value: selected.emailVerified ? "Yes" : "No" },
          { label: "Last IP", value: dash(selected.lastIp) },
          { label: "Joined", value: new Date(selected.createdAt).toLocaleString() },
          { label: "User ID", value: selected.id },
        ]
      : [],
  );

  const errMsg = (err: unknown) => (err instanceof Error ? err.message : undefined);
  const plainTh = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";

  function clearFilters() {
    query = "";
    statusFilter = "all";
    providerFilter = "all";
    page = 1;
  }

  function closeEditor() {
    editing = null;
    const params = getSearchParams();
    if (params.has("new")) {
      params.delete("new");
      setSearchParams(params);
    }
  }

  async function handleSave(input: UserInput) {
    const target = editing;
    try {
      if (target === "new") {
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
        store.items = [created, ...store.items];
        page = 1;
        toast({ title: "User invited", description: `An invitation was sent to ${created.email}.` });
      } else if (target) {
        const updated = onUpdate ? await onUpdate(target, input) : { ...target, ...input };
        store.items = store.items.map((u) => (u.id === target.id ? updated : u));
        toast({ title: "User updated", description: `${updated.name}'s profile was saved.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save user", description: errMsg(err) });
    }
  }

  async function confirmDelete() {
    const target = deleting;
    if (!target) return;
    deleting = null;
    try {
      await onDelete?.(target);
      store.items = store.items.filter((u) => u.id !== target.id);
      if (selectedId === target.id) selectedId = null;
      toast({ title: "User deleted", description: `${target.name} was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete user", description: errMsg(err) });
    }
  }

  async function confirmBanToggle() {
    const target = banning;
    if (!target) return;
    banning = null;
    const status: UserAccountStatus = target.status === "banned" ? "active" : "banned";
    try {
      const updated = onUpdate ? await onUpdate(target, { ...target, status }) : { ...target, status };
      store.items = store.items.map((u) => (u.id === target.id ? updated : u));
      toast({
        title: status === "banned" ? "User banned" : "User reactivated",
        description: status === "banned" ? `${target.name} can no longer sign in.` : `${target.name} can sign in again.`,
      });
    } catch (err) {
      toast({ variant: "error", title: "Could not update status", description: errMsg(err) });
    }
  }

  function exportCsv() {
    downloadCsv("users.csv", USERS_CSV_HEADERS, usersCsvRows(filtered));
    toast({ variant: "info", title: "Export ready", description: `${filtered.length} users exported to CSV.` });
  }

  function sortBy(key: UserSortKey) {
    sort = nextSort(sort, key);
    page = 1;
  }
</script>

<div class="admin-content">
  <AdminPageHeader title="Users">
    {#snippet actions()}
      <button type="button" disabled={filtered.length === 0} class="admin-btn admin-btn-secondary" onclick={exportCsv}>
        <Download class="h-4 w-4" aria-hidden={true} />
        Export
      </button>
      <AdminAddButton label="Invite user" onClick={() => (editing = "new")} />
    {/snippet}
  </AdminPageHeader>

  <div class="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
    <div class="relative w-full max-w-md">
      <Search class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden={true} />
      <input
        type="search"
        bind:value={query}
        oninput={() => (page = 1)}
        placeholder="Search name, email, phone, IP..."
        class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Search users"
      />
      {#if query}
        <button
          type="button"
          class="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
          aria-label="Clear search"
          onclick={() => {
            query = "";
            page = 1;
          }}
        >
          <X class="h-4 w-4" aria-hidden={true} />
        </button>
      {/if}
    </div>
    <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
      <AdminFilterGroup
        label="Status"
        ariaLabel="Filter by status"
        value={statusFilter}
        options={statusOptions}
        onChange={(v) => {
          statusFilter = v;
          page = 1;
        }}
      />
      <AdminFilterGroup
        label="Provider"
        ariaLabel="Filter by sign-in provider"
        value={providerFilter}
        options={providerOptions}
        onChange={(v) => {
          providerFilter = v;
          page = 1;
        }}
      />
    </div>
  </div>

  <div class="admin-card w-full overflow-hidden">
    {#if filtered.length === 0}
      <div class="flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
          <SearchX class="h-6 w-6" aria-hidden={true} />
        </span>
        <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          {store.items.length === 0 ? "No users yet" : "No users match your filters"}
        </p>
        <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {store.items.length === 0 ? "Invite your first user to get started." : "Try a different search or clear the filters."}
        </p>
        {#if hasFilters}
          <button type="button" class="admin-btn admin-btn-secondary mt-5" onclick={clearFilters}>Clear filters</button>
        {/if}
      </div>
    {:else}
      <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
        {#each paged.rows as user (user.id)}
          <li class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <button type="button" class="flex min-w-0 flex-1 gap-3 rounded-md text-left" onclick={() => (selectedId = user.id)}>
                <UserAvatar name={user.name} />
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <span class="mt-0.5 block truncate text-sm text-gray-500">{user.email}</span>
                  <span class="mt-2 flex flex-wrap items-center gap-1.5"><UserBadges {user} /></span>
                </span>
              </button>
              <AdminRowActions
                itemLabel={user.name}
                size="md"
                onView={() => (selectedId = user.id)}
                onEdit={() => (editing = user)}
                onDelete={() => (deleting = user)}
              />
            </div>
          </li>
        {/each}
      </ul>

      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="Users table">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <AdminSortHeader label="User" active={sort.key === "name"} direction={sort.direction} onSort={() => sortBy("name")} />
              <AdminSortHeader label="Country" active={sort.key === "country"} direction={sort.direction} onSort={() => sortBy("country")} />
              <th scope="col" class={plainTh}>Phone</th>
              <AdminSortHeader
                label="Provider"
                active={sort.key === "authProvider"}
                direction={sort.direction}
                onSort={() => sortBy("authProvider")}
              />
              <th scope="col" class={plainTh}>Status</th>
              <AdminSortHeader label="Joined" active={sort.key === "createdAt"} direction={sort.direction} onSort={() => sortBy("createdAt")} />
              <th scope="col" class="{plainTh} text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            {#each paged.rows as user (user.id)}
              <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-3">
                  <button type="button" class="group flex items-center gap-3 rounded-md text-left" onclick={() => (selectedId = user.id)}>
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
                <td class="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">{dash(user.phone)}</td>
                <td class="px-5 py-3"><UserBadges {user} status={false} /></td>
                <td class="px-5 py-3">
                  <div class="flex flex-wrap items-center gap-1.5"><UserBadges {user} provider={false} /></div>
                </td>
                <td class="px-5 py-3 whitespace-nowrap text-gray-500">
                  <time datetime={user.createdAt}>{formatDate(user.createdAt)}</time>
                </td>
                <td class="px-5 py-3">
                  <AdminRowActions
                    itemLabel={user.name}
                    onView={() => (selectedId = user.id)}
                    onEdit={() => (editing = user)}
                    onDelete={() => (deleting = user)}
                  />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <AdminPagination
      page={paged.page}
      pageCount={paged.pageCount}
      total={filtered.length}
      {pageSize}
      onPageChange={(p) => (page = p)}
      onPageSizeChange={(size) => {
        pageSize = size;
        page = 1;
      }}
    />
  </div>

  <AdminDialog
    open={selected !== null}
    placement="right"
    title={selected?.name ?? ""}
    description={selected?.email}
    onClose={() => (selectedId = null)}
  >
    {#if selected}
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <UserAvatar name={selected.name} />
          <div class="flex flex-wrap gap-1.5"><UserBadges user={selected} /></div>
        </div>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          {#each detailRows as row (row.label)}
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{row.label}</dt>
              <dd class="mt-1 break-words text-gray-900 dark:text-white">{row.value}</dd>
            </div>
          {/each}
        </dl>
      </div>
    {/if}
    {#snippet footer()}
      {#if selected}
        {@const current = selected}
        <button type="button" class="admin-btn admin-btn-danger-ghost" onclick={() => (deleting = current)}>Delete</button>
        <button type="button" class="admin-btn admin-btn-secondary" onclick={() => (banning = current)}>
          {#if current.status === "banned"}
            <ShieldCheck class="h-4 w-4" aria-hidden={true} /> Reactivate
          {:else}
            <Ban class="h-4 w-4" aria-hidden={true} /> Ban user
          {/if}
        </button>
        <button
          type="button"
          class="admin-btn admin-btn-primary"
          onclick={() => {
            editing = current;
            selectedId = null;
          }}>Edit user</button
        >
      {/if}
    {/snippet}
  </AdminDialog>

  {#if editing}
    {#key editing === "new" ? "new" : editing.id}
      <UserEditor user={editing === "new" ? null : editing} {existingEmails} onCancel={closeEditor} onSave={handleSave} />
    {/key}
  {/if}

  <AdminConfirmDialog
    open={deleting !== null}
    title="Delete user?"
    confirmLabel="Delete user"
    onCancel={() => (deleting = null)}
    onConfirm={() => void confirmDelete()}
  >
    <strong class="font-semibold text-gray-900 dark:text-white">{deleting?.name}</strong>
    ({deleting?.email}) and their data will be permanently removed. This cannot be undone.
  </AdminConfirmDialog>

  <AdminConfirmDialog
    open={banning !== null}
    tone={banning?.status === "banned" ? "default" : "danger"}
    title={banning?.status === "banned" ? "Reactivate user?" : "Ban user?"}
    confirmLabel={banning?.status === "banned" ? "Reactivate" : "Ban user"}
    onCancel={() => (banning = null)}
    onConfirm={() => void confirmBanToggle()}
  >
    {banning?.status === "banned"
      ? `${banning?.name} will be able to sign in again.`
      : `${banning?.name} will be signed out and blocked from signing in until reactivated.`}
  </AdminConfirmDialog>
</div>
