import {
  breadcrumbs,
  emptyState,
  escapeHtml,
  icon,
  pageHeader,
  refreshIcons,
} from "./utils.js";
import { demoUsers } from "./data.js";
import { getAdmin } from "./auth.js";

const irregularPlurals = {
  category: "categories",
  post: "posts",
};

function pluralize(label, count) {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

const statusStyles = {
  published:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const providerStyles = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

const pendingTitle = "Available after you connect your API";

function dash(value) {
  return value && String(value).trim() ? value : "—";
}

function addButton() {
  return `
    <button
      type="button"
      disabled
      title="${pendingTitle}"
      class="inline-flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-brand-500/50 px-4 text-sm font-semibold text-white/90"
    >
      ${icon("plus", "h-4 w-4")}
      Add new
    </button>
  `;
}

function filterGroup(ariaLabel, options, activeValue, dataAttr) {
  return `
    <div role="group" aria-label="${escapeHtml(ariaLabel)}" class="flex shrink-0 flex-wrap items-center gap-1.5">
      ${options
        .map(({ value, label }) => {
          const active = value === activeValue;
          return `
            <button
              type="button"
              data-${dataAttr}="${escapeHtml(value)}"
              class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
              }"
            >
              ${escapeHtml(label)}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function rowActions(itemLabel, { size = "sm", viewEnabled = false, viewId = "" } = {}) {
  const dim = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const iconSize = size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4";
  const enabledClass =
    "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200";
  const disabledClass = "cursor-not-allowed opacity-70";

  const viewBtn = viewEnabled
    ? `<button type="button" data-view-user="${escapeHtml(viewId)}" title="View ${escapeHtml(itemLabel)}" aria-label="View ${escapeHtml(itemLabel)}" class="flex ${dim} items-center justify-center rounded-lg text-gray-400 transition-colors ${enabledClass}">${icon("eye", iconSize)}</button>`
    : `<button type="button" disabled title="${pendingTitle}" aria-label="View ${escapeHtml(itemLabel)}" class="flex ${dim} items-center justify-center rounded-lg text-gray-400 transition-colors ${disabledClass}">${icon("eye", iconSize)}</button>`;

  return `
    <div class="flex items-center justify-end gap-0.5">
      ${viewBtn}
      <button type="button" disabled title="${pendingTitle}" aria-label="Edit ${escapeHtml(itemLabel)}" class="flex ${dim} items-center justify-center rounded-lg text-gray-400 transition-colors ${disabledClass}">${icon("pencil", iconSize)}</button>
      <button type="button" disabled title="${pendingTitle}" aria-label="Delete ${escapeHtml(itemLabel)}" class="flex ${dim} items-center justify-center rounded-lg text-gray-400 transition-colors ${disabledClass}">${icon("trash-2", iconSize)}</button>
    </div>
  `;
}

function statusBadge(status) {
  return `<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status] ?? statusStyles.draft}">${escapeHtml(status)}</span>`;
}

function providerBadge(provider) {
  const style =
    providerStyles[provider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800";
  return `<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}">${escapeHtml(provider)}</span>`;
}

function userStatusBadges(user) {
  const status =
    user.status === "active"
      ? `<span class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">Active</span>`
      : `<span class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15">Banned</span>`;
  const unverified = !user.emailVerified
    ? `<span class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">Unverified</span>`
    : "";
  return `${status}${unverified}`;
}

function searchInput({ value, placeholder, ariaLabel }) {
  return `
    <div class="relative w-full max-w-md">
      ${icon("search", "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400")}
      <input
        type="search"
        data-search
        value="${escapeHtml(value)}"
        placeholder="${escapeHtml(placeholder)}"
        aria-label="${escapeHtml(ariaLabel)}"
        class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
      />
    </div>
  `;
}

/**
 * Resource list page: search, status filters, table, row actions.
 * @param {HTMLElement} root
 * @param {{ title: string, resourceLabel: string, items?: Array, searchPlaceholder?: string }} options
 */
export function renderResourcePage(
  root,
  {
    title,
    resourceLabel,
    items = [],
    searchPlaceholder = "Search title, details...",
  },
) {
  let query = "";
  let statusFilter = "all";

  function filteredItems() {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [item.title, item.meta ?? "", item.id]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function paint() {
    const filtered = filteredItems();
    const searchFocused = document.activeElement?.hasAttribute?.("data-search");
    const cursor =
      searchFocused && document.activeElement instanceof HTMLInputElement
        ? document.activeElement.selectionStart
        : null;

    root.innerHTML = `
      <div class="admin-content space-y-6">
        ${breadcrumbs(title)}
        ${pageHeader(title, addButton())}

        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          ${searchInput({
            value: query,
            placeholder: searchPlaceholder,
            ariaLabel: `Search ${pluralize(resourceLabel, 2)}`,
          })}
          ${filterGroup(
            "Filter by status",
            [
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ],
            statusFilter,
            "status-filter",
          )}
        </div>

        <div class="admin-card w-full overflow-hidden">
          ${
            filtered.length === 0
              ? items.length === 0
                ? emptyState({
                    iconName: "database",
                    title: `No ${resourceLabel.toLowerCase()} yet`,
                    description: `This page is ready for your data. Connect your backend API to load, create, and manage ${resourceLabel.toLowerCase()} from here.`,
                  })
                : `<div class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No ${escapeHtml(pluralize(resourceLabel, 2))} match your filters</div>`
              : `
                <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
                  ${filtered
                    .map(
                      (item) => `
                    <li class="px-4 py-3.5">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0 flex-1">
                          <p class="truncate font-medium text-gray-900 dark:text-white">${escapeHtml(item.title)}</p>
                          <p class="mt-0.5 truncate text-sm text-gray-500">${escapeHtml(item.meta ?? "—")}</p>
                          <div class="mt-2">${statusBadge(item.status)}</div>
                        </div>
                        ${rowActions(item.title, { size: "md" })}
                      </div>
                    </li>
                  `,
                    )
                    .join("")}
                </ul>

                <div class="admin-scrollbar hidden overflow-x-auto md:block">
                  <table class="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-gray-800">
                        ${["Title", "Status", "Details", "Updated", "Actions"]
                          .map(
                            (heading) => `
                          <th class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${heading === "Actions" ? "text-right" : ""}">${heading}</th>
                        `,
                          )
                          .join("")}
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                      ${filtered
                        .map(
                          (item) => `
                        <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                          <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">${escapeHtml(item.title)}</td>
                          <td class="px-5 py-3.5">${statusBadge(item.status)}</td>
                          <td class="max-w-[220px] truncate px-5 py-3.5 text-gray-500">${escapeHtml(item.meta ?? "—")}</td>
                          <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">${new Date(item.updatedAt).toLocaleDateString()}</td>
                          <td class="px-5 py-3.5">${rowActions(item.title)}</td>
                        </tr>
                      `,
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `
          }
        </div>
      </div>
    `;

    const searchEl = root.querySelector("[data-search]");
    searchEl?.addEventListener("input", (e) => {
      query = e.target.value;
      paint();
    });

    root.querySelectorAll("[data-status-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        statusFilter = btn.getAttribute("data-status-filter");
        paint();
      });
    });

    refreshIcons();

    if (searchFocused && searchEl instanceof HTMLInputElement) {
      searchEl.focus();
      if (cursor != null) searchEl.setSelectionRange(cursor, cursor);
    }
  }

  paint();
}

export function renderMessagesPage(root) {
  root.innerHTML = `
    <div class="admin-content flex h-full min-h-0 flex-col space-y-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      ${breadcrumbs("Messages")}
      ${pageHeader("Messages")}
      <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside class="admin-card flex w-full max-w-xs shrink-0 flex-col overflow-hidden md:max-w-sm">
          <div class="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">0 conversations</p>
          </div>
          <div class="flex min-h-0 flex-1 overflow-y-auto">
            ${emptyState({
              iconName: "inbox",
              title: "No messages yet",
              description:
                "When customers reach out, their conversations will appear here. Connect your messaging API to get started.",
            })}
          </div>
        </aside>
        <div class="admin-card hidden min-w-0 flex-1 flex-col md:flex">
          ${emptyState({
            iconName: "message-circle",
            title: "Select a conversation",
            description: "Choose a thread from the inbox to read and reply.",
          })}
        </div>
      </div>
    </div>
  `;
  refreshIcons();
}

function userDetailPanel(user) {
  const rows = [
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
  ];

  return `
    <div class="fixed inset-0 z-50 flex justify-end" data-user-drawer>
      <button type="button" class="absolute inset-0 bg-gray-900/40" aria-label="Close user details" data-close-drawer></button>
      <aside class="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div class="min-w-0">
            <h2 class="truncate text-lg font-semibold text-gray-900 dark:text-white">${escapeHtml(user.name)}</h2>
            <p class="truncate text-sm text-gray-500">${escapeHtml(user.email)}</p>
          </div>
          <button type="button" data-close-drawer class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Close">
            ${icon("x", "h-5 w-5")}
          </button>
        </div>
        <dl class="admin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm">
          ${rows
            .map(
              (row) => `
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">${escapeHtml(row.label)}</dt>
              <dd class="mt-1 text-gray-900 dark:text-white ${row.capitalize ? "capitalize" : ""}">${escapeHtml(row.value)}</dd>
            </div>
          `,
            )
            .join("")}
        </dl>
      </aside>
    </div>
  `;
}

export function renderUsersPage(root) {
  let query = "";
  let statusFilter = "all";
  let providerFilter = "all";
  let selectedId = null;

  function filteredUsers() {
    const q = query.trim().toLowerCase();
    return demoUsers.filter((user) => {
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
  }

  function paint() {
    const filtered = filteredUsers();
    const selected = demoUsers.find((u) => u.id === selectedId) ?? null;
    const searchFocused = document.activeElement?.hasAttribute?.("data-search");
    const cursor =
      searchFocused && document.activeElement instanceof HTMLInputElement
        ? document.activeElement.selectionStart
        : null;

    root.innerHTML = `
      <div class="admin-content space-y-6">
        ${breadcrumbs("Users")}
        ${pageHeader("Users", addButton())}

        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          ${searchInput({
            value: query,
            placeholder: "Search name, email, phone, IP...",
            ariaLabel: "Search users",
          })}
          <div class="flex flex-wrap items-center gap-3">
            ${filterGroup(
              "Filter by status",
              [
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "banned", label: "Banned" },
              ],
              statusFilter,
              "status-filter",
            )}
            ${filterGroup(
              "Filter by provider",
              [
                { value: "all", label: "All" },
                { value: "email", label: "Email" },
                { value: "google", label: "Google" },
              ],
              providerFilter,
              "provider-filter",
            )}
          </div>
        </div>

        <div class="admin-card w-full overflow-hidden">
          ${
            filtered.length === 0
              ? `<div class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No users match your filters</div>`
              : `
                <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
                  ${filtered
                    .map(
                      (user) => `
                    <li class="px-4 py-3.5">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0 flex-1">
                          <p class="truncate font-medium text-gray-900 dark:text-white">${escapeHtml(user.name)}</p>
                          <p class="mt-0.5 truncate text-sm text-gray-500">${escapeHtml(user.email)}</p>
                          <div class="mt-2 flex flex-wrap items-center gap-1.5">
                            ${providerBadge(user.authProvider)}
                            ${userStatusBadges(user)}
                          </div>
                        </div>
                        ${rowActions(user.name, { size: "md", viewEnabled: true, viewId: user.id })}
                      </div>
                    </li>
                  `,
                    )
                    .join("")}
                </ul>

                <div class="admin-scrollbar hidden overflow-x-auto md:block">
                  <table class="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-gray-800">
                        ${["User", "Country", "Phone", "Provider", "Status", "Joined", "Actions"]
                          .map(
                            (heading) => `
                          <th class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${heading === "Actions" ? "text-right" : ""}">${heading}</th>
                        `,
                          )
                          .join("")}
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                      ${filtered
                        .map(
                          (user) => `
                        <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                          <td class="px-5 py-3.5">
                            <p class="font-medium text-gray-900 dark:text-white">${escapeHtml(user.name)}</p>
                            <p class="mt-0.5 text-sm text-gray-500">${escapeHtml(user.email)}</p>
                          </td>
                          <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">${escapeHtml(dash(user.country))}</td>
                          <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">${escapeHtml(dash(user.phone))}</td>
                          <td class="px-5 py-3.5">${providerBadge(user.authProvider)}</td>
                          <td class="px-5 py-3.5">
                            <div class="flex flex-wrap items-center gap-1.5">${userStatusBadges(user)}</div>
                          </td>
                          <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">${new Date(user.createdAt).toLocaleDateString()}</td>
                          <td class="px-5 py-3.5">${rowActions(user.name, { viewEnabled: true, viewId: user.id })}</td>
                        </tr>
                      `,
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `
          }
        </div>

        ${selected ? userDetailPanel(selected) : ""}
      </div>
    `;

    const searchEl = root.querySelector("[data-search]");
    searchEl?.addEventListener("input", (e) => {
      query = e.target.value;
      paint();
    });

    root.querySelectorAll("[data-status-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        statusFilter = btn.getAttribute("data-status-filter");
        paint();
      });
    });

    root.querySelectorAll("[data-provider-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        providerFilter = btn.getAttribute("data-provider-filter");
        paint();
      });
    });

    root.querySelectorAll("[data-view-user]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedId = btn.getAttribute("data-view-user");
        paint();
      });
    });

    root.querySelectorAll("[data-close-drawer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedId = null;
        paint();
      });
    });

    refreshIcons();

    if (searchFocused && searchEl instanceof HTMLInputElement) {
      searchEl.focus();
      if (cursor != null) searchEl.setSelectionRange(cursor, cursor);
    }
  }

  paint();
}

