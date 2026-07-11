"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export function AdminUserMenu() {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-1.5 pr-2 pl-1.5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white">
          {admin?.username?.charAt(0)?.toUpperCase() ?? "A"}
        </span>
        <span className="hidden min-w-0 text-left md:block">
          <span className="block truncate text-sm font-medium text-gray-800 dark:text-white/90">
            {admin?.username ?? "admin"}
          </span>
          <span className="block max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
            {admin?.email}
          </span>
        </span>
        <ChevronDown
          className={`hidden h-4 w-4 shrink-0 text-gray-500 transition md:block ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="border-b border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
              {admin?.username}
            </p>
            <p className="truncate text-xs text-gray-500">{admin?.email}</p>
          </div>
          <Link
            href="/admin/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
