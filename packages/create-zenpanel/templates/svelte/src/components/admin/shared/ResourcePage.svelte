<script lang="ts">
  import { Download, Inbox, Search, SearchX, X } from "lucide-svelte";
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import ResourceEditor from "@/components/admin/shared/ResourceEditor.svelte";
  import ResourceStatusBadge from "@/components/admin/shared/ResourceStatusBadge.svelte";
  import type { ResourceInput } from "@/components/admin/shared/resource-types";
  import AdminAddButton from "@/components/admin/ui/AdminAddButton.svelte";
  import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog.svelte";
  import AdminDialog from "@/components/admin/ui/AdminDialog.svelte";
  import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.svelte";
  import AdminPagination from "@/components/admin/ui/AdminPagination.svelte";
  import AdminRowActions from "@/components/admin/ui/AdminRowActions.svelte";
  import AdminSortHeader from "@/components/admin/ui/AdminSortHeader.svelte";
  import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store.svelte";
  import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
  import {
    RESOURCE_STATUSES,
    capitalize,
    countResourceStatuses,
    filterResources,
    pluralize,
    type ResourceSortKey,
    type ResourceStatusFilter,
  } from "@/lib/admin-resources";
  import { useAdminToast } from "@/lib/admin-toast.svelte";
  import { formatDate } from "@/lib/format";
  import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
  import { getSearchParams, setSearchParams } from "@/lib/router.svelte";
  import { downloadCsv, nextSort, type SortState } from "@/lib/sort";

  /**
   * Reusable admin resource list page: search, status filters, sortable table,
   * pagination, CSV export, create / edit / view / delete with confirmation.
   * Without the `on*` handlers it edits an in-memory preview copy.
   */
  type Props = {
    title: string;
    resourceLabel: string;
    items: AdminResource[];
    searchPlaceholder?: string;
    titleLabel?: string;
    metaLabel?: string;
    /** Validate the title as an email address (newsletter, contacts). */
    titleIsEmail?: boolean;
    /** Rename statuses per resource, e.g. `{ published: "Paid" }`. */
    statusLabels?: Partial<Record<AdminResourceStatus, string>>;
    onCreate?: (input: ResourceInput) => Promise<AdminResource> | AdminResource;
    onUpdate?: (item: AdminResource, input: ResourceInput) => Promise<AdminResource> | AdminResource;
    onDelete?: (item: AdminResource) => Promise<void> | void;
  };

  let {
    title,
    resourceLabel,
    items: initialItems,
    searchPlaceholder = "Search title, details...",
    titleLabel = "Title",
    metaLabel = "Details",
    titleIsEmail = false,
    statusLabels,
    onCreate,
    onUpdate,
    onDelete,
  }: Props = $props();

  const { toast } = useAdminToast();
  // svelte-ignore state_referenced_locally
  const store = usePreviewCollection<AdminResource>(`resource:${resourceLabel}`, initialItems);

  let query = $state("");
  let statusFilter = $state<ResourceStatusFilter>("all");
  let sort = $state<SortState<ResourceSortKey>>({ key: "updatedAt", direction: "desc" });
  let page = $state(1);
  let pageSize = $state(ADMIN_PAGE_SIZE);
  let editing = $state<AdminResource | "new" | null>(getSearchParams().get("new") === "1" ? "new" : null);
  let viewing = $state<AdminResource | null>(null);
  let deleting = $state<AdminResource | null>(null);

  const label = $derived(resourceLabel.toLowerCase());
  const plural = $derived(pluralize(label, 2));
  const statusText = (s: AdminResourceStatus) => statusLabels?.[s] ?? capitalize(s);

  const counts = $derived(countResourceStatuses(store.items));
  const filtered = $derived(filterResources(store.items, query, statusFilter, sort));
  const paged = $derived(slicePage(filtered, page, pageSize));
  const hasFilters = $derived(query.trim() !== "" || statusFilter !== "all");
  const filterOptions = $derived([
    { value: "all" as ResourceStatusFilter, label: "All", count: counts.all },
    ...RESOURCE_STATUSES.map((s) => ({ value: s as ResourceStatusFilter, label: statusText(s), count: counts[s] })),
  ]);

  const errMsg = (err: unknown) => (err instanceof Error ? err.message : undefined);

  function clearFilters() {
    query = "";
    statusFilter = "all";
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

  async function handleSave(input: ResourceInput) {
    const target = editing;
    try {
      if (target === "new") {
        const created = onCreate
          ? await onCreate(input)
          : { id: previewId(label.slice(0, 3)), updatedAt: new Date().toISOString(), ...input };
        store.items = [created, ...store.items];
        statusFilter = "all";
        page = 1;
        toast({ title: `${capitalize(label)} created`, description: `“${created.title}” was added.` });
      } else if (target) {
        const updated = onUpdate ? await onUpdate(target, input) : { ...target, ...input, updatedAt: new Date().toISOString() };
        store.items = store.items.map((i) => (i.id === target.id ? updated : i));
        toast({ title: "Changes saved", description: `“${updated.title}” was updated.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save", description: errMsg(err) });
    }
  }

  async function handleDelete() {
    const target = deleting;
    if (!target) return;
    deleting = null;
    try {
      await onDelete?.(target);
      store.items = store.items.filter((i) => i.id !== target.id);
      toast({ title: `${capitalize(label)} deleted`, description: `“${target.title}” was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete", description: errMsg(err) });
    }
  }

  function exportCsv() {
    downloadCsv(
      `${plural}.csv`,
      ["ID", titleLabel, "Status", metaLabel, "Updated"],
      filtered.map((i) => [i.id, i.title, statusText(i.status), i.meta ?? "", i.updatedAt]),
    );
    toast({
      variant: "info",
      title: "Export ready",
      description: `${filtered.length} ${pluralize(label, filtered.length)} exported to CSV.`,
    });
  }

  function sortBy(key: ResourceSortKey) {
    sort = nextSort(sort, key);
    page = 1;
  }
</script>

<div class="admin-content">
  <AdminPageHeader {title}>
    {#snippet actions()}
      <button type="button" disabled={filtered.length === 0} class="admin-btn admin-btn-secondary" onclick={exportCsv}>
        <Download class="h-4 w-4" aria-hidden={true} />
        Export
      </button>
      <AdminAddButton label="Add {label}" onClick={() => (editing = "new")} />
    {/snippet}
  </AdminPageHeader>

  <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div class="relative w-full max-w-md">
      <Search class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden={true} />
      <input
        type="search"
        bind:value={query}
        oninput={() => (page = 1)}
        placeholder={searchPlaceholder}
        class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Search {plural}"
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
    <AdminFilterGroup
      ariaLabel="Filter by status"
      value={statusFilter}
      options={filterOptions}
      onChange={(v) => {
        statusFilter = v;
        page = 1;
      }}
    />
  </div>

  <div class="admin-card w-full overflow-hidden">
    {#if filtered.length === 0}
      <div class="flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
          {#if store.items.length === 0}
            <Inbox class="h-6 w-6" aria-hidden={true} />
          {:else}
            <SearchX class="h-6 w-6" aria-hidden={true} />
          {/if}
        </span>
        <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          {store.items.length === 0 ? `No ${plural} yet` : `No ${plural} match your filters`}
        </p>
        <p class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {store.items.length === 0 ? `Create your first ${label} to get started.` : "Try a different search term or clear the filters."}
        </p>
        <div class="mt-5">
          {#if store.items.length === 0}
            <AdminAddButton label="Add {label}" onClick={() => (editing = "new")} />
          {:else if hasFilters}
            <button type="button" class="admin-btn admin-btn-secondary" onclick={clearFilters}>Clear filters</button>
          {/if}
        </div>
      </div>
    {:else}
      <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
        {#each paged.rows as item (item.id)}
          <li class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <button type="button" class="min-w-0 flex-1 rounded-md text-left" onclick={() => (viewing = item)}>
                <p class="truncate font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p class="mt-0.5 truncate text-sm text-gray-500">{item.meta ?? "-"}</p>
                <div class="mt-2 flex items-center gap-2">
                  <ResourceStatusBadge status={item.status} label={statusText(item.status)} />
                  <span class="text-xs text-gray-500">{formatDate(item.updatedAt)}</span>
                </div>
              </button>
              <AdminRowActions
                itemLabel={item.title}
                size="md"
                onView={() => (viewing = item)}
                onEdit={() => (editing = item)}
                onDelete={() => (deleting = item)}
              />
            </div>
          </li>
        {/each}
      </ul>

      <!-- Scrollable region must be keyboard-focusable (WCAG 2.1.1). -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="{title} table">
        <table class="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <AdminSortHeader label={titleLabel} active={sort.key === "title"} direction={sort.direction} onSort={() => sortBy("title")} />
              <AdminSortHeader label="Status" active={sort.key === "status"} direction={sort.direction} onSort={() => sortBy("status")} />
              <th scope="col" class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase">{metaLabel}</th>
              <AdminSortHeader
                label="Updated"
                active={sort.key === "updatedAt"}
                direction={sort.direction}
                onSort={() => sortBy("updatedAt")}
              />
              <th scope="col" class="px-5 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            {#each paged.rows as item (item.id)}
              <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                  <button type="button" class="rounded text-left hover:text-brand-600 dark:hover:text-brand-400" onclick={() => (viewing = item)}>
                    {item.title}
                  </button>
                </td>
                <td class="px-5 py-3.5"><ResourceStatusBadge status={item.status} label={statusText(item.status)} /></td>
                <td class="max-w-[260px] truncate px-5 py-3.5 text-gray-500" title={item.meta}>{item.meta ?? "-"}</td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                  <time datetime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
                </td>
                <td class="px-5 py-3.5">
                  <AdminRowActions
                    itemLabel={item.title}
                    onView={() => (viewing = item)}
                    onEdit={() => (editing = item)}
                    onDelete={() => (deleting = item)}
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

  {#if editing}
    {#key editing === "new" ? "new" : editing.id}
      <ResourceEditor
        item={editing === "new" ? null : editing}
        {label}
        {titleLabel}
        {metaLabel}
        {titleIsEmail}
        {statusText}
        onCancel={closeEditor}
        onSave={handleSave}
      />
    {/key}
  {/if}

  <AdminDialog
    open={viewing !== null}
    placement="right"
    title={viewing?.title ?? ""}
    description={viewing ? `${capitalize(label)} · ${viewing.id}` : undefined}
    onClose={() => (viewing = null)}
  >
    {#if viewing}
      <dl class="space-y-4 text-sm">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{titleLabel}</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{viewing.title}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Status</dt>
          <dd class="mt-1"><ResourceStatusBadge status={viewing.status} label={statusText(viewing.status)} /></dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{metaLabel}</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{viewing.meta || "-"}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last updated</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{new Date(viewing.updatedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">ID</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">{viewing.id}</code>
          </dd>
        </div>
      </dl>
    {/if}
    {#snippet footer()}
      {#if viewing}
        {@const current = viewing}
        <button
          type="button"
          class="admin-btn admin-btn-danger-ghost"
          onclick={() => {
            deleting = current;
            viewing = null;
          }}>Delete</button
        >
        <button
          type="button"
          class="admin-btn admin-btn-primary"
          onclick={() => {
            editing = current;
            viewing = null;
          }}>Edit {label}</button
        >
      {/if}
    {/snippet}
  </AdminDialog>

  <AdminConfirmDialog
    open={deleting !== null}
    title="Delete {label}?"
    confirmLabel="Delete {label}"
    onCancel={() => (deleting = null)}
    onConfirm={() => void handleDelete()}
  >
    <strong class="font-semibold text-gray-900 dark:text-white">“{deleting?.title}”</strong>
    will be permanently removed. This action cannot be undone.
  </AdminConfirmDialog>
</div>
