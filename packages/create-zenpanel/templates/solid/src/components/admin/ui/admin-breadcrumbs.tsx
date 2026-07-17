import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";
import { ChevronRight, Home } from "lucide-solid";
import { A, useLocation } from "@solidjs/router";
import { createMemo, Show } from "solid-js";

export function AdminBreadcrumbs() {
  const location = useLocation();
  const pageTitle = createMemo(() => {
    const path = normalizePathname(location.pathname);
    return path === "/admin" ? null : matchAdminNavItem(path)?.name ?? null;
  });

  return (
    <Show when={pageTitle()}>
      <nav aria-label="Breadcrumb" class="mb-4">
        <ol class="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <A
              href="/admin"
              class="inline-flex items-center gap-1 rounded-md transition hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:text-gray-200"
            >
              <Home class="h-3.5 w-3.5" aria-hidden />
              <span class="sr-only">Dashboard</span>
            </A>
          </li>
          <li aria-hidden>
            <ChevronRight class="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
          </li>
          <li>
            <span class="font-medium text-gray-700 dark:text-gray-300" aria-current="page">
              {pageTitle()}
            </span>
          </li>
        </ol>
      </nav>
    </Show>
  );
}
