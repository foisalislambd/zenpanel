export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatChange(percent) {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

export function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function icon(name, className = "h-[22px] w-[22px] shrink-0") {
  return `<i data-lucide="${escapeHtml(name)}" class="${escapeHtml(className)}"></i>`;
}

export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

export function emptyState({ iconName, title, description }) {
  return `
    <div class="flex flex-col items-center px-6 py-16 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
        ${icon(iconName, "h-7 w-7 text-gray-400 dark:text-gray-500")}
      </div>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</h3>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        ${escapeHtml(description)}
      </p>
    </div>
  `;
}

export function breadcrumbs(pageTitle) {
  if (!pageTitle) return "";
  return `
    <nav aria-label="Breadcrumb" class="mb-4">
      <ol class="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <a
            href="/admin"
            class="inline-flex items-center gap-1 rounded-md transition hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:text-gray-200"
          >
            ${icon("home", "h-3.5 w-3.5")}
            <span class="sr-only">Dashboard</span>
          </a>
        </li>
        <li aria-hidden>
          ${icon("chevron-right", "h-3.5 w-3.5 text-gray-300 dark:text-gray-600")}
        </li>
        <li>
          <span class="font-medium text-gray-700 dark:text-gray-300" aria-current="page">
            ${escapeHtml(pageTitle)}
          </span>
        </li>
      </ol>
    </nav>
  `;
}

export function pageHeader(title) {
  return `
    <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          ${escapeHtml(title)}
        </h1>
      </div>
    </div>
  `;
}

export function sectionHeader({ title, href, linkLabel = "View all", trailing = "" }) {
  const hasTrailing = Boolean(trailing);
  return `
    <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">${escapeHtml(title)}</h3>
      ${hasTrailing ? trailing : ""}
      ${
        href && !hasTrailing
          ? `<a href="${escapeHtml(href)}" class="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">${escapeHtml(linkLabel)}</a>`
          : ""
      }
    </div>
  `;
}
