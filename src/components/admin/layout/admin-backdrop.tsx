"use client";

import { useAdminSidebar } from "@/context/admin-sidebar-context";

export function AdminBackdrop() {
  const { isMobileOpen, isDesktop, closeMobileSidebar } = useAdminSidebar();

  if (!isMobileOpen || isDesktop) return null;

  return (
    <button
      type="button"
      className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden"
      onClick={closeMobileSidebar}
      aria-label="Close navigation"
    />
  );
}
