import { adminNavItems, type AdminNavItem } from "@/config/admin.config";

/** Strip trailing slashes so `/admin/` matches `/admin`. */
export function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

/** Longest href first so `/admin/foo` does not match `/admin/foo-bar` incorrectly. */
export function matchAdminNavItem(pathname: string): AdminNavItem | undefined {
  const path = normalizePathname(pathname);
  const sorted = [...adminNavItems].sort((a, b) => b.href.length - a.href.length);

  return sorted.find((item) =>
    item.href === "/admin" ? path === "/admin" : path.startsWith(item.href),
  );
}

export function isAdminNavActive(pathname: string, href: string) {
  const path = normalizePathname(pathname);
  return href === "/admin" ? path === "/admin" : path.startsWith(href);
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
