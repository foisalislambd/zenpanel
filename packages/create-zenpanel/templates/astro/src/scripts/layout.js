import { adminConfig, adminNavItems } from "./config.js";
import { requireAuth, logout, getAdmin } from "./auth.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";
import { escapeHtml, icon, refreshIcons } from "./utils.js";

const SIDEBAR_KEY = "zenpanel-sidebar-expanded";
const CHAT_KEY = "zenpanel-chat-open";

function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isActive(href) {
  const path = normalizePath(window.location.pathname);
  if (href === "/admin") {
    return path === "/admin" || path === "/admin/index.html";
  }
  return path === href || path === `${href}.html` || path.startsWith(`${href}/`);
}

/**
 * @param {{ title?: string, fullBleed?: boolean }} options
 */
export function mountAdminLayout(options = {}) {
  const { title = "Admin", fullBleed = false } = options;
  initTheme();
  const admin = requireAuth();
  if (!admin) return null;

  const layoutRoot = document.getElementById("layout-root");
  const pageContent = document.getElementById("page-content");
  if (!layoutRoot || !pageContent) return null;

  let expanded = true;
  try {
    expanded = localStorage.getItem(SIDEBAR_KEY) !== "0";
  } catch {
    // ignore
  }
  let mobileOpen = false;
  let chatOpen = false;
  try {
    chatOpen = localStorage.getItem(CHAT_KEY) === "1";
  } catch {
    // ignore
  }
  let userMenuOpen = false;
  let mounted = false;

  function sidebarWidth() {
    if (!isDesktop()) return 0;
    return expanded ? 260 : 80;
  }

  function closeUserMenu() {
    userMenuOpen = false;
    const menu = layoutRoot.querySelector("[data-user-menu]");
    if (menu) menu.hidden = true;
    const trigger = layoutRoot.querySelector("[data-action='toggle-user-menu']");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    const chevron = layoutRoot.querySelector("[data-user-chevron]");
    if (chevron) chevron.classList.remove("rotate-180");
  }

  function onAction(action) {
    if (action === "toggle-theme") {
      toggleTheme();
      paintChrome();
      return;
    }
    if (action === "toggle-sidebar") {
      expanded = !expanded;
      try {
        localStorage.setItem(SIDEBAR_KEY, expanded ? "1" : "0");
      } catch {
        // ignore
      }
      paintChrome();
      return;
    }
    if (action === "open-mobile") {
      mobileOpen = true;
      paintChrome();
      return;
    }
    if (action === "close-mobile") {
      mobileOpen = false;
      paintChrome();
      return;
    }
    if (action === "toggle-chat") {
      chatOpen = !chatOpen;
      try {
        localStorage.setItem(CHAT_KEY, chatOpen ? "1" : "0");
      } catch {
        // ignore
      }
      paintChrome();
      return;
    }
    if (action === "toggle-user-menu") {
      userMenuOpen = !userMenuOpen;
      const menu = layoutRoot.querySelector("[data-user-menu]");
      if (menu) menu.hidden = !userMenuOpen;
      const trigger = layoutRoot.querySelector("[data-action='toggle-user-menu']");
      if (trigger) trigger.setAttribute("aria-expanded", String(userMenuOpen));
      const chevron = layoutRoot.querySelector("[data-user-chevron]");
      if (chevron) chevron.classList.toggle("rotate-180", userMenuOpen);
      return;
    }
    if (action === "logout") {
      logout();
      window.location.replace("/admin/login");
    }
  }

  function bindActions(scope) {
    scope.querySelectorAll("[data-action]").forEach((el) => {
      if (el.dataset.bound === "1") return;
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onAction(el.getAttribute("data-action"));
      });
    });
  }

  function paintSidebar() {
    const showLabels = !isDesktop() || expanded || mobileOpen;
    const { brand } = adminConfig;
    const sidebar = layoutRoot.querySelector("[data-sidebar]");
    if (!sidebar) return;

    sidebar.style.width = isDesktop()
      ? `${expanded ? 260 : 80}px`
      : `${Math.min(320, 260)}px`;
    sidebar.classList.toggle("translate-x-0", mobileOpen || isDesktop());
    sidebar.classList.toggle("-translate-x-full", !(mobileOpen || isDesktop()));
    sidebar.setAttribute("aria-hidden", mobileOpen || isDesktop() ? "false" : "true");
    if (!(mobileOpen || isDesktop())) {
      sidebar.setAttribute("inert", "");
    } else {
      sidebar.removeAttribute("inert");
    }

    sidebar.innerHTML = `
      <div class="admin-topbar flex items-center gap-3 px-4">
        <a
          href="/admin"
          class="flex min-w-0 flex-1 items-center gap-3 ${!showLabels ? "justify-center" : ""}"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white">
            ${escapeHtml(brand.letter)}
          </span>
          ${
            showLabels
              ? `<div class="min-w-0">
                  <p class="truncate text-[15px] font-semibold text-gray-900 dark:text-white">${escapeHtml(brand.name)}</p>
                  <p class="truncate text-xs text-gray-500">${escapeHtml(brand.tagline)}</p>
                </div>`
              : ""
          }
        </a>
        ${
          !isDesktop()
            ? `<button type="button" data-action="close-mobile" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Close menu">${icon("x", "h-5 w-5")}</button>`
            : ""
        }
      </div>

      <nav class="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        ${
          showLabels
            ? `<p class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Menu</p>`
            : ""
        }
        ${adminNavItems
          .map((item) => {
            const active = isActive(item.href);
            return `
              <a
                href="${escapeHtml(item.href)}"
                title="${!showLabels ? escapeHtml(item.name) : ""}"
                aria-current="${active ? "page" : "false"}"
                class="group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                  active
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8"
                } ${!showLabels ? "justify-center px-0" : ""}"
              >
                ${icon(
                  item.icon,
                  `h-[22px] w-[22px] shrink-0 ${
                    active
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400"
                  }`,
                )}
                ${showLabels ? `<span class="truncate">${escapeHtml(item.name)}</span>` : ""}
              </a>
            `;
          })
          .join("")}
      </nav>

      <div class="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
        <a
          href="${escapeHtml(brand.siteUrl)}"
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 ${!showLabels ? "justify-center" : ""}"
          title="${!showLabels ? "View site" : ""}"
        >
          ${icon("external-link", "h-5 w-5 shrink-0")}
          ${showLabels ? "<span>View site</span>" : ""}
        </a>
        ${
          isDesktop()
            ? `<button
                type="button"
                data-action="toggle-sidebar"
                class="mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5 ${!showLabels ? "justify-center" : ""}"
                aria-label="${expanded ? "Collapse sidebar" : "Expand sidebar"}"
              >
                ${
                  expanded
                    ? `${icon("chevron-left", "h-5 w-5 shrink-0")}<span>Collapse</span>`
                    : icon("chevron-right", "h-5 w-5 shrink-0")
                }
              </button>`
            : ""
        }
      </div>
    `;
  }

  function paintHeader() {
    const { brand } = adminConfig;
    const header = layoutRoot.querySelector("[data-header]");
    if (!header) return;

    const dark = getTheme() === "dark";
    const initial = (admin.username || "A").charAt(0).toUpperCase();

    header.innerHTML = `
      <div class="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          data-action="${mobileOpen && !isDesktop() ? "close-mobile" : "open-mobile"}"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 lg:hidden"
          aria-label="${!isDesktop() && mobileOpen ? "Close menu" : "Open menu"}"
          aria-expanded="${!isDesktop() ? String(mobileOpen) : "false"}"
        >
          ${icon(!isDesktop() && mobileOpen ? "x" : "menu", "h-5 w-5")}
        </button>

        <a href="/admin" class="flex items-center gap-2 lg:hidden">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            ${escapeHtml(brand.letter)}
          </span>
          <span class="text-base font-semibold text-gray-900 dark:text-white">
            ${escapeHtml(brand.name)}
          </span>
        </a>

        <div class="hidden flex-1 lg:block lg:max-w-lg">
          <label class="relative block">
            ${icon("search", "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400")}
            <input
              type="search"
              disabled
              placeholder="Search — connect API to enable"
              class="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-500 placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/5 dark:text-gray-500"
              aria-label="Search"
              aria-describedby="admin-search-hint"
            />
            <span id="admin-search-hint" class="sr-only">
              Global search will be available after you connect your backend API.
            </span>
          </label>
        </div>

        <div class="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            data-action="toggle-chat"
            class="flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 ${
              chatOpen
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
            }"
            aria-label="Toggle AI assistant"
            aria-expanded="${chatOpen}"
          >
            ${icon("panel-right-open", "h-4 w-4")}
            <span class="hidden sm:inline">AI</span>
          </button>

          <button
            type="button"
            data-action="toggle-theme"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
            aria-label="${dark ? "Switch to light mode" : "Switch to dark mode"}"
          >
            ${icon(dark ? "sun" : "moon", "h-5 w-5")}
          </button>

          <div class="relative" data-user-menu-root>
            <button
              type="button"
              data-action="toggle-user-menu"
              class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-1.5 pr-2 pl-1.5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
              aria-expanded="${userMenuOpen}"
              aria-haspopup="menu"
              aria-controls="admin-user-menu"
            >
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white">
                ${escapeHtml(initial)}
              </span>
              <span class="hidden min-w-0 text-left md:block">
                <span class="block truncate text-sm font-medium text-gray-800 dark:text-white/90">
                  ${escapeHtml(admin.username ?? "admin")}
                </span>
                <span class="block max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
                  ${escapeHtml(admin.email ?? "")}
                </span>
              </span>
              ${icon("chevron-down", `hidden h-4 w-4 shrink-0 text-gray-500 transition md:block ${userMenuOpen ? "rotate-180" : ""}`)}
            </button>

            <div
              id="admin-user-menu"
              data-user-menu
              role="menu"
              class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              ${userMenuOpen ? "" : "hidden"}
            >
              <div class="border-b border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
                <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">${escapeHtml(admin.username ?? "")}</p>
                <p class="truncate text-xs text-gray-500">${escapeHtml(admin.email ?? "")}</p>
              </div>
              <a
                href="/admin/settings"
                role="menuitem"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5"
              >
                ${icon("settings", "h-4 w-4")}
                Settings
              </a>
              <button
                type="button"
                role="menuitem"
                data-action="logout"
                class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10"
              >
                ${icon("log-out", "h-4 w-4")}
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Fix chevron data attribute for rotate tracking
    const chevronEl = header.querySelector('[data-lucide="chevron-down"]');
    if (chevronEl) chevronEl.setAttribute("data-user-chevron", "");
  }

  function paintChat() {
    const chat = layoutRoot.querySelector("[data-chat-panel]");
    const chatOverlay = layoutRoot.querySelector("[data-chat-overlay]");
    if (!chat) return;

    const pushLayout = chatOpen && isDesktop() && !fullBleed;
    const overlay = fullBleed || !isDesktop();

    chat.classList.toggle("hidden", !chatOpen || (overlay && !chatOpen));
    if (chatOverlay) {
      chatOverlay.classList.toggle("hidden", !(chatOpen && overlay));
    }

    const panel = pushLayout
      ? chat
      : chatOverlay?.querySelector("[data-chat-inner]") || chat;

    const target = pushLayout ? chat : chatOverlay?.querySelector("[data-chat-inner]");
    if (!target && !pushLayout) return;

    const html = `
      <div class="admin-chat-panel flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${overlay ? "shadow-xl" : ""}">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">AI assistant</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Preview stub — connect your API</p>
          </div>
          <button type="button" data-action="toggle-chat" class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Close AI assistant">
            ${icon("x", "h-4 w-4")}
          </button>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          ${icon("sparkles", "h-8 w-8 text-brand-500")}
          <p class="text-sm font-medium text-gray-900 dark:text-white">Ask about ${escapeHtml(title)}</p>
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            This is a UI preview. Wire a chat API to enable responses.
          </p>
        </div>
        <div class="border-t border-gray-200 p-3 dark:border-gray-800">
          <div class="flex gap-2">
            <input
              type="text"
              disabled
              placeholder="Message — connect API to enable"
              class="h-10 flex-1 cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-white/5"
            />
            <button type="button" disabled class="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg bg-brand-500/50 text-white">
              ${icon("send", "h-4 w-4")}
            </button>
          </div>
        </div>
      </div>
    `;

    if (pushLayout) {
      chat.classList.remove("hidden");
      chat.classList.add("flex", "w-full", "max-w-md", "shrink-0");
      chat.innerHTML = html;
      if (chatOverlay) chatOverlay.classList.add("hidden");
    } else if (chatOpen && overlay && chatOverlay) {
      chat.classList.add("hidden");
      chatOverlay.classList.remove("hidden");
      const inner = chatOverlay.querySelector("[data-chat-inner]");
      if (inner) inner.innerHTML = html;
    } else {
      chat.classList.add("hidden");
      chat.innerHTML = "";
      if (chatOverlay) chatOverlay.classList.add("hidden");
    }

    void panel;
  }

  function paintChrome() {
    const spacer = layoutRoot.querySelector("[data-spacer]");
    const backdrop = layoutRoot.querySelector("[data-backdrop]");

    if (spacer) spacer.style.width = `${sidebarWidth()}px`;

    paintSidebar();
    paintHeader();
    paintChat();

    if (backdrop) {
      const show = mobileOpen && !isDesktop();
      backdrop.classList.toggle("hidden", !show);
    }

    bindActions(layoutRoot);
    refreshIcons();
  }

  if (!mounted) {
    layoutRoot.innerHTML = `
      <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
        <div class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block" data-spacer aria-hidden="true"></div>

        <aside
          data-sidebar
          class="fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 -translate-x-full lg:translate-x-0"
          aria-label="Admin navigation"
        ></aside>

        <button
          type="button"
          data-backdrop
          data-action="close-mobile"
          class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden hidden"
          aria-label="Close navigation"
        ></button>

        <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <header
              data-header
              class="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80"
            ></header>
            <main
              data-main
              class="admin-scrollbar min-h-0 flex-1 ${fullBleed ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"}"
            >
              <div class="${fullBleed ? "flex h-full min-h-0 flex-col px-0" : "w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8"}">
                <div class="${fullBleed ? "min-h-0 flex-1 w-full" : "w-full"}" data-main-slot></div>
              </div>
            </main>
          </div>
          <div data-chat-panel class="hidden"></div>
        </div>

        <div data-chat-overlay class="fixed inset-0 z-[60] hidden">
          <button type="button" data-action="toggle-chat" class="absolute inset-0 bg-gray-900/40" aria-label="Close AI assistant"></button>
          <div data-chat-inner class="absolute inset-y-0 right-0 flex w-full max-w-md"></div>
        </div>
      </div>
    `;

    const slot = layoutRoot.querySelector("[data-main-slot]");
    pageContent.hidden = false;
    pageContent.classList.remove("hidden");
    if (fullBleed) {
      pageContent.classList.add("flex", "h-full", "min-h-0", "flex-col");
    }
    slot.appendChild(pageContent);
    mounted = true;

    document.addEventListener("mousedown", (e) => {
      const root = layoutRoot.querySelector("[data-user-menu-root]");
      if (userMenuOpen && root && !root.contains(e.target)) {
        closeUserMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (userMenuOpen) closeUserMenu();
        if (mobileOpen && !isDesktop()) {
          mobileOpen = false;
          paintChrome();
        }
      }
    });
  }

  paintChrome();

  window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
    mobileOpen = false;
    paintChrome();
  });

  return { admin: getAdmin(), refresh: paintChrome };
}