export function renderSettingsPage(root) {
  const admin = getAdmin();
  root.innerHTML = `
    <div class="admin-content space-y-6">
      ${breadcrumbs("Settings")}
      ${pageHeader("Settings")}

      <div role="tablist" aria-label="Settings sections" class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800">
        <button type="button" role="tab" data-tab="account" aria-selected="true" class="settings-tab rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 bg-brand-500 text-white">
          Account
        </button>
        <button type="button" role="tab" data-tab="site" aria-selected="false" class="settings-tab rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8">
          Branding
        </button>
      </div>

      <div data-panel="account" role="tabpanel">
        <div class="admin-card admin-card-body space-y-6">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Account</h3>
            <p class="mt-1 text-sm text-gray-500">Signed-in administrator</p>
          </div>
          <dl class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Username</dt>
              <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${escapeHtml(admin?.username ?? "—")}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Email</dt>
              <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${escapeHtml(admin?.email ?? "—")}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
              <dd class="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">${escapeHtml(admin?.role ?? "—")}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
              <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">${
                admin?.lastLoginAt
                  ? escapeHtml(new Date(admin.lastLoginAt).toLocaleString())
                  : "—"
              }</dd>
            </div>
          </dl>
        </div>
      </div>

      <div data-panel="site" role="tabpanel" class="hidden">
        <div class="admin-card admin-card-body space-y-3">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Branding &amp; navigation</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Edit
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/scripts/config.js</code>
            to customize the panel name, logo letter, sidebar links, and login page copy.
          </p>
        </div>
      </div>
    </div>
  `;

  const tabs = root.querySelectorAll(".settings-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-tab");
      tabs.forEach((t) => {
        const selected = t.getAttribute("data-tab") === id;
        t.setAttribute("aria-selected", String(selected));
        t.className = selected
          ? "settings-tab rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 bg-brand-500 text-white"
          : "settings-tab rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8";
      });
      root.querySelectorAll("[data-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.getAttribute("data-panel") !== id);
      });
    });
  });

  refreshIcons();
}
