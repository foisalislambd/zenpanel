"use client";

import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";
import { DashboardSidebar } from "@/components/admin/dashboard/dashboard-sidebar";
import { DashboardWelcome } from "@/components/admin/dashboard/dashboard-welcome";
import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders-table";
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import {
  previewFetchActivity,
  previewFetchChartData,
  previewFetchRecentOrders,
  previewFetchStats,
  previewFetchUsers,
  type ActivityItem,
  type ChartDataPoint,
  type DashboardStats,
  type PortalUserRow,
  type RecentOrder,
} from "@/lib/admin-api";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<PortalUserRow[]>([]);
  const [chart, setChart] = useState<ChartDataPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      previewFetchStats(),
      previewFetchUsers(),
      previewFetchChartData(),
      previewFetchActivity(),
      previewFetchRecentOrders(),
    ])
      .then(([statsRes, usersRes, chartRes, activityRes, ordersRes]) => {
        setStats(statsRes.stats);
        setUsers(usersRes.users);
        setChart(chartRes.chart);
        setActivity(activityRes.activity);
        setOrders(ordersRes.orders);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>
        </div>
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
      <DashboardWelcome />

      {stats && <StatsCards stats={stats} />}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {chart.length > 0 && <RevenueChart data={chart} />}
          <ActivityFeed items={activity} />
        </div>

        {stats && (
          <DashboardSidebar
            usersByProvider={stats.usersByProvider}
            totalUsers={stats.totalUsers}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrdersTable orders={orders} />
        <RecentUsersTable users={users} />
      </div>
    </div>
  );
}
