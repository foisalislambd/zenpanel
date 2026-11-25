// Generated from the shared ZenPanel TypeScript core - edit freely.
import { compareValues } from "./sort.js";
const RESOURCE_STATUSES = ["published", "draft", "archived"];
const resourceStatusStyles = {
  published: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  archived: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
};
const irregularPlurals = { category: "categories", post: "posts" };
function pluralize(label, count) {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}
function dash(value) {
  return value?.trim() ? value : "-";
}
function countResourceStatuses(items) {
  const c = { all: items.length, published: 0, draft: 0, archived: 0 };
  items.forEach((i) => c[i.status] += 1);
  return c;
}
function filterResources(items, query, status, sort) {
  const q = query.trim().toLowerCase();
  const list = items.filter((item) => {
    if (status !== "all" && item.status !== status) return false;
    if (!q) return true;
    return [item.title, item.meta ?? "", item.id].join(" ").toLowerCase().includes(q);
  });
  return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
}
const USER_PROVIDERS = ["email", "google", "apple", "discord"];
const providerStyles = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
};
function presentProviders(users) {
  const present = new Set(users.map((u) => u.authProvider));
  return USER_PROVIDERS.filter((p) => present.has(p));
}
function filterUsers(users, query, status, provider, sort) {
  const q = query.trim().toLowerCase();
  const list = users.filter((user) => {
    if (status !== "all" && user.status !== status) return false;
    if (provider !== "all" && user.authProvider !== provider) return false;
    if (!q) return true;
    return [user.name, user.email, user.phone ?? "", user.lastIp ?? "", user.country ?? ""].join(" ").toLowerCase().includes(q);
  });
  return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
}
function usersCsvRows(users) {
  return users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.country ?? "",
    u.phone ?? "",
    u.authProvider,
    u.status,
    u.emailVerified ? "yes" : "no",
    u.createdAt
  ]);
}
const USERS_CSV_HEADERS = ["ID", "Name", "Email", "Country", "Phone", "Provider", "Status", "Verified", "Joined"];
function pageWindow(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);
  return items;
}
function filterConversations(conversations, query) {
  const q = query.trim().toLowerCase();
  const last = (c) => new Date(c.messages[c.messages.length - 1].sentAt).getTime();
  const sorted = [...conversations].sort((a, b) => last(b) - last(a));
  if (!q) return sorted;
  return sorted.filter(
    (c) => [c.name, c.email, c.subject, ...c.messages.map((m) => m.body)].join(" ").toLowerCase().includes(q)
  );
}
export {
  RESOURCE_STATUSES,
  USERS_CSV_HEADERS,
  USER_PROVIDERS,
  capitalize,
  countResourceStatuses,
  dash,
  filterConversations,
  filterResources,
  filterUsers,
  initials,
  pageWindow,
  pluralize,
  presentProviders,
  providerStyles,
  resourceStatusStyles,
  usersCsvRows
};
