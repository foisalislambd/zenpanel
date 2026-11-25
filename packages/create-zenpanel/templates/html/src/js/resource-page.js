/**
 * Reusable resource list page: search, status filters, sortable table,
 * pagination, CSV export, create / edit / view / delete with confirmation.
 * Without `onCreate` / `onUpdate` / `onDelete` it edits a per-tab preview copy.
 */
import { firstError, validateResource } from "./lib/admin-forms.js";
import {
  RESOURCE_STATUSES,
  capitalize,
  countResourceStatuses,
  filterResources,
  pluralize,
} from "./lib/admin-resources.js";
import { formatDate } from "./lib/format.js";
import { ADMIN_PAGE_SIZE, slicePage } from "./lib/pagination.js";
import { downloadCsv, nextSort } from "./lib/sort.js";
import {
  addButton,
  applyFieldErrors,
  confirmDialog,
  emptyBlock,
  exportButton,
  filterGroup,
  formField,
  inputClass,
  openDialog,
  pagination,
  previewCollection,
  previewId,
  rowActions,
  searchBox,
  sortHeader,
  statusBadge,
  takeQueryFlag,
  thClass,
  toast,
} from "./ui.js";
import { escapeHtml, navSectionFor, pageHeader, refreshIcons } from "./utils.js";

const dtClass = "text-xs font-medium tracking-wide text-gray-500 uppercase";

/**
 * @param {HTMLElement} root
 * @param {{
 *   title: string, resourceLabel: string, items?: Array<{id:string,title:string,status:string,updatedAt:string,meta?:string}>,
 *   searchPlaceholder?: string, titleLabel?: string, metaLabel?: string, titleIsEmail?: boolean,
 *   statusLabels?: Record<string,string>,
 *   onCreate?: (input) => any, onUpdate?: (item, input) => any, onDelete?: (item) => any,
 * }} options
 */
