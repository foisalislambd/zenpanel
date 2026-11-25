/** Framework-agnostic helpers shared by the resource, users and messages pages. */
import type { AdminResource, AdminResourceStatus } from "@/app/lib/admin-data/resources";
import type { PortalUserRow } from "@/app/lib/admin-api";
import { compareValues, type SortState } from "@/app/lib/sort";

export const RESOURCE_STATUSES: AdminResourceStatus[] = ["published", "draft", "archived"];

export const resourceStatusStyles: Record<AdminResourceStatus, string> = {
  published: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  archived: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const irregularPlurals: Record<string, string> = { category: "categories", post: "posts" };

export function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function dash(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

export type ResourceStatusFilter = "all" | AdminResourceStatus;
export type ResourceSortKey = "title" | "status" | "updatedAt";

export function countResourceStatuses(items: AdminResource[]) {
  const c: Record<ResourceStatusFilter, number> = { all: items.length, published: 0, draft: 0, archived: 0 };
  items.forEach((i) => (c[i.status] += 1));
  return c;
}

export function filterResources(
  items: AdminResource[],
  query: string,
  status: ResourceStatusFilter,
  sort: SortState<ResourceSortKey>,
) {
  const q = query.trim().toLowerCase();
  const list = items.filter((item) => {
    if (status !== "all" && item.status !== status) return false;
    if (!q) return true;
    return [item.title, item.meta ?? "", item.id].join(" ").toLowerCase().includes(q);
  });
  return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
}

export const USER_PROVIDERS = ["email", "google", "apple", "discord"] as const;

export const providerStyles: Record<string, string> = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
};

export type UserStatusFilter = "all" | PortalUserRow["status"];
export type UserSortKey = "name" | "country" | "authProvider" | "createdAt";

export function presentProviders(users: PortalUserRow[]) {
  const present = new Set(users.map((u) => u.authProvider));
  return USER_PROVIDERS.filter((p) => present.has(p));
}

export function filterUsers(
  users: PortalUserRow[],
  query: string,
  status: UserStatusFilter,
  provider: string,
  sort: SortState<UserSortKey>,
) {
  const q = query.trim().toLowerCase();
  const list = users.filter((user) => {
    if (status !== "all" && user.status !== status) return false;
    if (provider !== "all" && user.authProvider !== provider) return false;
    if (!q) return true;
    return [user.name, user.email, user.phone ?? "", user.lastIp ?? "", user.country ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
  return [...list].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction));
}

export function usersCsvRows(users: PortalUserRow[]) {
  return users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.country ?? "",
    u.phone ?? "",
    u.authProvider,
    u.status,
    u.emailVerified ? "yes" : "no",
    u.createdAt,
  ]);
}

export const USERS_CSV_HEADERS = ["ID", "Name", "Email", "Country", "Phone", "Provider", "Status", "Verified", "Joined"];

/** Page-number window with ellipses for pagination controls. */
export function pageWindow(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);
  return items;
}

/** Conversations sorted by latest message, filtered by a search query. */
export function filterConversations<
  C extends { name: string; email: string; subject: string; messages: { body: string; sentAt: string }[] },
>(conversations: C[], query: string): C[] {
  const q = query.trim().toLowerCase();
  const last = (c: C) => new Date(c.messages[c.messages.length - 1].sentAt).getTime();
  const sorted = [...conversations].sort((a, b) => last(b) - last(a));
  if (!q) return sorted;
  return sorted.filter((c) =>
    [c.name, c.email, c.subject, ...c.messages.map((m) => m.body)].join(" ").toLowerCase().includes(q),
  );
}
