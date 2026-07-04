"use client";

import { adminConfig } from "@/config/admin.config";
import { AdminUserMenu } from "@/components/admin/layout/admin-user-menu";
import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { useAdminSidebar } from "@/context/admin-sidebar-context";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
  const { isMobileOpen, isDesktop, toggleMobileSidebar } = useAdminSidebar();

  return (
    <header className="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 ${isDesktop ? "lg:hidden" : ""}`}
          aria-label={!isDesktop && isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={!isDesktop ? isMobileOpen : undefined}
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
              disabled
              placeholder="Search — connect API to enable"
              className="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-500 placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/5 dark:text-gray-500"
              aria-label="Search"
              aria-describedby="admin-search-hint"
            />
            <span id="admin-search-hint" className="sr-only">
              Global search will be available after you connect your backend API.
            </span>
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <AdminThemeToggle />
          <AdminUserMenu />
        </div>
      </div>
    </header>
  );
}
