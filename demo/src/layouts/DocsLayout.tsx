import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { adminConfig } from "@/config/admin.config";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export function DocsLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-[#f7f8fb] text-gray-900 dark:bg-gray-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 lg:hidden dark:border-gray-800 dark:text-gray-300"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                {adminConfig.brand.letter}
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {adminConfig.brand.name}
                <span className="ml-1.5 font-normal text-gray-400">Docs</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/login"
              className="hidden h-9 items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:inline-flex dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Admin
            </Link>
            <AdminThemeToggle className="h-9 w-9" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200/80 px-4 py-8 lg:block dark:border-gray-800">
          <DocsSidebar />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-30 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-gray-950/40"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute top-14 bottom-0 left-0 w-[min(18rem,85vw)] overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <DocsSidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <DocsShell>
            <Outlet />
            <DocsPager />
          </DocsShell>
        </main>
      </div>
    </div>
  );
}

function DocsShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-3xl pb-16">{children}</div>;
}
