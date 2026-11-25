import { AdminDashboardShell } from "@/components/admin/layout/admin-dashboard-shell";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { Suspense } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The shell reads the pathname; dynamic segments (the admin 404 catch-all)
    // resolve it on the client, so give them a boundary to stream into.
    <Suspense fallback={<AdminLoading message="Loading…" fullHeight />}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </Suspense>
  );
}
