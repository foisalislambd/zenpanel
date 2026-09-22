import { adminConfig } from "./config.js";
import { getAdmin } from "./auth.js";
import {
  demoActivity,
  demoChart,
  demoOrders,
  demoStats,
  demoUsers,
} from "./data.js";
import {
  escapeHtml,
  formatCurrency,
  formatRelativeTime,
  formatToday,
  getGreeting,
  icon,
  refreshIcons,
  sectionHeader,
} from "./utils.js";

const statusStyles = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-400",
  processing:
    "bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/15 dark:text-brand-400",
  completed:
    "bg-success-50 text-success-600 ring-success-600/20 dark:bg-success-500/15 dark:text-success-500",
  cancelled:
    "bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400",
};

const fallbackStatusStyle =
  "bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400";

const providerStyles = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

const providerColors = {
  email: "bg-brand-500",
  google: "bg-orange-500",
  apple: "bg-gray-600 dark:bg-gray-400",
  discord: "bg-indigo-500",
};

const activityConfig = {
  user: {
    icon: "user-plus",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/15",
  },
  order: {
    icon: "shopping-cart",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
  },
  payment: {
    icon: "credit-card",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
  },
  message: {
    icon: "mail",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
  },
  blog: {
    icon: "newspaper",
    color: "text-brand-600 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-500/15",
  },
  newsletter: {
    icon: "mail",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/15",
  },
};

const fallbackActivity = {
  icon: "activity",
  color: "text-gray-600 dark:text-gray-400",
  bg: "bg-gray-100 dark:bg-gray-800",
};

const quickLinks = [
  { name: "Manage projects", href: "/admin/projects", icon: "folder-kanban" },
  { name: "Manage services", href: "/admin/services", icon: "briefcase" },
  { name: "View messages", href: "/admin/messages", icon: "message-circle" },
  { name: "Write blog post", href: "/admin/blog", icon: "newspaper" },
  { name: "Add product", href: "/admin/products", icon: "package" },
  { name: "Manage users", href: "/admin/users", icon: "users" },
];

function statusBadge(status) {
  const style = statusStyles[status] ?? fallbackStatusStyle;
  return `<span class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}">${escapeHtml(status)}</span>`;
}

