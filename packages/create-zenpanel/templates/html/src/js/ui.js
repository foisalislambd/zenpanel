/**
 * Shared vanilla UI building blocks: toasts, dialogs/drawers, confirm dialogs,
 * form fields, table helpers and a tiny preview store. All markup is HTML strings
 * (escape user data with `escapeHtml`) - call `refreshIcons()` after inserting.
 */
import { activateDialog } from "./lib/dialog.js";
import { RESOURCE_STATUSES, pageWindow, resourceStatusStyles } from "./lib/admin-resources.js";
import { ADMIN_PAGE_SIZE_OPTIONS } from "./lib/pagination.js";
import { escapeHtml, icon, refreshIcons } from "./utils.js";

export { RESOURCE_STATUSES };

/* ------------------------------------------------------------------ toasts */

const toastIcons = { success: "circle-check", error: "circle-alert", info: "info" };
const toastColors = {
  success: "text-success-600 dark:text-success-500",
  error: "text-error-500",
  info: "text-brand-500 dark:text-brand-400",
};
let toastHost = null;
let toastSeq = 0;

function ensureToastHost() {
  if (toastHost?.isConnected) return toastHost;
  toastHost = document.createElement("div");
  toastHost.setAttribute("aria-live", "polite");
  toastHost.setAttribute("aria-atomic", "false");
  toastHost.className =
    "admin-portal pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5";
  document.body.appendChild(toastHost);
  return toastHost;
}

