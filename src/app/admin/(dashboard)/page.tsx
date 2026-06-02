"use client";

import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { DemoModeBanner } from "@/components/admin/shared/demo-mode-banner";
import {
  AdminApiError,
  fetchAdminStats,
  fetchPortalUsers,
  type DashboardStats,
  type PortalUserRow,
} from "@/lib/admin-api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<PortalUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchPortalUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.stats);
        setUsers(usersRes.users.slice(0, 8));
      })
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card admin-card-body text-sm text-error-500">{error}</div>
    );
  }

  return (
    <div className="admin-content space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of portal activity, signups, and user growth."
      />
      <DemoModeBanner />
      {stats && <StatsCards stats={stats} />}
      <RecentUsersTable users={users} />
    </div>
  );
}