function providerBadge(provider) {
  const style =
    providerStyles[provider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800";
  return `<span class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${style}">${escapeHtml(provider)}</span>`;
}

function renderWelcome(username) {
  const name = username || adminConfig.brand.name;
  return `
    <div class="relative overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-5 sm:p-6 lg:p-8 dark:border-brand-500/20">
      <div class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-300/20 blur-2xl" aria-hidden="true"></div>
      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <p class="text-sm font-medium text-brand-100">${escapeHtml(getGreeting())}, ${escapeHtml(name)}</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Dashboard overview</h1>
          <p class="mt-2 flex items-center gap-2 text-sm text-brand-100/90">
            ${icon("calendar-days", "h-4 w-4 shrink-0")}
            ${escapeHtml(formatToday())}
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <a href="/admin/projects" class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            ${icon("folder-kanban", "h-4 w-4 shrink-0 text-brand-600")}
            <span class="text-brand-600">Manage projects</span>
          </a>
          <a href="/admin/settings" class="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
            ${icon("settings", "h-4 w-4")}
            Settings
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderStatCard({ label, value, iconName, iconColor, iconBg }) {
  return `
    <div class="admin-card overflow-hidden">
      <div class="flex items-center justify-between gap-3 p-4">
        <div class="min-w-0">
          <p class="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">${escapeHtml(label)}</p>
          <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">${escapeHtml(String(value))}</p>
        </div>
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}">
          ${icon(iconName, `h-5 w-5 ${iconColor}`)}
        </div>
      </div>
    </div>
  `;
}

function renderStatsCards(stats) {
  return `
    <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      ${renderStatCard({
        label: "Revenue",
        value: formatCurrency(stats.totalRevenue),
        iconName: "dollar-sign",
        iconColor: "text-brand-600 dark:text-brand-400",
        iconBg: "bg-brand-50 dark:bg-brand-500/15",
      })}
      ${renderStatCard({
        label: "Users",
        value: stats.totalUsers.toLocaleString(),
        iconName: "users",
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-50 dark:bg-blue-500/15",
      })}
      ${renderStatCard({
        label: "Orders",
        value: stats.newOrdersLast7Days.toLocaleString(),
        iconName: "shopping-cart",
        iconColor: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-50 dark:bg-violet-500/15",
      })}
      ${renderStatCard({
        label: "Messages",
        value: stats.unreadMessages.toLocaleString(),
        iconName: "message-circle",
        iconColor: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-500/15",
      })}
      ${renderStatCard({
        label: "Projects",
        value: stats.totalProjects.toLocaleString(),
        iconName: "folder-kanban",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
      })}
      ${renderStatCard({
        label: "Subscribers",
        value: stats.newsletterSubscribers.toLocaleString(),
        iconName: "mail",
        iconColor: "text-rose-600 dark:text-rose-400",
        iconBg: "bg-rose-50 dark:bg-rose-500/15",
      })}
    </div>
  `;
}

function chartNiceMax(value) {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exp;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * exp;
}

function chartAxisMoney(value) {
  if (value >= 1000) {
    const thousands = value / 1000;
    const label = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1);
    return `$${label}k`;
  }
  return formatCurrency(value);
}

function chartSeries(source, days) {
  if (!source.length) return [];
  const end = new Date(2026, 8, 22);
  const points = [];
  for (let ago = days - 1; ago >= 0; ago--) {
    const date = new Date(end);
    date.setDate(end.getDate() - ago);
    const known = ago < source.length ? source[source.length - 1 - ago] : undefined;
    const seed = (date.getDate() * 17 + date.getMonth() * 13) % 97;
    points.push({
      label:
        days <= 7 && known
          ? known.label
          : date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: known?.revenue ?? 3200 + ((seed * 61) % 5400),
      orders: known?.orders ?? 2 + (seed % 8),
    });
  }
  return points;
}

function chartShowsLabel(index, count) {
  if (count <= 7) return true;
  const step = count <= 30 ? 5 : 15;
  return index === 0 || index === count - 1 || index % step === 0;
}

let chartDays = 7;

function renderRevenueChart(data) {
  const series = chartSeries(data, chartDays);
  const totalRevenue = series.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = series.reduce((sum, d) => sum + d.orders, 0);
  const chartSummary = `${chartDays}-day revenue ${formatCurrency(totalRevenue)} across ${totalOrders} orders`;
  const ranges = [
    { days: 7, label: "7D" },
    { days: 30, label: "30D" },
    { days: 90, label: "90D" },
  ];
  const trailing = `
    <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-white/10" role="group" aria-label="Chart range">
      ${ranges
        .map(
          (range) => `
        <button
          type="button"
          data-chart-days="${range.days}"
          aria-pressed="${chartDays === range.days}"
          class="rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
            chartDays === range.days
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }"
        >${range.label}</button>
      `,
        )
        .join("")}
    </div>
  `;

  const width = 640;
  const height = 220;
  const pad = { l: 46, r: 16, t: 18, b: 28 };
  const ceiling = chartNiceMax(Math.max(...series.map((d) => d.revenue), 1));
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const baseline = pad.t + innerH;
  const points = series.map((point, index) => {
    const x = series.length === 1 ? pad.l + innerW / 2 : pad.l + (index / (series.length - 1)) * innerW;
    const y = pad.t + (1 - point.revenue / ceiling) * innerH;
    return { ...point, x, y, showLabel: chartShowsLabel(index, series.length), showDot: series.length <= 14 };
  });
  let line = points.length ? `M ${points[0].x} ${points[0].y}` : "";
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const curve = (next.x - current.x) / 2;
    line += ` C ${current.x + curve} ${current.y}, ${next.x - curve} ${next.y}, ${next.x} ${next.y}`;
  }
  const area = points.length
    ? `${line} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
    : "";
  const ticks = [ceiling, ceiling / 2, 0];

  const chartMarkup =
    series.length === 0
      ? `<div class="flex h-52 items-center justify-center text-sm text-gray-500 dark:text-gray-400">No revenue data yet</div>`
      : `
        <div class="relative w-full" style="aspect-ratio:${width} / ${height}">
          <svg viewBox="0 0 ${width} ${height}" class="h-full w-full" role="img" aria-label="${escapeHtml(chartSummary)}">
            <defs>
              <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#465fff" stop-opacity="0.35"></stop>
                <stop offset="100%" stop-color="#465fff" stop-opacity="0.02"></stop>
              </linearGradient>
            </defs>
            ${ticks
              .map((tick) => {
                const y = pad.t + (1 - tick / ceiling) * innerH;
                return `
                  <line x1="${pad.l}" x2="${width - pad.r}" y1="${y}" y2="${y}" stroke="#e4e7ec" ${tick === 0 ? "" : 'stroke-dasharray="4 6"'}></line>
                  <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" fill="#98a2b3" font-size="11">${escapeHtml(chartAxisMoney(tick))}</text>
                `;
              })
              .join("")}
            <path d="${area}" fill="url(#revenue-area)"></path>
            <path d="${line}" fill="none" stroke="#465fff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></path>
            ${points
              .map(
                (point) => `
                  ${
                    point.showLabel
                      ? `<text x="${point.x}" y="${height - 8}" text-anchor="middle" fill="#667085" font-size="11">${escapeHtml(point.label)}</text>`
                      : ""
                  }
                  ${
                    point.showDot
                      ? `<circle cx="${point.x}" cy="${point.y}" r="3.5" fill="#ffffff" stroke="#465fff" stroke-width="2">
                    <title>${escapeHtml(point.label)}: ${formatCurrency(point.revenue)} · ${point.orders} orders</title>
                  </circle>`
                      : ""
                  }
                `,
              )
              .join("")}
          </svg>
        </div>
      `;

  return `
    <div class="admin-card w-full overflow-hidden">
      ${sectionHeader({ title: "Revenue", trailing })}
      <div class="px-3 pt-3 pb-4 sm:px-5">
        ${chartMarkup}
      </div>
    </div>
  `;
}

