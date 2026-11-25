/** 404 page. Inside /admin (signed in) it renders within the dashboard shell. */
import { getAdmin } from "./auth.js";
import { initTheme } from "./theme.js";
import { escapeHtml, icon, refreshIcons } from "./utils.js";
import { setDocumentTitle } from "./lib/preferences.js";

function body(inAdmin) {
  return `
    <div class="mx-auto flex max-w-md flex-col items-center text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">${icon("compass", "h-7 w-7")}</span>
      <p class="mt-6 text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
      <h1 class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">Page not found</h1>
      <p class="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        We couldn’t find
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs break-all text-gray-700 dark:bg-white/10 dark:text-gray-200">${escapeHtml(window.location.pathname)}</code>.
        It may have been moved, or the link is incorrect.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" data-back class="admin-btn admin-btn-secondary">${icon("arrow-left", "h-4 w-4")} Go back</button>
        <a href="${inAdmin ? "/admin" : "/"}" class="admin-btn admin-btn-primary">${icon("layout-dashboard", "h-4 w-4")} ${inAdmin ? "Back to dashboard" : "Back to home"}</a>
      </div>
    </div>`;
}

/**
 * Mount the 404 page into `#page-content`. Pass `mountAdminLayout` to render inside
 * the admin shell for signed-in /admin/* URLs.
 * @param {{ mountAdminLayout?: (options: object) => unknown }} [options]
 */
export async function renderNotFound(options = {}) {
  initTheme();
  const content = document.getElementById("page-content");
  if (!content) return;
  const inAdmin = window.location.pathname.startsWith("/admin") && Boolean(getAdmin());
  if (inAdmin && options.mountAdminLayout) {
    options.mountAdminLayout({ title: "Page not found" });
    content.innerHTML = `<div class="admin-content admin-card px-6 py-16 sm:py-24">${body(true)}</div>`;
  } else {
    content.hidden = false;
    content.innerHTML = `<main class="admin-shell flex min-h-dvh items-center justify-center px-6 py-16 dark:bg-gray-950">${body(false)}</main>`;
  }
  setDocumentTitle("Page not found");
  content.querySelector("[data-back]")?.addEventListener("click", () => history.back());
  refreshIcons();
}
