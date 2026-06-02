"use client";

import { adminConfig } from "@/config/admin.config";
import { AdminUserMenu } from "@/components/admin/layout/admin-user-menu";
import { useAdminSidebar } from "@/context/admin-sidebar-context";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export function AdminHeader() {
  const { isMobileOpen, isDesktop, toggleMobileSidebar } = useAdminSidebar();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <header className="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 ${isDesktop ? "lg:hidden" : ""}`}
          aria-label="Open menu"
        >
          {!isDesktop && isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <Link href="/admin" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            {adminConfig.brand.letter}
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Admin
          </span>
        </Link>

        <div className="hidden flex-1 md:block md:max-w-md lg:max-w-lg">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search…"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 focus:outline-none dark:border-gray-800 dark:bg-white/5 dark:text-white/90"
              aria-label="Search"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
          <AdminUserMenu />
        </div>
      </div>
    </header>
  );
}
