export type MatchedRoute =
  | { id: "home" }
  | { id: "login" }
  | { id: "dashboard" }
  | { id: "settings" }
  | { id: "resource"; key: string; title: string }
  | { id: "admin-unknown" };

const RESOURCE_META: Record<string, string> = {
  projects: "Projects",
  services: "Services",
  "service-orders": "Service orders",
  transactions: "Transactions",
  payments: "Payments",
  blog: "Blog",
  products: "Products",
  categories: "Categories",
  messages: "Messages",
  newsletter: "Newsletter",
  users: "Users",
};

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function matchRoute(pathname = window.location.pathname): MatchedRoute {
  const path = normalizePath(pathname);
  if (path === "/") return { id: "home" };
  if (path === "/admin/login") return { id: "login" };
  if (path === "/admin") return { id: "dashboard" };
  if (path === "/admin/settings") return { id: "settings" };

  if (path.startsWith("/admin/")) {
    const key = path.slice("/admin/".length);
    const title = RESOURCE_META[key];
    if (title) return { id: "resource", key, title };
    return { id: "admin-unknown" };
  }

  return { id: "home" };
}

export type NavigateOptions = {
  replace?: boolean;
};

export function navigate(path: string, options: NavigateOptions = {}): void {
  if (normalizePath(window.location.pathname) === normalizePath(path)) return;
  if (options.replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}
