"use client";

import { AdminGuard } from "@/components/admin/auth/admin-guard";
import { AdminBackdrop } from "@/components/admin/layout/admin-backdrop";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/context/admin-sidebar-context";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessagesPage = pathname === "/admin/messages";
  const { isExpanded, isDesktop } = useAdminSidebar();

  const sidebarWidth = isDesktop
    ? isExpanded
      ? SIDEBAR_WIDTH_EXPANDED
      : SIDEBAR_WIDTH_COLLAPSED
    : 0;

  return (
    <AdminGuard>
      <div className="admin-shell admin-main flex h-dvh w-full overflow-hidden">
        <div
          className="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
          style={{ width: sidebarWidth }}
          aria-hidden
        />

        <AdminSidebar />
        <AdminBackdrop />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main
            className={cn(
              "admin-scrollbar min-h-0 flex-1",
              isMessagesPage ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden",
            )}
          >
            <div
              className={cn(
                "w-full",
                isMessagesPage
                  ? "flex h-full min-h-0 flex-col px-0"
                  : "px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
              )}
            >
              <div className={cn("w-full", isMessagesPage && "min-h-0 flex-1")}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
