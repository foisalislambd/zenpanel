export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

export type NavigateOptions = {
  replace?: boolean;
};

export type AdminRouteId =
  | "home"
  | "admin-login"
  | "admin-dashboard"
  | "admin-projects"
  | "admin-services"
  | "admin-service-orders"
  | "admin-transactions"
  | "admin-payments"
  | "admin-blog"
  | "admin-products"
  | "admin-categories"
  | "admin-messages"
  | "admin-newsletter"
  | "admin-users"
  | "admin-settings"
  | "not-found";

export type MatchedRoute = {
  id: AdminRouteId;
  pathname: string;
};

const ADMIN_ROUTES: Record<string, AdminRouteId> = {
  "/admin": "admin-dashboard",
  "/admin/login": "admin-login",
  "/admin/projects": "admin-projects",
  "/admin/services": "admin-services",
  "/admin/service-orders": "admin-service-orders",
  "/admin/transactions": "admin-transactions",
  "/admin/payments": "admin-payments",
  "/admin/blog": "admin-blog",
  "/admin/products": "admin-products",
  "/admin/categories": "admin-categories",
  "/admin/messages": "admin-messages",
  "/admin/newsletter": "admin-newsletter",
  "/admin/users": "admin-users",
  "/admin/settings": "admin-settings",
};

export function matchRoute(pathname: string): MatchedRoute {
  const path = normalizePath(pathname);
  if (path === "/") return { id: "home", pathname: path };
  if (path.startsWith("/admin")) {
    const id = ADMIN_ROUTES[path] ?? "not-found";
    return { id, pathname: path };
  }
  return { id: "not-found", pathname: path };
}

export function isAdminRoute(pathname: string): boolean {
  return normalizePath(pathname).startsWith("/admin");
}

export function isAdminAuthRoute(pathname: string): boolean {
  return normalizePath(pathname) === "/admin/login";
}

export function isAdminDashboardRoute(pathname: string): boolean {
  const path = normalizePath(pathname);
  return path.startsWith("/admin") && path !== "/admin/login";
}

let pathname = $state(
  typeof window !== "undefined" ? normalizePath(window.location.pathname) : "/",
);

export function getPathname() {
  return pathname;
}

export function navigate(path: string, options: NavigateOptions = {}) {
  const next = normalizePath(path);
  if (normalizePath(window.location.pathname) === next) {
    pathname = next;
    return;
  }
  if (options.replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  pathname = next;
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    pathname = normalizePath(window.location.pathname);
  });
}

export function usePathname() {
  return {
    get current() {
      return pathname;
    },
    get route() {
      return matchRoute(pathname);
    },
  };
}