export function renderResourcePage(root, options) {
  const {
    title,
    resourceLabel,
    items: initialItems = [],
    searchPlaceholder = "Search title, details...",
    titleLabel = "Title",
    metaLabel = "Details",
    titleIsEmail = false,
    statusLabels = {},
    onCreate,
    onUpdate,
    onDelete,
  } = options;
  if (!root) return;

  const label = resourceLabel.toLowerCase();
  const plural = pluralize(label, 2);
  const store = previewCollection(`resource:${label}`, initialItems);
  const statusText = (s) => statusLabels[s] ?? capitalize(s);

  const state = {
    query: "",
    status: "all",
    sort: { key: "updatedAt", direction: "desc" },
    page: 1,
    pageSize: ADMIN_PAGE_SIZE,
  };

  const filtered = () => filterResources(store.get(), state.query, state.status, state.sort);
  const findItem = (id) => store.get().find((i) => i.id === id);

  root.innerHTML = `
    <div class="admin-content">
      ${pageHeader(title, `<span data-slot="export"></span>${addButton(`Add ${label}`)}`, navSectionFor(title))}
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        ${searchBox({ value: "", placeholder: searchPlaceholder, ariaLabel: `Search ${plural}` })}
        <div data-slot="filters"></div>
      </div>
      <div class="admin-card w-full overflow-hidden" data-slot="list"></div>
    </div>`;

  const slots = {
    export: root.querySelector('[data-slot="export"]'),
    filters: root.querySelector('[data-slot="filters"]'),
    list: root.querySelector('[data-slot="list"]'),
  };
  const clearBtn = root.querySelector('[data-act="clear-search"]');
  const searchInput = root.querySelector("[data-search]");

  function paint() {
    const all = store.get();
    const rows = filtered();
    const paged = slicePage(rows, state.page, state.pageSize);
    state.page = paged.page;
    const counts = countResourceStatuses(all);
    const hasFilters = state.query.trim() !== "" || state.status !== "all";

    slots.export.innerHTML = exportButton(rows.length === 0);
    slots.filters.innerHTML = filterGroup({
      ariaLabel: "Filter by status",
      name: "status",
      value: state.status,
      options: [
        { value: "all", label: "All", count: counts.all },
        ...RESOURCE_STATUSES.map((s) => ({ value: s, label: statusText(s), count: counts[s] })),
      ],
    });
    clearBtn.hidden = !state.query;

    if (rows.length === 0) {
      slots.list.innerHTML =
        emptyBlock({
          iconName: all.length === 0 ? "inbox" : "search-x",
          title: all.length === 0 ? `No ${plural} yet` : `No ${plural} match your filters`,
          description:
            all.length === 0 ? `Create your first ${label} to get started.` : "Try a different search term or clear the filters.",
          action:
            all.length === 0
              ? addButton(`Add ${label}`)
              : hasFilters
                ? '<button type="button" data-act="clear-filters" class="admin-btn admin-btn-secondary">Clear filters</button>'
                : "",
        }) + pagination({ ...paged, total: 0, pageSize: state.pageSize });
    } else {
      slots.list.innerHTML = `
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          ${paged.rows
            .map(
              (item) => `
            <li class="px-4 py-3.5">
              <div class="flex items-start justify-between gap-3">
                <button type="button" data-act="view" data-id="${escapeHtml(item.id)}" class="min-w-0 flex-1 rounded-md text-left">
                  <p class="truncate font-medium text-gray-900 dark:text-white">${escapeHtml(item.title)}</p>
                  <p class="mt-0.5 truncate text-sm text-gray-500">${escapeHtml(item.meta ?? "-")}</p>
                  <span class="mt-2 flex items-center gap-2">
                    ${statusBadge(item.status, statusText(item.status))}
                    <span class="text-xs text-gray-500">${escapeHtml(formatDate(item.updatedAt))}</span>
                  </span>
                </button>
                ${rowActions(item.title, item.id, { size: "md" })}
              </div>
            </li>`,
            )
            .join("")}
        </ul>
        <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="${escapeHtml(title)} table">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                ${sortHeader(titleLabel, "title", state.sort)}
                ${sortHeader("Status", "status", state.sort)}
                <th scope="col" class="${thClass}">${escapeHtml(metaLabel)}</th>
                ${sortHeader("Updated", "updatedAt", state.sort)}
                <th scope="col" class="${thClass} text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              ${paged.rows
                .map(
                  (item) => `
                <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                  <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                    <button type="button" data-act="view" data-id="${escapeHtml(item.id)}" class="rounded text-left hover:text-brand-600 dark:hover:text-brand-400">${escapeHtml(item.title)}</button>
                  </td>
                  <td class="px-5 py-3.5">${statusBadge(item.status, statusText(item.status))}</td>
                  <td class="max-w-[260px] truncate px-5 py-3.5 text-gray-500" title="${escapeHtml(item.meta ?? "")}">${escapeHtml(item.meta ?? "-")}</td>
                  <td class="px-5 py-3.5 whitespace-nowrap text-gray-500"><time datetime="${escapeHtml(item.updatedAt)}">${escapeHtml(formatDate(item.updatedAt))}</time></td>
                  <td class="px-5 py-3.5">${rowActions(item.title, item.id)}</td>
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        ${pagination({ ...paged, total: rows.length, pageSize: state.pageSize })}`;
    }
    refreshIcons();
  }

  /* ------------------------------------------------------------ dialogs */

  function openEditor(item) {
    const id = `resource-form-${label}`;
    const control = (key, attrs) => `<input id="${id}-${key}" ${attrs} class="${inputClass}" />`;
    const dlg = openDialog({
      title: item ? `Edit ${label}` : `New ${label}`,
      description: item ? "Update the details and save your changes." : `Fill in the details to create a ${label}.`,
      body: `
        <form id="${id}" novalidate class="space-y-4">
          ${formField({
            id: `${id}-title`,
            label: titleLabel,
            required: true,
            control: control(
              "title",
              `type="${titleIsEmail ? "email" : "text"}" data-autofocus aria-required="true" autocomplete="off" value="${escapeHtml(item?.title ?? "")}" placeholder="${escapeHtml(titleIsEmail ? "name@example.com" : `e.g. New ${label}`)}"`,
            ),
          })}
          ${formField({
            id: `${id}-status`,
            label: "Status",
            control: `<select id="${id}-status" class="${inputClass}">${RESOURCE_STATUSES.map(
              (s) => `<option value="${s}" ${s === (item?.status ?? "draft") ? "selected" : ""}>${escapeHtml(statusText(s))}</option>`,
            ).join("")}</select>`,
          })}
          ${formField({
            id: `${id}-meta`,
            label: metaLabel,
            hint: "Optional - shown in the table (max 160 characters).",
            control: control("meta", `value="${escapeHtml(item?.meta ?? "")}" aria-describedby="${id}-meta-hint"`),
          })}
        </form>`,
      footer: `
        <button type="button" data-close class="admin-btn admin-btn-secondary">Cancel</button>
        <button type="submit" form="${id}" class="admin-btn admin-btn-primary">${item ? "Save changes" : `Create ${label}`}</button>`,
      onClose: () => newFlag.clear(),
    });
    dlg.root.querySelector(`#${id}-title`).focus();
    dlg.root.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = {
        title: form.querySelector(`#${id}-title`).value.trim(),
        status: form.querySelector(`#${id}-status`).value,
        meta: form.querySelector(`#${id}-meta`).value.trim(),
      };
      const errors = validateResource(input, { titleLabel, metaLabel, titleIsEmail });
      if (!applyFieldErrors(dlg.root, id, errors, ["title", "meta"]) || firstError(["title", "meta"], errors)) return;
      const payload = { ...input, meta: input.meta || undefined };
      try {
        if (!item) {
          const created = onCreate
            ? await onCreate(payload)
            : { id: previewId(label.slice(0, 3)), updatedAt: new Date().toISOString(), ...payload };
          store.set((list) => [created, ...list]);
          state.status = "all";
          state.page = 1;
          toast({ title: `${capitalize(label)} created`, description: `“${created.title}” was added.` });
        } else {
          const updated = onUpdate ? await onUpdate(item, payload) : { ...item, ...payload, updatedAt: new Date().toISOString() };
          store.set((list) => list.map((i) => (i.id === item.id ? updated : i)));
          toast({ title: "Changes saved", description: `“${updated.title}” was updated.` });
        }
        dlg.close();
        paint();
      } catch (err) {
        toast({ variant: "error", title: "Could not save", description: err instanceof Error ? err.message : undefined });
      }
    });
  }

  function openViewer(item) {
    const dl = (term, value) => `<div><dt class="${dtClass}">${escapeHtml(term)}</dt><dd class="mt-1 text-gray-900 dark:text-white">${value}</dd></div>`;
    const dlg = openDialog({
      title: item.title,
      description: `${capitalize(label)} · ${item.id}`,
      placement: "right",
      body: `
        <dl class="space-y-4 text-sm">
          ${dl(titleLabel, escapeHtml(item.title))}
          ${dl("Status", statusBadge(item.status, statusText(item.status)))}
          ${dl(metaLabel, escapeHtml(item.meta || "-"))}
          ${dl("Last updated", escapeHtml(new Date(item.updatedAt).toLocaleString()))}
          ${dl("ID", `<code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">${escapeHtml(item.id)}</code>`)}
        </dl>`,
      footer: `
        <button type="button" data-drawer="delete" class="admin-btn admin-btn-danger-ghost">Delete</button>
        <button type="button" data-drawer="edit" class="admin-btn admin-btn-primary">Edit ${escapeHtml(label)}</button>`,
    });
    dlg.root.querySelector('[data-drawer="edit"]').addEventListener("click", () => {
      dlg.close();
      openEditor(item);
    });
    dlg.root.querySelector('[data-drawer="delete"]').addEventListener("click", () => {
      dlg.close();
      openDelete(item);
    });
  }

  function openDelete(item) {
    confirmDialog({
      title: `Delete ${label}?`,
      confirmLabel: `Delete ${label}`,
      message: `<strong class="font-semibold text-gray-900 dark:text-white">“${escapeHtml(item.title)}”</strong> will be permanently removed. This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await onDelete?.(item);
          store.set((list) => list.filter((i) => i.id !== item.id));
          toast({ title: `${capitalize(label)} deleted`, description: `“${item.title}” was removed.` });
          paint();
        } catch (err) {
          toast({ variant: "error", title: "Could not delete", description: err instanceof Error ? err.message : undefined });
        }
      },
    });
  }

  function exportCsv() {
    const rows = filtered();
    downloadCsv(
      `${plural}.csv`,
      ["ID", titleLabel, "Status", metaLabel, "Updated"],
      rows.map((i) => [i.id, i.title, statusText(i.status), i.meta ?? "", i.updatedAt]),
    );
    toast({ variant: "info", title: "Export ready", description: `${rows.length} ${pluralize(label, rows.length)} exported to CSV.` });
  }

  /* ------------------------------------------------------------- events */

  root.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act],[data-sort],[data-filter],[data-page]");
    if (!el || !root.contains(el) || el.disabled) return;
    if (el.dataset.sort) {
      state.sort = nextSort(state.sort, el.dataset.sort);
      state.page = 1;
      return paint();
    }
    if (el.dataset.filter) {
      state.status = el.dataset.value;
      state.page = 1;
      return paint();
    }
    if (el.dataset.page) {
      state.page = Number(el.dataset.page);
      return paint();
    }
    const item = el.dataset.id ? findItem(el.dataset.id) : null;
    switch (el.dataset.act) {
      case "add":
        return openEditor(null);
      case "export":
        return exportCsv();
      case "clear-search":
        state.query = "";
        searchInput.value = "";
        searchInput.focus();
        state.page = 1;
        return paint();
      case "clear-filters":
        state.query = "";
        searchInput.value = "";
        state.status = "all";
        state.page = 1;
        return paint();
      case "view":
        return item && openViewer(item);
      case "edit":
        return item && openEditor(item);
      case "delete":
        return item && openDelete(item);
    }
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-page-size]")) {
      state.pageSize = Number(e.target.value);
      state.page = 1;
      paint();
    }
  });
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    state.page = 1;
    paint();
  });

  const newFlag = takeQueryFlag("new");
  paint();
  if (newFlag.hit) openEditor(null);
}
