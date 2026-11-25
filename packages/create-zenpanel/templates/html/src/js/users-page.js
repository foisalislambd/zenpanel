/**
 * Users management: search, status/provider filters, sortable table, pagination,
 * CSV export, details drawer, invite / edit / ban / delete with confirmation.
 */
import { previewFetchUsers } from "./lib/admin-api/preview.js";
import { validateUser } from "./lib/admin-forms.js";
import {
  USERS_CSV_HEADERS,
  capitalize,
  dash,
  filterUsers,
  initials,
  presentProviders,
  providerStyles,
  usersCsvRows,
} from "./lib/admin-resources.js";
import { formatDate } from "./lib/format.js";
import { ADMIN_PAGE_SIZE, slicePage } from "./lib/pagination.js";
import { downloadCsv, nextSort } from "./lib/sort.js";
import {
  addButton,
  applyFieldErrors,
  confirmDialog,
  emptyBlock,
  errorState,
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
  tableSkeleton,
  takeQueryFlag,
  thClass,
  toast,
} from "./ui.js";
import { escapeHtml, icon, navSectionFor, pageHeader, refreshIcons } from "./utils.js";

const avatar = (name) =>
  `<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" aria-hidden="true">${escapeHtml(initials(name))}</span>`;

function badges(user, { provider = true, status = true } = {}) {
  const pill = (cls, text) => `<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}">${escapeHtml(text)}</span>`;
  let html = "";
  if (provider) html += pill(`capitalize ${providerStyles[user.authProvider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800"}`, user.authProvider);
  if (status) {
    html +=
      user.status === "active"
        ? pill("bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500", "Active")
        : pill("bg-error-50 text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]", "Banned");
    if (!user.emailVerified) html += pill("bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", "Unverified");
  }
  return html;
}

/** Loads users (skeleton + retry), then renders the management UI. */
export function renderUsersPage(root) {
  if (!root) return;
  async function load() {
    root.innerHTML = tableSkeleton("Loading users…");
    try {
      const { users } = await previewFetchUsers();
      mountUsers(root, users);
    } catch (err) {
      root.innerHTML = `<div class="admin-content">${errorState({
        title: "Couldn't load users",
        message: err instanceof Error ? err.message : "Failed to load users",
      })}</div>`;
      refreshIcons();
      root.querySelector('[data-act="retry"]')?.addEventListener("click", load, { once: true });
    }
  }
  load();
}