function renderActivityFeed(items) {
  return `
    <div class="admin-card overflow-hidden">
      ${sectionHeader({ title: "Activity" })}
      ${
        items.length === 0
          ? `<div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No recent activity</div>`
          : `
            <ul class="admin-scrollbar max-h-[380px] divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
              ${items
                .map((item) => {
                  const config = activityConfig[item.type] ?? fallbackActivity;
                  return `
                    <li class="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}">
                        ${icon(config.icon, `h-3.5 w-3.5 ${config.color}`)}
                      </span>
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm text-gray-900 dark:text-white">${escapeHtml(item.title)}</p>
                        ${
                          item.description
                            ? `<p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">${escapeHtml(item.description)}</p>`
                            : ""
                        }
                      </div>
                      ${
                        item.meta
                          ? `<span class="shrink-0 text-sm font-medium text-gray-900 dark:text-white">${escapeHtml(item.meta)}</span>`
                          : ""
                      }
                      <span class="shrink-0 text-xs tabular-nums text-gray-400">${escapeHtml(formatRelativeTime(item.timestamp))}</span>
                    </li>
                  `;
                })
                .join("")}
            </ul>
          `
      }
    </div>
  `;
}

function renderDashboardSidebar(stats) {
  const providers = Object.entries(stats.usersByProvider);
  return `
    <div class="flex flex-col gap-4">
      <div class="admin-card overflow-hidden">
        ${sectionHeader({ title: "Quick actions" })}
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          ${quickLinks
            .map(
              (link) => `
            <li>
              <a href="${escapeHtml(link.href)}" class="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]">
                ${icon(link.icon, "h-4 w-4 shrink-0 text-gray-400")}
                <span class="min-w-0 flex-1">${escapeHtml(link.name)}</span>
                ${icon("chevron-right", "h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600")}
              </a>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
      <div class="admin-card overflow-hidden">
        ${sectionHeader({ title: "Users by provider" })}
        <div class="space-y-3.5 px-5 py-4">
          ${providers
            .map(([provider, count]) => {
              const pct =
                stats.totalUsers > 0
                  ? Math.round((count / stats.totalUsers) * 100)
                  : 0;
              return `
                <div>
                  <div class="mb-1 flex items-center justify-between text-sm">
                    <span class="capitalize text-gray-600 dark:text-gray-400">${escapeHtml(provider)}</span>
                    <span class="font-medium tabular-nums text-gray-900 dark:text-white">
                      ${count.toLocaleString()}
                      <span class="ml-1 text-xs font-normal text-gray-400">${pct}%</span>
                    </span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div class="h-full rounded-full ${providerColors[provider] ?? "bg-gray-400"}" style="width:${pct}%"></div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;
}

/**
 * @param {typeof demoOrders} orders
 * @param {{ showHeaderLink?: boolean }} [options]
 */
export function renderOrdersTable(orders, { showHeaderLink = true } = {}) {
  return `
    <div class="admin-card w-full overflow-hidden">
      ${sectionHeader({
        title: "Recent orders",
        href: showHeaderLink ? "/admin/service-orders" : undefined,
      })}
      ${
        orders.length === 0
          ? `<div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No orders yet</div>`
          : `
            <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              ${orders
                .map(
                  (order) => `
                <li class="px-5 py-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">${escapeHtml(order.customer)}</p>
                      <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">${escapeHtml(order.service)}</p>
                    </div>
                    <p class="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">${formatCurrency(order.amount)}</p>
                  </div>
                  <div class="mt-2 flex items-center justify-between gap-2">
                    ${statusBadge(order.status)}
                    <span class="font-mono text-xs text-gray-400">${escapeHtml(order.id)}</span>
                  </div>
                </li>
              `,
                )
                .join("")}
            </ul>
            <div class="admin-scrollbar hidden overflow-x-auto md:block">
              <table class="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Order</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Customer</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Service</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  ${orders
                    .map(
                      (order) => `
                    <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td class="px-5 py-3 font-mono text-xs text-gray-500">${escapeHtml(order.id)}</td>
                      <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">${escapeHtml(order.customer)}</td>
                      <td class="max-w-[180px] truncate px-5 py-3 text-gray-600 dark:text-gray-400">${escapeHtml(order.service)}</td>
                      <td class="px-5 py-3 font-medium tabular-nums text-gray-900 dark:text-white">${formatCurrency(order.amount)}</td>
                      <td class="px-5 py-3">${statusBadge(order.status)}</td>
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
  `;
}

/**
 * @param {typeof demoUsers} users
 * @param {{ showHeaderLink?: boolean }} [options]
 */
export function renderUsersTable(users, { showHeaderLink = true } = {}) {
  return `
    <div class="admin-card w-full overflow-hidden">
      ${sectionHeader({
        title: "Recent users",
        href: showHeaderLink ? "/admin/users" : undefined,
      })}
      ${
        users.length === 0
          ? `<div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No users yet</div>`
          : `
            <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              ${users
                .map(
                  (user) => `
                <li class="px-5 py-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-medium text-gray-900 dark:text-white">${escapeHtml(user.name)}</p>
                      <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">${escapeHtml(user.email)}</p>
                    </div>
                    ${providerBadge(user.authProvider)}
                  </div>
                  <p class="mt-1.5 text-xs text-gray-400">${new Date(user.createdAt).toLocaleDateString()}</p>
                </li>
              `,
                )
                .join("")}
            </ul>
            <div class="admin-scrollbar hidden overflow-x-auto md:block">
              <table class="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Name</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Email</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Provider</th>
                    <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  ${users
                    .map(
                      (user) => `
                    <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">${escapeHtml(user.name)}</td>
                      <td class="max-w-[200px] truncate px-5 py-3 text-gray-600 dark:text-gray-400 lg:max-w-xs">${escapeHtml(user.email)}</td>
                      <td class="px-5 py-3">${providerBadge(user.authProvider)}</td>
                      <td class="px-5 py-3 whitespace-nowrap text-gray-500">${new Date(user.createdAt).toLocaleDateString()}</td>
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
  `;
}

/**
 * Render full Next-parity dashboard into `#dashboard-root` (or provided root).
 * @param {HTMLElement} [root]
 */
export function renderDashboard(root) {
  const el = root || document.getElementById("dashboard-root");
  if (!el) return;

  const admin = getAdmin();
  const stats = demoStats;
  const chart = demoChart;
  const activity = demoActivity;
  const orders = demoOrders;
  const users = demoUsers;

  el.innerHTML = `
    <div class="admin-content space-y-5">
      ${renderWelcome(admin?.username)}
      ${renderStatsCards(stats)}
      <div class="grid items-start gap-5 xl:grid-cols-3">
        <div class="space-y-5 xl:col-span-2">
          ${chart.length > 0 ? renderRevenueChart(chart) : ""}
          ${renderActivityFeed(activity)}
        </div>
        ${renderDashboardSidebar(stats)}
      </div>
      <div class="grid gap-5 lg:grid-cols-2">
        ${renderOrdersTable(orders)}
        ${renderUsersTable(users)}
      </div>
    </div>
  `;

  refreshIcons();
  el.querySelectorAll("[data-chart-days]").forEach((button) => {
    button.addEventListener("click", () => {
      chartDays = Number(button.getAttribute("data-chart-days")) || 7;
      renderDashboard(el);
    });
  });
}