/** @param {{ title: string, description?: string, variant?: "success"|"error"|"info", duration?: number }} t */
export function toast({ title, description, variant = "success", duration = 4000 }) {
  const host = ensureToastHost();
  const el = document.createElement("div");
  el.id = `zp-toast-${++toastSeq}`;
  el.setAttribute("role", variant === "error" ? "alert" : "status");
  el.className =
    "admin-toast pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg sm:w-[360px] dark:border-gray-700 dark:bg-gray-900";
  el.innerHTML = `
    ${icon(toastIcons[variant], `mt-0.5 h-5 w-5 shrink-0 ${toastColors[variant]}`)}
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</p>
      ${description ? `<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">${escapeHtml(description)}</p>` : ""}
    </div>
    <button type="button" data-dismiss class="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200" aria-label="Dismiss notification">
      ${icon("x", "h-4 w-4")}
    </button>`;
  const remove = () => el.remove();
  el.querySelector("[data-dismiss]").addEventListener("click", remove);
  host.appendChild(el);
  while (host.children.length > 4) host.firstElementChild.remove();
  refreshIcons();
  if (duration > 0) setTimeout(remove, duration);
}

/* ----------------------------------------------------------------- dialogs */

let dialogSeq = 0;
const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

/**
 * Accessible modal / drawer appended to <body>: focus trap, Escape, scroll lock,
 * focus restored on close. Mark the first field with `data-autofocus`.
 * @param {{ title: string, description?: string, body: string, footer?: string,
 *   placement?: "center"|"right", size?: "sm"|"md"|"lg", onClose?: () => void }} options
 * @returns {{ root: HTMLElement, panel: HTMLElement, close: () => void }}
 */
export function openDialog({ title, description, body, footer = "", placement = "center", size = "md", onClose }) {
  const id = `zp-dialog-${++dialogSeq}`;
  const root = document.createElement("div");
  root.className = `admin-portal fixed inset-0 z-[60] flex ${
    placement === "center" ? "items-end justify-center p-0 sm:items-center sm:p-4" : "justify-end"
  }`;
  root.innerHTML = `
    <div class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" aria-hidden="true" data-close></div>
    <div role="dialog" aria-modal="true" aria-labelledby="${id}-title" ${description ? `aria-describedby="${id}-desc"` : ""} tabindex="-1"
      class="relative flex w-full flex-col bg-white shadow-2xl outline-none dark:bg-gray-900 ${
        placement === "center"
          ? `admin-dialog max-h-[92dvh] rounded-t-2xl border border-gray-200 sm:rounded-2xl dark:border-gray-800 ${widths[size]}`
          : "admin-drawer h-full max-w-md border-l border-gray-200 dark:border-gray-800"
      }">
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div class="min-w-0">
          <h2 id="${id}-title" class="truncate text-lg font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</h2>
          ${description ? `<p id="${id}-desc" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">${escapeHtml(description)}</p>` : ""}
        </div>
        <button type="button" data-close class="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200" aria-label="Close">
          ${icon("x", "h-5 w-5")}
        </button>
      </div>
      <div class="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5" data-dialog-body>${body}</div>
      ${footer ? `<div class="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800" data-dialog-footer>${footer}</div>` : ""}
    </div>`;
  document.body.appendChild(root);
  refreshIcons();
  const panel = root.querySelector('[role="dialog"]');
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    release();
    root.remove();
    onClose?.();
  };
  const release = activateDialog(panel, close);
  root.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  return { root, panel, close };
}

/**
 * @param {{ title: string, message: string, confirmLabel: string, cancelLabel?: string,
 *   tone?: "danger"|"default", onConfirm: () => void | Promise<void> }} options
 */
export function confirmDialog({ title, message, confirmLabel, cancelLabel = "Cancel", tone = "danger", onConfirm }) {
  const dlg = openDialog({
    title,
    size: "sm",
    body: `
      <div class="flex gap-3">
        ${
          tone === "danger"
            ? `<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">${icon("triangle-alert", "h-5 w-5")}</span>`
            : ""
        }
        <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">${message}</div>
      </div>`,
    footer: `
      <button type="button" data-autofocus data-close class="admin-btn admin-btn-secondary">${escapeHtml(cancelLabel)}</button>
      <button type="button" data-confirm class="admin-btn ${tone === "danger" ? "admin-btn-danger" : "admin-btn-primary"}">${escapeHtml(confirmLabel)}</button>`,
  });
  dlg.panel.querySelector("[data-close][data-autofocus]").focus();
  dlg.panel.querySelector("[data-confirm]").addEventListener("click", async () => {
    dlg.close();
    await onConfirm();
  });
  return dlg;
}

/* ------------------------------------------------------------------- forms */

export const inputClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:disabled:bg-white/5";
export const inputErrorClass = "border-error-500 focus:border-error-500 focus:ring-error-500/20 dark:border-error-500";

/** Label + control + hint/error slot. The control must carry `id`. */
export function formField({ id, label, control, required = false, hint = "", className = "" }) {
  return `
    <div class="space-y-1.5 ${className}" data-field="${escapeHtml(id)}">
      <label for="${escapeHtml(id)}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        ${escapeHtml(label)}${required ? '<span class="ml-0.5 text-error-500" aria-hidden="true">*</span>' : ""}
      </label>
      ${control}
      <p id="${escapeHtml(id)}-error" class="text-sm text-error-500" hidden></p>
      ${hint ? `<p id="${escapeHtml(id)}-hint" class="text-xs text-gray-500 dark:text-gray-400">${escapeHtml(hint)}</p>` : ""}
    </div>`;
}

/**
 * Show validation errors on fields rendered with `formField`. Focuses the first invalid one.
 * @param {HTMLElement} scope
 * @param {string} prefix id prefix, e.g. "resource-form-product"
 * @param {Record<string, string|undefined>} errors
 * @param {string[]} order
 * @returns {boolean} true when valid
 */
export function applyFieldErrors(scope, prefix, errors, order) {
  let first = null;
  for (const key of order) {
    const id = `${prefix}-${key}`;
    const input = scope.querySelector(`#${CSS.escape(id)}`);
    const err = scope.querySelector(`#${CSS.escape(id)}-error`);
    const hint = scope.querySelector(`#${CSS.escape(id)}-hint`);
    const message = errors[key];
    if (!input) continue;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    inputErrorClass.split(" ").forEach((c) => input.classList.toggle(c, Boolean(message)));
    if (err) {
      err.textContent = message ?? "";
      err.hidden = !message;
    }
    if (hint) hint.hidden = Boolean(message);
    const describedBy = message ? `${id}-error` : hint ? `${id}-hint` : "";
    if (describedBy) input.setAttribute("aria-describedby", describedBy);
    else input.removeAttribute("aria-describedby");
    if (message && !first) first = input;
  }
  first?.focus();
  return !first;
}

/* ----------------------------------------------------------- table helpers */

const pendingTitle = "Available after you connect your API";

export function addButton(label, { action = "add", enabled = true } = {}) {
  return `
    <button type="button" data-act="${action}" ${enabled ? "" : `disabled title="${pendingTitle}"`}
      class="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white ${
        enabled ? "bg-brand-500 shadow-sm shadow-brand-500/20 hover:bg-brand-600" : "cursor-not-allowed bg-brand-500/50 text-white/90"
      }">
      ${icon("plus", "h-4 w-4")}
      ${escapeHtml(label)}
    </button>`;
}

