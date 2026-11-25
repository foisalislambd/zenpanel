import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminAddButton } from "@/components/admin/ui/admin-add-button";
import { AdminConfirmDialog, AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFilterGroup } from "@/components/admin/ui/admin-filter-group";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { AdminRowActions } from "@/components/admin/ui/admin-row-actions";
import { AdminSortHeader } from "@/components/admin/ui/admin-sort-header";
import { useAdminToast } from "@/components/admin/ui/admin-toast-provider";
import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
import { previewId, usePreviewCollection } from "@/lib/admin-data/preview-store";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { compareValues, downloadCsv, nextSort, type SortState } from "@/lib/sort";
import { Download, Inbox, Search, SearchX, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

type StatusFilter = "all" | AdminResourceStatus;
type SortKey = "title" | "status" | "updatedAt";

const statusStyles: Record<AdminResourceStatus, string> = {
  published: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  archived: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const STATUSES: AdminResourceStatus[] = ["published", "draft", "archived"];

const irregularPlurals: Record<string, string> = {
  category: "categories",
  post: "posts",
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type ResourcePageProps = {
  title: string;
  resourceLabel: string;
  items: AdminResource[];
  searchPlaceholder?: string;
  /** Labels for the generic fields (e.g. "Email" instead of "Title"). */
  titleLabel?: string;
  metaLabel?: string;
  /** Rename statuses per resource, e.g. `{ published: "Paid" }` for orders. */
  /** Validate the title field as an email address (newsletter, contacts). */
  titleIsEmail?: boolean;
  statusLabels?: Partial<Record<AdminResourceStatus, string>>;
  /**
   * Optional API handlers. When omitted, the page manages an in-memory copy
   * (preview mode) so add / edit / delete work end-to-end in the demo.
   */
  onCreate?: (input: ResourceInput) => Promise<AdminResource> | AdminResource;
  onUpdate?: (item: AdminResource, input: ResourceInput) => Promise<AdminResource> | AdminResource;
  onDelete?: (item: AdminResource) => Promise<void> | void;
};

export type ResourceInput = Pick<AdminResource, "title" | "status" | "meta">;

/**
 * Reusable admin resource list page: search, status filters, sortable table,
 * pagination, CSV export, create / edit / view / delete with confirmation.
 */
export function ResourcePage({
  title,
  resourceLabel,
  items: initialItems,
  searchPlaceholder = "Search title, details...",
  titleLabel = "Title",
  metaLabel = "Details",
  statusLabels,
  titleIsEmail = false,
  onCreate,
  onUpdate,
  onDelete,
}: ResourcePageProps) {
  const { toast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = usePreviewCollection(`resource:${resourceLabel}`, initialItems);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortState<SortKey>>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [editing, setEditing] = useState<AdminResource | "new" | null>(() =>
    searchParams.get("new") === "1" ? "new" : null,
  );
  const [viewing, setViewing] = useState<AdminResource | null>(null);
  const [deleting, setDeleting] = useState<AdminResource | null>(null);

  const label = resourceLabel.toLowerCase();
  const statusText = (s: AdminResourceStatus) => statusLabels?.[s] ?? capitalize(s);
  const plural = pluralize(label, 2);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: items.length, published: 0, draft: 0, archived: 0 };
    items.forEach((i) => (c[i.status] += 1));
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return [item.title, item.meta ?? "", item.id].join(" ").toLowerCase().includes(q);
    });
    return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
  }, [items, query, statusFilter, sort]);

  const { page: currentPage, pageCount, rows: pageRows } = useMemo(
    () => slicePage(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  const hasFilters = query.trim() !== "" || statusFilter !== "all";

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPage(1);
  }

  function closeEditor() {
    setEditing(null);
    if (searchParams.has("new")) {
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  }

  async function handleSave(input: ResourceInput) {
    try {
      if (editing === "new") {
        const created = onCreate
          ? await onCreate(input)
          : { id: previewId(label.slice(0, 3)), updatedAt: new Date().toISOString(), ...input };
        setItems((prev) => [created, ...prev]);
        setStatusFilter("all");
        setPage(1);
        toast({ title: `${capitalize(label)} created`, description: `“${created.title}” was added.` });
      } else if (editing) {
        const updated = onUpdate
          ? await onUpdate(editing, input)
          : { ...editing, ...input, updatedAt: new Date().toISOString() };
        setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)));
        toast({ title: "Changes saved", description: `“${updated.title}” was updated.` });
      }
      closeEditor();
    } catch (err) {
      toast({ variant: "error", title: "Could not save", description: err instanceof Error ? err.message : undefined });
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    try {
      await onDelete?.(target);
      setItems((prev) => prev.filter((i) => i.id !== target.id));
      toast({ title: `${capitalize(label)} deleted`, description: `“${target.title}” was removed.` });
    } catch (err) {
      toast({ variant: "error", title: "Could not delete", description: err instanceof Error ? err.message : undefined });
    }
  }

  function exportCsv() {
    downloadCsv(
      `${plural}.csv`,
      ["ID", titleLabel, "Status", metaLabel, "Updated"],
      filtered.map((i) => [i.id, i.title, statusText(i.status), i.meta ?? "", i.updatedAt]),
    );
    toast({ variant: "info", title: "Export ready", description: `${filtered.length} ${pluralize(label, filtered.length)} exported to CSV.` });
  }

  const sortHeader = (key: SortKey, text: string, className?: string) => (
    <AdminSortHeader
      label={text}
      active={sort.key === key}
      direction={sort.direction}
      onSort={() => {
        setSort((s) => nextSort(s, key));
        setPage(1);
      }}
      className={className}
    />
  );

  return (
    <div className="admin-content">
      <AdminPageHeader
        title={title}
        actions={
          <>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="admin-btn admin-btn-secondary"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export
            </button>
            <AdminAddButton label={`Add ${label}`} onClick={() => setEditing("new")} />
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            aria-label={`Search ${plural}`}
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

        <AdminFilterGroup
          ariaLabel="Filter by status"
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          options={[
            { value: "all", label: "All", count: counts.all },
            ...STATUSES.map((s) => ({ value: s, label: statusText(s), count: counts[s] })),
          ]}
        />
      </div>

      <div className="admin-card w-full overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
              {items.length === 0 ? <Inbox className="h-6 w-6" aria-hidden /> : <SearchX className="h-6 w-6" aria-hidden />}
            </span>
            <p className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              {items.length === 0 ? `No ${plural} yet` : `No ${plural} match your filters`}
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {items.length === 0
                ? `Create your first ${label} to get started.`
                : "Try a different search term or clear the filters."}
            </p>
            <div className="mt-5">
              {items.length === 0 ? (
                <AdminAddButton label={`Add ${label}`} onClick={() => setEditing("new")} />
              ) : (
                hasFilters && (
                  <button type="button" onClick={clearFilters} className="admin-btn admin-btn-secondary">
                    Clear filters
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              {pageRows.map((item) => (
                <li key={item.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setViewing(item)}
                      className="min-w-0 flex-1 rounded-md text-left"
                    >
                      <p className="truncate font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 truncate text-sm text-gray-500">{item.meta ?? "-"}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={item.status} label={statusText(item.status)} />
                        <span className="text-xs text-gray-500">{formatDate(item.updatedAt)}</span>
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
              ))}
            </ul>

            <div
              className="admin-scrollbar hidden overflow-x-auto md:block"
              tabIndex={0}
              role="region"
              aria-label={`${title} table`}
            >
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    {sortHeader("title", titleLabel)}
                    {sortHeader("status", "Status")}
                    <th scope="col" className="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
                      {metaLabel}
                    </th>
                    {sortHeader("updatedAt", "Updated")}
                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pageRows.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                        <button
                          type="button"
                          onClick={() => setViewing(item)}
                          className="rounded text-left hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {item.title}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={item.status} label={statusText(item.status)} />
                      </td>
                      <td className="max-w-[260px] truncate px-5 py-3.5 text-gray-500" title={item.meta}>
                        {item.meta ?? "-"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                        <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
                      </td>
                      <td className="px-5 py-3.5">
                        <AdminRowActions
                          itemLabel={item.title}
                          onView={() => setViewing(item)}
                          onEdit={() => setEditing(item)}
                          onDelete={() => setDeleting(item)}
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

      {editing && (
        <ResourceEditor
          key={editing === "new" ? "new" : editing.id}
          item={editing === "new" ? null : editing}
          label={label}
          titleLabel={titleLabel}
          metaLabel={metaLabel}
          statusText={statusText}
          titleIsEmail={titleIsEmail}
          onCancel={closeEditor}
          onSave={handleSave}
        />
      )}

      <AdminDialog
        open={viewing !== null}
        onClose={() => setViewing(null)}
        placement="right"
        title={viewing?.title ?? ""}
        description={viewing ? `${capitalize(label)} · ${viewing.id}` : undefined}
        footer={
          viewing && (
            <>
              <button
                type="button"
                className="admin-btn admin-btn-danger-ghost"
                onClick={() => {
                  setDeleting(viewing);
                  setViewing(null);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  setEditing(viewing);
                  setViewing(null);
                }}
              >
                Edit {label}
              </button>
            </>
          )
        }
      >
        {viewing && (
          <dl className="space-y-4 text-sm">
            {[
              { k: titleLabel, v: viewing.title },
              { k: "Status", v: <StatusBadge status={viewing.status} label={statusText(viewing.status)} /> },
              { k: metaLabel, v: viewing.meta || "-" },
              { k: "Last updated", v: new Date(viewing.updatedAt).toLocaleString() },
              { k: "ID", v: <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">{viewing.id}</code> },
            ].map((row) => (
              <div key={row.k}>
                <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">{row.k}</dt>
                <dd className="mt-1 text-gray-900 dark:text-white">{row.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </AdminDialog>

      <AdminConfirmDialog
        open={deleting !== null}
        title={`Delete ${label}?`}
        description={
          <>
            <strong className="font-semibold text-gray-900 dark:text-white">“{deleting?.title}”</strong> will be
            permanently removed. This action cannot be undone.
          </>
        }
        confirmLabel={`Delete ${label}`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}

function ResourceEditor({
  item,
  label,
  titleLabel,
  metaLabel,
  statusText,
  titleIsEmail,
  onCancel,
  onSave,
}: {
  statusText: (s: AdminResourceStatus) => string;
  titleIsEmail: boolean;
  item: AdminResource | null;
  label: string;
  titleLabel: string;
  metaLabel: string;
  onCancel: () => void;
  onSave: (input: ResourceInput) => Promise<void>;
}) {
  const [titleValue, setTitleValue] = useState(item?.title ?? "");
  const [status, setStatus] = useState<AdminResourceStatus>(item?.status ?? "draft");
  const [meta, setMeta] = useState(item?.meta ?? "");
  const [errors, setErrors] = useState<{ title?: string; meta?: string }>({});
  const [saving, setSaving] = useState(false);
  const formId = `resource-form-${label}`;

  function validate() {
    const next: typeof errors = {};
    const t = titleValue.trim();
    if (!t) next.title = `${titleLabel} is required.`;
    else if (titleIsEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) next.title = "Enter a valid email address.";
    else if (t.length < 3) next.title = `${titleLabel} must be at least 3 characters.`;
    else if (t.length > 120) next.title = `${titleLabel} must be 120 characters or fewer.`;
    if (meta.length > 160) next.meta = `${metaLabel} must be 160 characters or fewer.`;
    return next;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`${formId}-${next.title ? "title" : "meta"}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: titleValue.trim(), status, meta: meta.trim() || undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open
      onClose={onCancel}
      title={item ? `Edit ${label}` : `New ${label}`}
      description={item ? "Update the details and save your changes." : `Fill in the details to create a ${label}.`}
      footer={
        <>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary">
            Cancel
          </button>
          <button type="submit" form={formId} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : item ? "Save changes" : `Create ${label}`}
          </button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-4">
        <AdminFormField id={`${formId}-title`} label={titleLabel} required error={errors.title}>
          <input
            id={`${formId}-title`}
            data-autofocus
            value={titleValue}
            onChange={(e) => setTitleValue(e.currentTarget.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={fieldDescribedBy(`${formId}-title`, errors.title)}
            aria-required
            type={(titleIsEmail ? "email" : "text") as "text"}
            autoComplete="off"
            className={cn(adminInputClass, errors.title && adminInputErrorClass)}
            placeholder={titleIsEmail ? "name@example.com" : `e.g. New ${label}`}
          />
        </AdminFormField>
        <AdminFormField id={`${formId}-status`} label="Status">
          <select
            id={`${formId}-status`}
            value={status}
            onChange={(e) => setStatus(e.currentTarget.value as AdminResourceStatus)}
            className={adminInputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusText(s)}
              </option>
            ))}
          </select>
        </AdminFormField>
        <AdminFormField
          id={`${formId}-meta`}
          label={metaLabel}
          error={errors.meta}
          hint="Optional - shown in the table (max 160 characters)."
        >
          <input
            id={`${formId}-meta`}
            value={meta}
            onChange={(e) => setMeta(e.currentTarget.value)}
            aria-invalid={Boolean(errors.meta)}
            aria-describedby={fieldDescribedBy(`${formId}-meta`, errors.meta, "hint")}
            className={cn(adminInputClass, errors.meta && adminInputErrorClass)}
          />
        </AdminFormField>
      </form>
    </AdminDialog>
  );
}

function StatusBadge({ status, label }: { status: AdminResourceStatus; label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${statusStyles[status]}`}>
      {label}
    </span>
  );
}
