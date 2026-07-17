<script setup lang="ts">
import type { Component } from "vue";
import type { DashboardStats } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  FolderKanban,
  Mail,
  MessageCircle,
  ShoppingCart,
  Users,
} from "lucide-vue-next";

defineProps<{ stats: DashboardStats }>();

function formatChange(percent: number) {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

type StatCardProps = {
  label: string;
  sublabel?: string;
  value: string | number;
  icon: Component;
  iconBg: string;
  iconClass: string;
};

const cards: (stats: DashboardStats) => StatCardProps[] = (stats) => [
  {
    label: "Revenue",
    sublabel: `All time · ${formatChange(stats.revenueChangePercent)}`,
    value: formatCurrency(stats.totalRevenue),
    icon: DollarSign,
    iconBg: "bg-brand-50 dark:bg-brand-500/15",
    iconClass: "text-brand-600 dark:text-brand-400",
  },
  {
    label: "Users",
    sublabel: `+${stats.newUsersLast7Days.toLocaleString()} last 7 days`,
    value: stats.totalUsers.toLocaleString(),
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-500/15",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Orders",
    sublabel: `Last 7 days · ${formatChange(stats.ordersChangePercent)}`,
    value: stats.newOrdersLast7Days.toLocaleString(),
    icon: ShoppingCart,
    iconBg: "bg-violet-50 dark:bg-violet-500/15",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
  {
    label: "Messages",
    sublabel: "Unread",
    value: stats.unreadMessages.toLocaleString(),
    icon: MessageCircle,
    iconBg: "bg-amber-50 dark:bg-amber-500/15",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Projects",
    sublabel: "Total",
    value: stats.totalProjects.toLocaleString(),
    icon: FolderKanban,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Subscribers",
    sublabel: "Newsletter",
    value: stats.newsletterSubscribers.toLocaleString(),
    icon: Mail,
    iconBg: "bg-rose-50 dark:bg-rose-500/15",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
];
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
    <div
      v-for="card in cards($props.stats)"
      :key="card.label"
      class="admin-card overflow-hidden"
    >
      <div class="flex items-center justify-between gap-3 p-4">
        <div class="min-w-0">
          <p
            class="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            {{ card.label }}
          </p>
          <p v-if="card.sublabel" class="truncate text-[10px] text-gray-400 dark:text-gray-500">
            {{ card.sublabel }}
          </p>
          <p
            class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
          >
            {{ card.value }}
          </p>
        </div>
        <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', card.iconBg]">
          <component :is="card.icon" :class="['h-5 w-5', card.iconClass]" />
        </div>
      </div>
    </div>
  </div>
</template>
