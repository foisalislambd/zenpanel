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

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