export function exportButton(disabled) {
  return `<button type="button" data-act="export" ${disabled ? "disabled" : ""} class="admin-btn admin-btn-secondary">${icon("download", "h-4 w-4")} Export</button>`;
}

export function rowActions(itemLabel, id, { size = "sm" } = {}) {
  const dim = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const px = size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4";
  const base = `flex items-center justify-center rounded-lg text-gray-500 transition-colors dark:text-gray-400 ${dim}`;
  const idle = "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200";
  const danger = "hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/15 dark:hover:text-error-500";
  const label = escapeHtml(itemLabel);
  const rid = escapeHtml(id);
  return `
    <div class="flex items-center justify-end gap-0.5">
      <button type="button" data-act="view" data-id="${rid}" aria-label="View ${label}" class="${base} ${idle}">${icon("eye", px)}</button>
      <button type="button" data-act="edit" data-id="${rid}" aria-label="Edit ${label}" class="${base} ${idle}">${icon("pencil", px)}</button>
      <button type="button" data-act="delete" data-id="${rid}" aria-label="Delete ${label}" class="${base} ${danger}">${icon("trash-2", px)}</button>
    </div>`;
}

export function statusBadge(status, label) {
  return `<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${resourceStatusStyles[status] ?? ""}">${escapeHtml(label)}</span>`;
}

/** `<th>` with a sort button and `aria-sort`. */
export function sortHeader(label, key, sort) {
  const active = sort.key === key;
  const ariaSort = active ? (sort.direction === "asc" ? "ascending" : "descending") : "none";
  const iconName = active ? (sort.direction === "asc" ? "arrow-up" : "arrow-down") : "chevrons-up-down";
  return `
    <th scope="col" class="px-5 py-3" aria-sort="${ariaSort}">
      <button type="button" data-sort="${escapeHtml(key)}" class="-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white ${
        active ? "text-gray-900 dark:text-white" : "text-gray-500"
      }">
        ${escapeHtml(label)}
        ${icon(iconName, `h-3.5 w-3.5 ${active ? "" : "opacity-60"}`)}
      </button>
    </th>`;
}

export const thClass = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";

/** @param {{ value: string, label: string, count?: number }[]} options */
export function filterGroup({ ariaLabel, label = "", options, value, name }) {
  return `
    <div role="group" aria-label="${escapeHtml(ariaLabel)}" class="flex min-w-0 flex-wrap items-center gap-1.5">
      ${label ? `<span class="mr-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">${escapeHtml(label)}</span>` : ""}
      ${options
        .map((o) => {
          const on = o.value === value;
          return `
          <button type="button" data-filter="${escapeHtml(name)}" data-value="${escapeHtml(o.value)}" aria-pressed="${on}"
            class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              on
                ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
            }">
            ${escapeHtml(o.label)}
            ${
              o.count !== undefined
                ? `<span class="rounded-full px-1.5 text-xs tabular-nums ${on ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"}">${o.count}</span>`
                : ""
            }
          </button>`;
        })
        .join("")}
    </div>`;
}

export function searchBox({ value, placeholder, ariaLabel }) {
  return `
    <div class="relative w-full max-w-md">
      ${icon("search", "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400")}
      <input type="search" data-search value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(ariaLabel)}"
        class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden" />
      <button type="button" data-act="clear-search" ${value ? "" : "hidden"} aria-label="Clear search"
        class="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10">
        ${icon("x", "h-4 w-4")}
      </button>
    </div>`;
}

const pgButton =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const pgIdle =
  "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5";
const pgActive = "bg-brand-500 text-white shadow-sm shadow-brand-500/20";

