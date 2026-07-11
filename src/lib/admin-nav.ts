import { adminNavItems, type AdminNavItem } from "@/config/admin.config";

/** Longest href first so `/admin/foo` does not match `/admin/foo-bar` incorrectly. */
export function matchAdminNavItem(pathname: string): AdminNavItem | undefined {
  const sorted = [...adminNavItems].sort((a, b) => b.href.length - a.href.length);

  return sorted.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
  );
}

export function isAdminNavActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
