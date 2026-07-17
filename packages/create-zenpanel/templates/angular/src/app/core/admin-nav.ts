import { adminNavItems, type AdminNavItem } from './admin.config';

export function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isAdminNavActive(pathname: string, href: string): boolean {
  const path = normalizePathname(pathname);
  const target = normalizePathname(href);
  if (target === '/admin') return path === '/admin';
  return path === target || path.startsWith(`${target}/`);
}

/** Longest href first so `/admin/foo` does not match `/admin/foo-bar` incorrectly. */
export function matchAdminNavItem(pathname: string): AdminNavItem | undefined {
  const path = normalizePathname(pathname);
  const sorted = [...adminNavItems].sort((a, b) => b.href.length - a.href.length);

  return sorted.find((item) =>
    item.href === '/admin' ? path === '/admin' : path.startsWith(item.href),
  );
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
