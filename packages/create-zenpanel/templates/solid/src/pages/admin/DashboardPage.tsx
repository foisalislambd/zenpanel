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
import { createResource, Show } from "solid-js";

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

type DashboardData = {
  stats: DashboardStats;
  users: PortalUserRow[];
  chart: ChartDataPoint[];
  activity: ActivityItem[];
  orders: RecentOrder[];
};

async function fetchDashboardData(): Promise<DashboardData> {
  const [statsRes, usersRes, chartRes, activityRes, ordersRes] = await Promise.all([
    previewFetchStats(),
    previewFetchUsers(),
    previewFetchChartData(),
    previewFetchActivity(),
    previewFetchRecentOrders(),
  ]);

  return {
    stats: statsRes.stats,
    users: usersRes.users,
    chart: chartRes.chart,
    activity: activityRes.activity,
    orders: ordersRes.orders,
  };
}

export default function AdminDashboardPage() {
  const [data] = createResource(fetchDashboardData);

  useAdminChatPageContext({
    pageId: "dashboard",
    title: "Dashboard",
    route: "/admin",
    description:
      "Analyze metrics, summarize revenue and orders, or get suggestions for your admin workflow.",
    getSnapshot: () => {
      const stats = data()?.stats;
      return stats
        ? {
            totalUsers: stats.totalUsers,
            totalRevenue: stats.totalRevenue,
            newOrdersLast7Days: stats.newOrdersLast7Days,
            unreadMessages: stats.unreadMessages,
            totalProjects: stats.totalProjects,
            newsletterSubscribers: stats.newsletterSubscribers,
            newUsersLast7Days: stats.newUsersLast7Days,
          }
        : {};
    },
    quickActions: DASHBOARD_QUICK_ACTIONS,
  });

  return (
    <Show when={!data.loading} fallback={<AdminLoading message="Loading dashboard…" />}>
      <Show
        when={!data.error}
        fallback={
          <div class="admin-card admin-card-body text-sm text-error-500">
            {data.error instanceof Error ? data.error.message : "Failed to load dashboard"}
          </div>
        }
      >
        <div class="admin-content space-y-5">
          <DashboardWelcome />

          <Show when={data()?.stats}>{(stats) => <StatsCards stats={stats()} />}</Show>

          <div class="grid items-start gap-5 xl:grid-cols-3">
            <div class="space-y-5 xl:col-span-2">
              <Show when={(data()?.chart.length ?? 0) > 0}>
                <RevenueChart data={data()!.chart} />
              </Show>
              <ActivityFeed items={data()?.activity ?? []} />
            </div>

            <Show when={data()?.stats}>
              {(stats) => (
                <DashboardSidebar
                  usersByProvider={stats().usersByProvider}
                  totalUsers={stats().totalUsers}
                />
              )}
            </Show>
          </div>

          <div class="grid gap-5 lg:grid-cols-2">
            <RecentOrdersTable orders={data()?.orders ?? []} />
            <RecentUsersTable users={data()?.users ?? []} />
          </div>
        </div>
      </Show>
    </Show>
  );
}
