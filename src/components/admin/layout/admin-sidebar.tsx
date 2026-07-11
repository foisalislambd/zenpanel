"use client";

import { adminConfig, adminNavItems } from "@/config/admin.config";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/context/admin-sidebar-context";
import { isAdminNavActive } from "@/lib/admin-nav";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const {
    isExpanded,
    isMobileOpen,
    isDesktop,
    toggleSidebar,
    closeMobileSidebar,
  } = useAdminSidebar();

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  const showLabels = !isDesktop || isExpanded || isMobileOpen;
  const desktopWidth = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;
  const { brand } = adminConfig;

  return (
    <aside
      style={
        isDesktop
          ? { width: desktopWidth }
          : { width: Math.min(320, SIDEBAR_WIDTH_EXPANDED) }
      }
      className={`fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      aria-label="Admin navigation"
    >
      <div className="admin-topbar flex items-center gap-3 px-4">
        <Link
          href="/admin"
          onClick={closeMobileSidebar}
          className={`flex min-w-0 flex-1 items-center gap-3 ${!showLabels ? "justify-center" : ""}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white">
            {brand.letter}
          </span>
          {showLabels && (
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
                {brand.name}
              </p>
              <p className="truncate text-xs text-gray-500">{brand.tagline}</p>
            </div>
          )}
        </Link>
        {!isDesktop && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        {showLabels && (
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Menu
          </p>
        )}
        {adminNavItems.map((item) => {
          const active = isAdminNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileSidebar}
              title={!showLabels ? item.name : undefined}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                active
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8"
              } ${!showLabels ? "justify-center px-0" : ""}`}
            >
              <Icon
                className={`h-[22px] w-[22px] shrink-0 ${
                  active
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400"
                }`}
              />
              {showLabels && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
        <a
          href={brand.siteUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 ${!showLabels ? "justify-center" : ""}`}
          title={!showLabels ? "View site" : undefined}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {showLabels && <span>View site</span>}
        </a>

        {isDesktop && (
          <button
            type="button"
            onClick={toggleSidebar}
            className={`mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5 ${!showLabels ? "justify-center" : ""}`}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5 shrink-0" />
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
