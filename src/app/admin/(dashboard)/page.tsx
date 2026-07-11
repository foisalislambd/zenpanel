"use client";

import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";
import { DashboardSidebar } from "@/components/admin/dashboard/dashboard-sidebar";
import { DashboardWelcome } from "@/components/admin/dashboard/dashboard-welcome";
import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders-table";
import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useAdminChatPageContext } from "@/hooks/use-admin-chat-page-context";
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

const DASHBOARD_QUICK_ACTIONS = [
  {
    id: "growth",
    label: "Analyze growth",
    prompt: "Analyze our user growth metrics and summarize key trends",
  },
  {
    id: "revenue",
    label: "Revenue summary",
    prompt: "Summarize revenue and order performance for this week",
  },
  {
    id: "help",
    label: "What can you do?",
    prompt: "What can you help me with on the dashboard?",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<PortalUserRow[]>([]);
  const [chart, setChart] = useState<ChartDataPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAdminChatPageContext({
    pageId: "dashboard",
    title: "Dashboard",
    route: "/admin",
    description:
      "Analyze metrics, summarize revenue and orders, or get suggestions for your admin workflow.",
    getSnapshot: () =>
      stats
        ? {
            totalUsers: stats.totalUsers,
            totalRevenue: stats.totalRevenue,
            newOrdersLast7Days: stats.newOrdersLast7Days,
            unreadMessages: stats.unreadMessages,
            totalProjects: stats.totalProjects,
            newsletterSubscribers: stats.newsletterSubscribers,
            newUsersLast7Days: stats.newUsersLast7Days,
          }
        : {},
    quickActions: DASHBOARD_QUICK_ACTIONS,
  });

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
    return <AdminLoading message="Loading dashboard…" />;
  }

  if (error) {
    return (
      <div className="admin-card admin-card-body text-sm text-error-500">{error}</div>
    );
  }

  return (
    <div className="admin-content space-y-5">
      <DashboardWelcome />

      {stats && <StatsCards stats={stats} />}

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
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

      <div className="grid gap-5 lg:grid-cols-2">
        <RecentOrdersTable orders={orders} />
        <RecentUsersTable users={users} />
      </div>
    </div>
  );
}