function mountUsers(root, initialUsers) {
  const store = previewCollection("users", initialUsers);
  const state = {
    query: "",
    status: "all",
    provider: "all",
    sort: { key: "createdAt", direction: "desc" },
    page: 1,
    pageSize: ADMIN_PAGE_SIZE,
  };
  const filtered = () => filterUsers(store.get(), state.query, state.status, state.provider, state.sort);
  const findUser = (id) => store.get().find((u) => u.id === id);

  root.innerHTML = `
    <div class="admin-content">
      ${pageHeader("Users", `<span data-slot="export"></span>${addButton("Invite user")}`, navSectionFor("Users"))}
      <div class="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        ${searchBox({ value: "", placeholder: "Search name, email, phone, IP...", ariaLabel: "Search users" })}
        <div class="flex flex-wrap items-center gap-x-5 gap-y-3" data-slot="filters"></div>
      </div>
      <div class="admin-card w-full overflow-hidden" data-slot="list"></div>
    </div>`;
  const slots = {
    export: root.querySelector('[data-slot="export"]'),
    filters: root.querySelector('[data-slot="filters"]'),
    list: root.querySelector('[data-slot="list"]'),
  };
  const searchInput = root.querySelector("[data-search]");
  const clearBtn = root.querySelector('[data-act="clear-search"]');

  function paint() {
    const all = store.get();
    const rows = filtered();
    const paged = slicePage(rows, state.page, state.pageSize);
    state.page = paged.page;
    const hasFilters = state.query.trim() !== "" || state.status !== "all" || state.provider !== "all";
    slots.export.innerHTML = exportButton(rows.length === 0);
    clearBtn.hidden = !state.query;
    slots.filters.innerHTML =
      filterGroup({
        label: "Status",
        ariaLabel: "Filter by status",
        name: "status",
        value: state.status,
        options: [
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "banned", label: "Banned" },
        ],
      }) +
      filterGroup({
        label: "Provider",
        ariaLabel: "Filter by sign-in provider",
        name: "provider",
        value: state.provider,
        options: [{ value: "all", label: "All" }, ...presentProviders(all).map((p) => ({ value: p, label: capitalize(p) }))],
      });

    if (rows.length === 0) {
      slots.list.innerHTML = emptyBlock({
        iconName: "search-x",
        title: all.length === 0 ? "No users yet" : "No users match your filters",
        description: all.length === 0 ? "Invite your first user to get started." : "Try a different search or clear the filters.",
        action: hasFilters ? '<button type="button" data-act="clear-filters" class="admin-btn admin-btn-secondary">Clear filters</button>' : "",
      });
    } else {
      slots.list.innerHTML = `
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          ${paged.rows
            .map(
              (u) => `
            <li class="px-4 py-3.5">
              <div class="flex items-start justify-between gap-3">
                <button type="button" data-act="view" data-id="${escapeHtml(u.id)}" class="flex min-w-0 flex-1 gap-3 rounded-md text-left">
                  ${avatar(u.name)}
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-medium text-gray-900 dark:text-white">${escapeHtml(u.name)}</span>
                    <span class="mt-0.5 block truncate text-sm text-gray-500">${escapeHtml(u.email)}</span>
                    <span class="mt-2 flex flex-wrap items-center gap-1.5">${badges(u)}</span>
                  </span>
                </button>
                ${rowActions(u.name, u.id, { size: "md" })}
              </div>
            </li>`,
            )
            .join("")}
        </ul>
        <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="Users table">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                ${sortHeader("User", "name", state.sort)}
                ${sortHeader("Country", "country", state.sort)}
                <th scope="col" class="${thClass}">Phone</th>
                ${sortHeader("Provider", "authProvider", state.sort)}
                <th scope="col" class="${thClass}">Status</th>
                ${sortHeader("Joined", "createdAt", state.sort)}
                <th scope="col" class="${thClass} text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              ${paged.rows
                .map(
                  (u) => `
                <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                  <td class="px-5 py-3">
                    <button type="button" data-act="view" data-id="${escapeHtml(u.id)}" class="group flex items-center gap-3 rounded-md text-left">
                      ${avatar(u.name)}
                      <span>
                        <span class="block font-medium text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">${escapeHtml(u.name)}</span>
                        <span class="mt-0.5 block text-sm text-gray-500">${escapeHtml(u.email)}</span>
                      </span>
                    </button>
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">${escapeHtml(dash(u.country))}</td>
                  <td class="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">${escapeHtml(dash(u.phone))}</td>
                  <td class="px-5 py-3">${badges(u, { status: false })}</td>
                  <td class="px-5 py-3"><div class="flex flex-wrap items-center gap-1.5">${badges(u, { provider: false })}</div></td>
                  <td class="px-5 py-3 whitespace-nowrap text-gray-500"><time datetime="${escapeHtml(u.createdAt)}">${escapeHtml(formatDate(u.createdAt))}</time></td>
                  <td class="px-5 py-3">${rowActions(u.name, u.id)}</td>
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>`;
    }
    slots.list.insertAdjacentHTML("beforeend", pagination({ ...paged, total: rows.length, pageSize: state.pageSize }));
    refreshIcons();
  }

  function openEditor(user) {
    const id = "user-form";
    const existing = store
      .get()
      .filter((u) => !user || u.id !== user.id)
      .map((u) => u.email.toLowerCase());
    const field = (key, label, attrs, opts = {}) =>
      formField({ id: `${id}-${key}`, label, ...opts, control: `<input id="${id}-${key}" ${attrs} class="${inputClass}" />` });
    const dlg = openDialog({
      title: user ? "Edit user" : "Invite user",
      description: user ? "Update profile details and account status." : "They'll receive an email invitation to set a password.",
      body: `
        <form id="${id}" novalidate class="grid gap-4 sm:grid-cols-2">
          ${field("name", "Full name", `data-autofocus autocomplete="off" value="${escapeHtml(user?.name ?? "")}"`, { required: true, className: "sm:col-span-2" })}
          ${field("email", "Email", `type="email" autocomplete="off" placeholder="name@example.com" value="${escapeHtml(user?.email ?? "")}"`, { required: true, className: "sm:col-span-2" })}
          ${field("country", "Country", `value="${escapeHtml(user?.country ?? "")}"`)}
          ${field("phone", "Phone", `type="tel" placeholder="+1 555 000 0000" value="${escapeHtml(user?.phone ?? "")}"`)}
          ${formField({
            id: `${id}-status`,
            label: "Account status",
            className: "sm:col-span-2",
            control: `<select id="${id}-status" class="${inputClass}">
              <option value="active" ${user?.status !== "banned" ? "selected" : ""}>Active</option>
              <option value="banned" ${user?.status === "banned" ? "selected" : ""}>Banned</option>
            </select>`,
          })}
        </form>`,
      footer: `
        <button type="button" data-close class="admin-btn admin-btn-secondary">Cancel</button>
        <button type="submit" form="${id}" class="admin-btn admin-btn-primary">${user ? "Save changes" : "Send invite"}</button>`,
      onClose: () => newFlag.clear(),
    });
    dlg.root.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const v = (k) => f.querySelector(`#${id}-${k}`).value;
      const errors = validateUser({ name: v("name"), email: v("email"), phone: v("phone") }, existing);
      if (!applyFieldErrors(dlg.root, id, errors, ["name", "email", "phone"])) return;
      const input = {
        name: v("name").trim(),
        email: v("email").trim().toLowerCase(),
        country: v("country").trim() || null,
        phone: v("phone").trim() || null,
        status: v("status"),
      };
      if (!user) {
        const created = {
          id: previewId("u"),
          authProvider: "email",
          createdAt: new Date().toISOString(),
          emailVerified: false,
          lastIp: null,
          ...input,
        };
        store.set((list) => [created, ...list]);
        state.page = 1;
        toast({ title: "User invited", description: `An invitation was sent to ${created.email}.` });
      } else {
        store.set((list) => list.map((u) => (u.id === user.id ? { ...u, ...input } : u)));
        toast({ title: "User updated", description: `${input.name}'s profile was saved.` });
      }
      dlg.close();
      paint();
    });
  }

  function openViewer(user) {
    const rows = [
      ["Country", dash(user.country)],
      ["Phone", dash(user.phone)],
      ["Email verified", user.emailVerified ? "Yes" : "No"],
      ["Last IP", dash(user.lastIp)],
      ["Joined", new Date(user.createdAt).toLocaleString()],
      ["User ID", user.id],
    ];
    const banned = user.status === "banned";
    const dlg = openDialog({
      title: user.name,
      description: user.email,
      placement: "right",
      body: `
        <div class="space-y-6">
          <div class="flex items-center gap-3">${avatar(user.name)}<div class="flex flex-wrap gap-1.5">${badges(user)}</div></div>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            ${rows
              .map(
                ([k, v]) => `<div><dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">${escapeHtml(k)}</dt><dd class="mt-1 break-words text-gray-900 dark:text-white">${escapeHtml(v)}</dd></div>`,
              )
              .join("")}
          </dl>
        </div>`,
      footer: `
        <button type="button" data-drawer="delete" class="admin-btn admin-btn-danger-ghost">Delete</button>
        <button type="button" data-drawer="ban" class="admin-btn admin-btn-secondary">${icon(banned ? "shield-check" : "ban", "h-4 w-4")} ${banned ? "Reactivate" : "Ban user"}</button>
        <button type="button" data-drawer="edit" class="admin-btn admin-btn-primary">Edit user</button>`,
    });
    const on = (name, fn) =>
      dlg.root.querySelector(`[data-drawer="${name}"]`).addEventListener("click", () => {
        dlg.close();
        fn(user);
      });
    on("edit", openEditor);
    on("delete", openDelete);
    on("ban", openBan);
  }

  function openDelete(user) {
    confirmDialog({
      title: "Delete user?",
      confirmLabel: "Delete user",
      message: `<strong class="font-semibold text-gray-900 dark:text-white">${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) and their data will be permanently removed. This cannot be undone.`,
      onConfirm: () => {
        store.set((list) => list.filter((u) => u.id !== user.id));
        toast({ title: "User deleted", description: `${user.name} was removed.` });
        paint();
      },
    });
  }

  function openBan(user) {
    const banned = user.status === "banned";
    confirmDialog({
      title: banned ? "Reactivate user?" : "Ban user?",
      confirmLabel: banned ? "Reactivate" : "Ban user",
      tone: banned ? "default" : "danger",
      message: escapeHtml(
        banned ? `${user.name} will be able to sign in again.` : `${user.name} will be signed out and blocked from signing in until reactivated.`,
      ),
      onConfirm: () => {
        const status = banned ? "active" : "banned";
        store.set((list) => list.map((u) => (u.id === user.id ? { ...u, status } : u)));
        toast({
          title: banned ? "User reactivated" : "User banned",
          description: banned ? `${user.name} can sign in again.` : `${user.name} can no longer sign in.`,
        });
        paint();
      },
    });
  }

  root.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act],[data-sort],[data-filter],[data-page]");
    if (!el || !root.contains(el) || el.disabled) return;
    if (el.dataset.sort) {
      state.sort = nextSort(state.sort, el.dataset.sort);
      state.page = 1;
      return paint();
    }
    if (el.dataset.filter) {
      state[el.dataset.filter] = el.dataset.value;
      state.page = 1;
      return paint();
    }
    if (el.dataset.page) {
      state.page = Number(el.dataset.page);
      return paint();
    }
    const user = el.dataset.id ? findUser(el.dataset.id) : null;
    switch (el.dataset.act) {
      case "add":
        return openEditor(null);
      case "export": {
        const rows = filtered();
        downloadCsv("users.csv", USERS_CSV_HEADERS, usersCsvRows(rows));
        return toast({ variant: "info", title: "Export ready", description: `${rows.length} users exported to CSV.` });
      }
      case "clear-search":
        state.query = "";
        searchInput.value = "";
        state.page = 1;
        return paint();
      case "clear-filters":
        Object.assign(state, { query: "", status: "all", provider: "all", page: 1 });
        searchInput.value = "";
        return paint();
      case "view":
        return user && openViewer(user);
      case "edit":
        return user && openEditor(user);
      case "delete":
        return user && openDelete(user);
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
