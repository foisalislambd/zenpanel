<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed.vue";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar.vue";
import DashboardWelcome from "@/components/admin/dashboard/DashboardWelcome.vue";
import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable.vue";
import RecentUsersTable from "@/components/admin/dashboard/RecentUsersTable.vue";
import RevenueChart from "@/components/admin/dashboard/RevenueChart.vue";
import StatsCards from "@/components/admin/dashboard/StatsCards.vue";
import AdminDashboardSkeleton from "@/components/admin/ui/AdminDashboardSkeleton.vue";
import AdminErrorState from "@/components/admin/ui/AdminErrorState.vue";
import { useAdminChatPageContext } from "@/composables/use-admin-chat-page-context";
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

const data = ref<DashboardData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const attempt = ref(0);

watchEffect((onCleanup) => {
  void attempt.value;
  let cancelled = false;
  onCleanup(() => (cancelled = true));
  loading.value = true;
  error.value = null;
  fetchDashboardData()
    .then((result) => {
      if (!cancelled) data.value = result;
    })
    .catch((err) => {
      if (!cancelled) error.value = err instanceof Error ? err.message : "Failed to load dashboard";
    })
    .finally(() => {
      if (!cancelled) loading.value = false;
    });
});

const chatContext = computed(() => ({
  pageId: "dashboard",
  title: "Dashboard",
  route: "/admin",
  description:
    "Analyze metrics, summarize revenue and orders, or get suggestions for your admin workflow.",
  getSnapshot: () => {
    const stats = data.value?.stats;
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

useAdminChatPageContext(chatContext);
</script>

<template>
  <AdminDashboardSkeleton v-if="loading" />
  <AdminErrorState v-else-if="error" title="Couldn't load the dashboard" :message="error" @retry="attempt++" />
  <div v-else-if="data" class="admin-content space-y-5">
    <DashboardWelcome />
    <StatsCards :stats="data.stats" />

    <div class="grid items-start gap-5 xl:grid-cols-3">
      <div class="space-y-5 xl:col-span-2">
        <RevenueChart v-if="data.chart.length > 0" :data="data.chart" />
        <ActivityFeed :items="data.activity" />
      </div>

      <DashboardSidebar
        :users-by-provider="data.stats.usersByProvider"
        :total-users="data.stats.totalUsers"
      />
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <RecentOrdersTable :orders="data.orders" />
      <RecentUsersTable :users="data.users" />
    </div>
  </div>
</template>
