import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { ResourceEditor, type ResourceInput } from "@/components/admin/shared/resource-editor";
import { ResourceStatusBadge } from "@/components/admin/shared/resource-status-badge";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminConfirmDialog } from "@/components/admin/ui/admin-confirm-dialog";
import { AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import { AdminSortHeader } from "@/components/admin/ui/admin-sort-header";
import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store";
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
import { useAdminToast } from "@/lib/admin-toast";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { downloadCsv, nextSort, type SortState } from "@/lib/sort";
import { useSearchParams } from "@solidjs/router";
import { Download, Inbox, Search, SearchX, X } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";

export type { ResourceInput };

export type ResourcePageProps = {
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
  /** Persist changes to your API. Omit to edit an in-memory preview copy. */
  onCreate?: (input: ResourceInput) => Promise<AdminResource> | AdminResource;
  onUpdate?: (item: AdminResource, input: ResourceInput) => Promise<AdminResource> | AdminResource;
  onDelete?: (item: AdminResource) => Promise<void> | void;
};

const thClass = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";
const dtClass = "text-xs font-medium tracking-wide text-gray-500 uppercase";

/**
 * Reusable admin resource list page: search, status filters, sortable table,
 * pagination, CSV export, create / edit / view / delete with confirmation.
 */
export function ResourcePage(props: ResourcePageProps) {
  const { toast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = usePreviewCollection<AdminResource>(`resource:${props.resourceLabel}`, props.items);

  const [query, setQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<ResourceStatusFilter>("all");
  const [sort, setSort] = createSignal<SortState<ResourceSortKey>>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(ADMIN_PAGE_SIZE);
  const [editing, setEditing] = createSignal<AdminResource | "new" | null>(
    searchParams.new === "1" ? "new" : null,
  );
  const [viewing, setViewing] = createSignal<AdminResource | null>(null);
  const [deleting, setDeleting] = createSignal<AdminResource | null>(null);

  const label = () => props.resourceLabel.toLowerCase();
  const plural = () => pluralize(label(), 2);
  const titleLabel = () => props.titleLabel ?? "Title";
  const metaLabel = () => props.metaLabel ?? "Details";
  const statusText = (s: AdminResourceStatus) => props.statusLabels?.[s] ?? capitalize(s);

  const counts = createMemo(() => countResourceStatuses(items()));
  const filtered = createMemo(() => filterResources(items(), query(), statusFilter(), sort()));
  const paged = createMemo(() => slicePage(filtered(), page(), pageSize()));
  const hasFilters = () => query().trim() !== "" || statusFilter() !== "all";
  const filterOptions = createMemo(() => [
    { value: "all" as ResourceStatusFilter, label: "All", count: counts().all },
    ...RESOURCE_STATUSES.map((s) => ({ value: s as ResourceStatusFilter, label: statusText(s), count: counts()[s] })),
  ]);

  const errMsg = (err: unknown) => (err instanceof Error ? err.message : undefined);

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPage(1);
  }

  function closeEditor() {
    setEditing(null);
    if (searchParams.new) setSearchParams({ new: undefined }, { replace: true });
  }

  async function handleSave(input: ResourceInput) {
    const target = editing();
    try {
      if (target === "new") {
        const created = props.onCreate
          ? await props.onCreate(input)
          : { id: previewId(label().slice(0, 3)), updatedAt: new Date().toISOString(), ...input };
        setItems((list) => [created, ...list]);
        setStatusFilter("all");
        setPage(1);
        toast({ title: `${capitalize(label())} created`, description: `“${created.title}” was added.` });
      } else if (target) {
        const updated = props.onUpdate
          ? await props.onUpdate(target, input)
          : { ...target, ...input, updatedAt: new Date().toISOString() };
        setItems((list) => list.map((i) => (i.id === target.id ? updated : i)));
        toast({ title: "Changes saved", description: `“${updated.title}” was updated.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save", description: errMsg(err) });
    }
  }

  async function handleDelete() {
    const target = deleting();
    if (!target) return;
    setDeleting(null);
    try {
      await props.onDelete?.(target);
      setItems((list) => list.filter((i) => i.id !== target.id));
      toast({ title: `${capitalize(label())} deleted`, description: `“${target.title}” was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete", description: errMsg(err) });
    }
  }

  function exportCsv() {
    const rows = filtered();
    downloadCsv(
      `${plural()}.csv`,
      ["ID", titleLabel(), "Status", metaLabel(), "Updated"],
      rows.map((i) => [i.id, i.title, statusText(i.status), i.meta ?? "", i.updatedAt]),
    );
    toast({
      variant: "info",
      title: "Export ready",
      description: `${rows.length} ${pluralize(label(), rows.length)} exported to CSV.`,
    });
  }

  function sortBy(key: ResourceSortKey) {
    setSort((s) => nextSort(s, key));
    setPage(1);
  }

  const addButton = () => <AdminAddButton label={`Add ${label()}`} onClick={() => setEditing("new")} />;

  return (
    <div class="admin-content">
      <AdminPageHeader
        title={props.title}
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
            {addButton()}
          </>
        }
      />

      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            placeholder={props.searchPlaceholder ?? "Search title, details..."}
            class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            aria-label={`Search ${plural()}`}
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
        <AdminFilterGroup
          ariaLabel="Filter by status"
          value={statusFilter()}
          options={filterOptions()}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        />
      </div>

      <div class="admin-card w-full overflow-hidden">
        <Show
          when={filtered().length > 0}
          fallback={
            <div class="flex flex-col items-center px-6 py-16 text-center">
              <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                <Show when={items().length === 0} fallback={<SearchX class="h-6 w-6" aria-hidden />}>
                  <Inbox class="h-6 w-6" aria-hidden />
                </Show>
              </span>
              <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                {items().length === 0 ? `No ${plural()} yet` : `No ${plural()} match your filters`}
              </p>
              <p class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {items().length === 0
                  ? `Create your first ${label()} to get started.`
                  : "Try a different search term or clear the filters."}
              </p>
              <div class="mt-5">
                <Show
                  when={items().length === 0}
                  fallback={
                    <Show when={hasFilters()}>
                      <button type="button" class="admin-btn admin-btn-secondary" onClick={clearFilters}>
                        Clear filters
                      </button>
                    </Show>
                  }
                >
                  {addButton()}
                </Show>
              </div>
            </div>
          }
        >
          <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            <For each={paged().rows}>
              {(item) => (
                <li class="px-4 py-3.5">
                  <div class="flex items-start justify-between gap-3">
                    <button type="button" class="min-w-0 flex-1 rounded-md text-left" onClick={() => setViewing(item)}>
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
                      onView={() => setViewing(item)}
                      onEdit={() => setEditing(item)}
                      onDelete={() => setDeleting(item)}
                    />
                  </div>
                </li>
              )}
            </For>
          </ul>

          {/* Scrollable region must be keyboard-focusable (WCAG 2.1.1). */}
          <div
            class="admin-scrollbar hidden overflow-x-auto md:block"
            tabindex="0"
            role="region"
            aria-label={`${props.title} table`}
          >
            <table class="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <AdminSortHeader
                    label={titleLabel()}
                    active={sort().key === "title"}
                    direction={sort().direction}
                    onSort={() => sortBy("title")}
                  />
                  <AdminSortHeader
                    label="Status"
                    active={sort().key === "status"}
                    direction={sort().direction}
                    onSort={() => sortBy("status")}
                  />
                  <th scope="col" class={thClass}>
                    {metaLabel()}
                  </th>
                  <AdminSortHeader
                    label="Updated"
                    active={sort().key === "updatedAt"}
                    direction={sort().direction}
                    onSort={() => sortBy("updatedAt")}
                  />
                  <th scope="col" class={`${thClass} text-right`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <For each={paged().rows}>
                  {(item) => (
                    <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                        <button
                          type="button"
                          class="rounded text-left hover:text-brand-600 dark:hover:text-brand-400"
                          onClick={() => setViewing(item)}
                        >
                          {item.title}
                        </button>
                      </td>
                      <td class="px-5 py-3.5">
                        <ResourceStatusBadge status={item.status} label={statusText(item.status)} />
                      </td>
                      <td class="max-w-[260px] truncate px-5 py-3.5 text-gray-500" title={item.meta}>
                        {item.meta ?? "-"}
                      </td>
                      <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                        <time datetime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
                      </td>
                      <td class="px-5 py-3.5">
                        <AdminRowActions
                          itemLabel={item.title}
                          onView={() => setViewing(item)}
                          onEdit={() => setEditing(item)}
                          onDelete={() => setDeleting(item)}
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

      <Show when={editing()} keyed>
        {(target) => (
          <ResourceEditor
            item={target === "new" ? null : target}
            label={label()}
            titleLabel={titleLabel()}
            metaLabel={metaLabel()}
            titleIsEmail={props.titleIsEmail ?? false}
            statusText={statusText}
            onCancel={closeEditor}
            onSave={handleSave}
          />
        )}
      </Show>

      <AdminDialog
        open={viewing() !== null}
        placement="right"
        title={viewing()?.title ?? ""}
        description={viewing() ? `${capitalize(label())} · ${viewing()!.id}` : undefined}
        onClose={() => setViewing(null)}
        footer={
          <>
            <button
              type="button"
              class="admin-btn admin-btn-danger-ghost"
              onClick={() => {
                setDeleting(viewing());
                setViewing(null);
              }}
            >
              Delete
            </button>
            <button
              type="button"
              class="admin-btn admin-btn-primary"
              onClick={() => {
                setEditing(viewing());
                setViewing(null);
              }}
            >
              Edit {label()}
            </button>
          </>
        }
      >
        <Show when={viewing()}>
          {(v) => (
            <dl class="space-y-4 text-sm">
              <div>
                <dt class={dtClass}>{titleLabel()}</dt>
                <dd class="mt-1 text-gray-900 dark:text-white">{v().title}</dd>
              </div>
              <div>
                <dt class={dtClass}>Status</dt>
                <dd class="mt-1">
                  <ResourceStatusBadge status={v().status} label={statusText(v().status)} />
                </dd>
              </div>
              <div>
                <dt class={dtClass}>{metaLabel()}</dt>
                <dd class="mt-1 text-gray-900 dark:text-white">{v().meta || "-"}</dd>
              </div>
              <div>
                <dt class={dtClass}>Last updated</dt>
                <dd class="mt-1 text-gray-900 dark:text-white">{new Date(v().updatedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt class={dtClass}>ID</dt>
                <dd class="mt-1 text-gray-900 dark:text-white">
                  <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">{v().id}</code>
                </dd>
              </div>
            </dl>
          )}
        </Show>
      </AdminDialog>

      <AdminConfirmDialog
        open={deleting() !== null}
        title={`Delete ${label()}?`}
        confirmLabel={`Delete ${label()}`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      >
        <strong class="font-semibold text-gray-900 dark:text-white">“{deleting()?.title}”</strong> will be
        permanently removed. This action cannot be undone.
      </AdminConfirmDialog>
    </div>
  );
}