export function pagination({ page, pageCount, total, pageSize }) {
  if (total === 0) return "";
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `
    <nav aria-label="Pagination" class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Showing <span class="font-medium text-gray-700 dark:text-gray-200">${start}–${end}</span>
          of <span class="font-medium text-gray-700 dark:text-gray-200">${total}</span>
        </p>
        <label class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          Rows
          <select data-page-size class="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            ${ADMIN_PAGE_SIZE_OPTIONS.map((s) => `<option value="${s}" ${s === pageSize ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        <button type="button" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""} aria-label="Previous page" class="${pgButton} ${pgIdle}">${icon("chevron-left", "h-4 w-4")}</button>
        ${pageWindow(page, pageCount)
          .map((p) =>
            p === "ellipsis"
              ? '<span class="px-1 text-sm text-gray-400" aria-hidden="true">…</span>'
              : `<button type="button" data-page="${p}" aria-label="Page ${p}" ${p === page ? 'aria-current="page"' : ""} class="${pgButton} ${p === page ? pgActive : pgIdle}">${p}</button>`,
          )
          .join("")}
        <button type="button" data-page="${page + 1}" ${page >= pageCount ? "disabled" : ""} aria-label="Next page" class="${pgButton} ${pgIdle}">${icon("chevron-right", "h-4 w-4")}</button>
      </div>
    </nav>`;
}

/** Empty / no-results block for list cards. */
export function emptyBlock({ iconName, title, description, action = "" }) {
  return `
    <div class="flex flex-col items-center px-6 py-16 text-center">
      <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">${icon(iconName, "h-6 w-6")}</span>
      <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</p>
      <p class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">${escapeHtml(description)}</p>
      ${action ? `<div class="mt-5">${action}</div>` : ""}
    </div>`;
}

export function errorState({ title = "Something went wrong", message }) {
  return `
    <div class="admin-card flex flex-col items-center px-6 py-16 text-center" role="alert">
      <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-error-50 text-error-500 dark:bg-error-500/15">${icon("triangle-alert", "h-6 w-6")}</span>
      <h2 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</h2>
      <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">${escapeHtml(message)}</p>
      <button type="button" data-act="retry" class="admin-btn admin-btn-secondary mt-5">${icon("rotate-cw", "h-4 w-4")} Try again</button>
    </div>`;
}

export function tableSkeleton(label = "Loading…") {
  const row = '<div class="admin-skeleton h-12 w-full rounded-lg" aria-hidden="true"></div>';
  return `
    <div class="admin-content space-y-6" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">${escapeHtml(label)}</span>
      <div class="flex items-center justify-between">
        <div class="admin-skeleton h-8 w-40 rounded-md" aria-hidden="true"></div>
        <div class="admin-skeleton h-9 w-28 rounded-lg" aria-hidden="true"></div>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="admin-skeleton h-10 w-full max-w-md rounded-xl" aria-hidden="true"></div>
        <div class="admin-skeleton h-10 w-48 rounded-lg" aria-hidden="true"></div>
      </div>
      <div class="admin-card space-y-3 p-4">${row.repeat(5)}</div>
    </div>`;
}

export function dashboardSkeleton() {
  const card = '<div class="admin-skeleton h-[92px] rounded-xl" aria-hidden="true"></div>';
  return `
    <div class="admin-content flex flex-col gap-5" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">Loading dashboard…</span>
      <div class="admin-skeleton h-36 rounded-2xl" aria-hidden="true"></div>
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">${card.repeat(6)}</div>
      <div class="grid gap-5 xl:grid-cols-3">
        <div class="admin-skeleton h-80 rounded-xl xl:col-span-2" aria-hidden="true"></div>
        <div class="admin-skeleton h-80 rounded-xl" aria-hidden="true"></div>
      </div>
    </div>`;
}

/* ----------------------------------------------------------- preview store */

const STORE_PREFIX = "zenpanel-preview:";

/**
 * Per-tab preview copy of a collection (sessionStorage), so edits survive
 * full-page navigation in the static preview. Replace with your API.
 * @template T
 * @param {string} key
 * @param {T[]} initial
 */
export function previewCollection(key, initial) {
  let items = initial;
  try {
    const raw = sessionStorage.getItem(STORE_PREFIX + key);
    if (raw) items = JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    get: () => items,
    set(next) {
      items = typeof next === "function" ? next(items) : next;
      try {
        sessionStorage.setItem(STORE_PREFIX + key, JSON.stringify(items));
      } catch {
        // ignore
      }
    },
  };
}

export function previewId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Read / clear a query-string flag such as `?new=1` without reloading. */
export function takeQueryFlag(name, value = "1") {
  const url = new URL(window.location.href);
  const hit = url.searchParams.get(name) === value;
  return {
    hit,
    clear() {
      if (!url.searchParams.has(name)) return;
      url.searchParams.delete(name);
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    },
  };
}
