"use client";

import { adminConfig } from "@/config/admin.config";
import { AdminUserMenu } from "@/components/admin/layout/admin-user-menu";
import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import { useAdminSidebar } from "@/context/admin-sidebar-context";
import { cn } from "@/lib/cn";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminCommandPalette } from "@/components/admin/layout/admin-command-palette";
import Link from "next/link";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function AdminHeader() {
  const { isMobileOpen, isDesktop, toggleMobileSidebar } = useAdminSidebar();
  const { isOpen: isChatOpen, togglePanel: toggleChatPanel } = useAdminChatPanel();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="admin-topbar sticky top-0 z-30 w-full bg-white dark:bg-gray-900">
      <div className="flex h-full items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 ${isDesktop ? "lg:hidden" : ""}`}
          aria-label={!isDesktop && isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={!isDesktop ? isMobileOpen : undefined}
        >
          {!isDesktop && isMobileOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>

        <Link href="/admin" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            {adminConfig.brand.letter}
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {adminConfig.brand.name}
          </span>
        </Link>

        <div className="hidden flex-1 lg:block lg:max-w-lg">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 pr-2 pl-3 text-sm text-gray-500 transition hover:border-gray-300 hover:bg-white dark:border-gray-800 dark:bg-white/5 dark:text-gray-400 dark:hover:border-gray-700"
            aria-label="Search pages and actions"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            <span className="flex-1 text-left">Search pages and actions…</span>
            <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
            aria-label="Search pages and actions"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={toggleChatPanel}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
              isChatOpen
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5",
            )}
            aria-label={isChatOpen ? "Close AI assistant" : "Open AI assistant"}
            aria-expanded={isChatOpen}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">AI</span>
          </button>
          <AdminThemeToggle />
          <AdminUserMenu />
        </div>
      </div>
      <AdminCommandPalette open={paletteOpen} onClose={closePalette} />
    </header>
  );
}
