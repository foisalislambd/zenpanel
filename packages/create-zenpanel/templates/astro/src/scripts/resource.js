import {
  breadcrumbs,
  emptyState,
  escapeHtml,
  icon,
  pageHeader,
  refreshIcons,
} from "./utils.js";
import { demoUsers } from "./data.js";
import { renderUsersTable } from "./dashboard.js";
import { getAdmin } from "./auth.js";

const irregularPlurals = {
  category: "categories",
};

function pluralize(label, count) {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

const statusStyles = {
  published:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const disabledActionTitle = "Available after you connect your API";

/**
 * Resource list page (empty by default — matches Next ResourcePage)
 * @param {HTMLElement} root
 * @param {{ title: string, resourceLabel: string, items?: Array }} options
 */
export function renderResourcePage(root, { title, resourceLabel, items = [] }) {
  root.innerHTML = `
    <div class="admin-content space-y-6">
      ${breadcrumbs(title)}
      ${pageHeader(title)}
      <div class="admin-card w-full overflow-hidden">
        <div class="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              ${items.length} ${escapeHtml(pluralize(resourceLabel, items.length))}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              UI shell — wire your API to enable create, edit, and delete.
            </p>
          </div>
          <button
            type="button"
            disabled
            title="${disabledActionTitle}"
            class="inline-flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-brand-500/50 px-4 text-sm font-semibold text-white/90"
          >
            ${icon("plus", "h-4 w-4")}
            Add new
          </button>
        </div>
        ${
          items.length === 0
            ? emptyState({
                iconName: "database",
                title: `No ${resourceLabel.toLowerCase()} yet`,
                description: `This page is ready for your data. Connect your backend API to load, create, and manage ${resourceLabel.toLowerCase()} from here.`,
              })
            : `
              <div class="admin-scrollbar overflow-x-auto">
                <table class="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr class="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-white/[0.02]">
                      <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Title</th>
                      <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Status</th>
                      <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Details</th>
                      <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">Updated</th>
                      <th scope="col" class="px-6 py-3.5 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    ${items
                      .map(
                        (item) => `
                      <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white/90">${escapeHtml(item.title)}</td>
                        <td class="px-6 py-4">
                          <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[item.status] ?? statusStyles.draft}">
                            ${escapeHtml(item.status)}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-gray-500">${escapeHtml(item.meta ?? "—")}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500">${new Date(item.updatedAt).toLocaleDateString()}</td>
                        <td class="px-6 py-4">
                          <div class="flex items-center justify-end gap-1">
                            <button type="button" disabled title="${disabledActionTitle}" class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400" aria-label="Edit ${escapeHtml(item.title)}">${icon("pencil", "h-4 w-4")}</button>
                            <button type="button" disabled title="${disabledActionTitle}" class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400" aria-label="More actions">${icon("more-horizontal", "h-4 w-4")}</button>
                            <button type="button" disabled title="${disabledActionTitle}" class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400" aria-label="Delete">${icon("trash-2", "h-4 w-4")}</button>
                          </div>
                        </td>
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
  refreshIcons();
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

export function renderUsersPage(root) {
  root.innerHTML = `
    <div class="admin-content space-y-6">
      ${breadcrumbs("Users")}
      ${pageHeader("Users")}
      ${renderUsersTable(demoUsers, { showHeaderLink: false })}
    </div>
  `;
  refreshIcons();
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
