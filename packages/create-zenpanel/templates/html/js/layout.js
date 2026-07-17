import { adminConfig, adminNavItems } from "./config.js";
import { requireAuth, logout } from "./auth.js";
import { initTheme, toggleTheme, getTheme } from "./theme.js";

const SIDEBAR_KEY = "zenpanel-sidebar-expanded";

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
  return path === href || path === `${href}.html`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function icon(name) {
  return `<i data-lucide="${escapeHtml(name)}" style="width:22px;height:22px;flex-shrink:0"></i>`;
}

export function mountAdminLayout({ title }) {
  initTheme();
  const admin = requireAuth();
  if (!admin) return;

  const layoutRoot = document.getElementById("layout-root");
  const pageContent = document.getElementById("page-content");
  if (!layoutRoot || !pageContent) return;

  let expanded = true;
  try {
    expanded = localStorage.getItem(SIDEBAR_KEY) !== "0";
  } catch {
    // Private mode / blocked storage
  }
  let mobileOpen = false;
  let mounted = false;

  function sidebarWidth() {
    if (!isDesktop()) return 0;
    return expanded ? 260 : 80;
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
    if (action === "logout") {
      logout();
      window.location.replace("/admin/login");
    }
  }

  function bindActions(scope) {
    scope.querySelectorAll("[data-action]").forEach((el) => {
      if (el.dataset.bound === "1") return;
      el.dataset.bound = "1";
      el.addEventListener("click", () => {
        onAction(el.getAttribute("data-action"));
      });
    });
  }

  function paintChrome() {
    const showLabels = !isDesktop() || expanded || mobileOpen;
    const { brand } = adminConfig;
    const sidebar = layoutRoot.querySelector("[data-sidebar]");
    const spacer = layoutRoot.querySelector("[data-spacer]");
    const backdrop = layoutRoot.querySelector("[data-backdrop]");
    const titleEl = layoutRoot.querySelector("[data-page-title]");
    const themeBtn = layoutRoot.querySelector("[data-action='toggle-theme']");
    const userName = layoutRoot.querySelector("[data-user-name]");
    const userEmail = layoutRoot.querySelector("[data-user-email]");
    const userAvatar = layoutRoot.querySelector("[data-user-avatar]");

    if (spacer) spacer.style.width = `${sidebarWidth()}px`;
    if (titleEl) titleEl.textContent = title;
    if (userName) userName.textContent = admin.username;
    if (userEmail) userEmail.textContent = admin.email;
    if (userAvatar) {
      userAvatar.textContent = (admin.username || "A").charAt(0).toUpperCase();
    }
    if (themeBtn) {
      themeBtn.innerHTML = icon(getTheme() === "dark" ? "sun" : "moon");
      themeBtn.setAttribute(
        "aria-label",
        getTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    }

    if (sidebar) {
      sidebar.classList.toggle("collapsed", !expanded);
      sidebar.classList.toggle("mobile-closed", !(mobileOpen || isDesktop()));
      sidebar.setAttribute("aria-hidden", mobileOpen || isDesktop() ? "false" : "true");
      if (!(mobileOpen || isDesktop())) {
        sidebar.setAttribute("inert", "");
      } else {
        sidebar.removeAttribute("inert");
      }

      sidebar.innerHTML = `
        <div class="admin-topbar">
          <a href="/admin" style="display:flex;align-items:center;gap:0.75rem;min-width:0;flex:1;${showLabels ? "" : "justify-content:center"}">
            <span class="brand-mark">${escapeHtml(brand.letter)}</span>
            ${
              showLabels
                ? `<div class="brand-text" style="min-width:0"><div style="font-weight:600;font-size:15px">${escapeHtml(brand.name)}</div><div class="muted" style="font-size:12px">${escapeHtml(brand.tagline)}</div></div>`
                : ""
            }
          </a>
          ${!isDesktop() ? `<button type="button" class="icon-btn" data-action="close-mobile" aria-label="Close menu">${icon("x")}</button>` : ""}
        </div>
        <nav class="nav-list">
          ${showLabels ? `<p class="nav-label">Menu</p>` : ""}
          ${adminNavItems
            .map((item) => {
              const active = isActive(item.href);
              return `<a class="nav-link ${active ? "active" : ""}" href="${escapeHtml(item.href)}" title="${escapeHtml(item.name)}">${icon(item.icon)}${showLabels ? `<span class="nav-text">${escapeHtml(item.name)}</span>` : ""}</a>`;
            })
            .join("")}
        </nav>
        <div class="sidebar-footer">
          <a class="nav-link" href="${escapeHtml(brand.siteUrl || "/")}">${icon("external-link")}${showLabels ? `<span class="nav-text">View site</span>` : ""}</a>
          ${
            isDesktop()
              ? `<button type="button" class="btn btn-ghost" data-action="toggle-sidebar" style="width:100%;justify-content:${showLabels ? "flex-start" : "center"};gap:0.75rem">${expanded ? `${icon("chevron-left")}<span>Collapse</span>` : icon("chevron-right")}</button>`
              : ""
          }
        </div>
      `;
    }

    if (backdrop) {
      backdrop.hidden = !(mobileOpen && !isDesktop());
    }

    bindActions(layoutRoot);
    if (window.lucide) window.lucide.createIcons();
  }

  if (!mounted) {
    layoutRoot.innerHTML = `
      <div class="admin-main">
        <div class="admin-sidebar-spacer" data-spacer aria-hidden="true"></div>
        <aside class="admin-sidebar" data-sidebar aria-label="Admin navigation"></aside>
        <button type="button" class="backdrop" data-backdrop data-action="close-mobile" aria-label="Close menu" hidden></button>
        <div class="admin-content-wrap">
          <header class="admin-header">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <button type="button" class="icon-btn hidden-desktop" data-action="open-mobile" aria-label="Open menu">${icon("menu")}</button>
              <strong data-page-title style="font-size:0.95rem"></strong>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <button type="button" class="icon-btn" data-action="toggle-theme" aria-label="Toggle theme"></button>
              <div class="user-chip">
                <span class="user-avatar" data-user-avatar></span>
                <div class="only-desktop" style="flex-direction:column;align-items:flex-start;line-height:1.2">
                  <span style="font-size:0.875rem;font-weight:500" data-user-name></span>
                  <span class="muted" style="font-size:0.75rem" data-user-email></span>
                </div>
                <button type="button" class="btn btn-ghost" data-action="logout" style="height:2rem;padding:0 0.75rem">Sign out</button>
              </div>
            </div>
          </header>
          <main class="admin-main-scroll" data-main-slot></main>
        </div>
      </div>
    `;

    const slot = layoutRoot.querySelector("[data-main-slot]");
    pageContent.hidden = false;
    slot.appendChild(pageContent);
    mounted = true;
  }

  paintChrome();

  window.matchMedia("(min-width: 1024px)").addEventListener("change", () => {
    mobileOpen = false;
    paintChrome();
  });
}
