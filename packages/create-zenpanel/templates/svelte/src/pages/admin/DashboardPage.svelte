<script lang="ts">
  import ActivityFeed from "@/components/admin/dashboard/ActivityFeed.svelte";
  import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar.svelte";
  import DashboardWelcome from "@/components/admin/dashboard/DashboardWelcome.svelte";
  import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable.svelte";
  import RecentUsersTable from "@/components/admin/dashboard/RecentUsersTable.svelte";
  import RevenueChart from "@/components/admin/dashboard/RevenueChart.svelte";
  import StatsCards from "@/components/admin/dashboard/StatsCards.svelte";
  import AdminLoading from "@/components/admin/ui/AdminLoading.svelte";
  import { registerAdminChatPageContext } from "@/hooks/use-admin-chat-page-context.svelte";
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

  let data = $state<DashboardData | null>(null);
  let loading = $state(true);
  let error = $state<unknown>(null);

  $effect(() => {
    loading = true;
    error = null;
    fetchDashboardData()
      .then((result) => {
        data = result;
      })
      .catch((err) => {
        error = err;
      })
      .finally(() => {
        loading = false;
      });
  });

  registerAdminChatPageContext(() => ({
    pageId: "dashboard",
    title: "Dashboard",
    route: "/admin",
    description:
      "Analyze metrics, summarize revenue and orders, or get suggestions for your admin workflow.",
    getSnapshot: () => {
      const stats = data?.stats;
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
  }));
</script>

{#if loading}
  <AdminLoading message="Loading dashboard…" />
{:else if error}
  <div class="admin-card admin-card-body text-sm text-error-500">
    {error instanceof Error ? error.message : "Failed to load dashboard"}
  </div>
{:else if data}
  <div class="admin-content space-y-5">
    <DashboardWelcome />
    <StatsCards stats={data.stats} />

    <div class="grid items-start gap-5 xl:grid-cols-3">
      <div class="space-y-5 xl:col-span-2">
        {#if data.chart.length > 0}
          <RevenueChart data={data.chart} />
        {/if}
        <ActivityFeed items={data.activity} />
      </div>

      <DashboardSidebar usersByProvider={data.stats.usersByProvider} totalUsers={data.stats.totalUsers} />
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <RecentOrdersTable orders={data.orders} />
      <RecentUsersTable users={data.users} />
    </div>
  </div>
{/if}
