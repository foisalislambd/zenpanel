<script setup lang="ts">
import { computed } from "vue";
import DashboardSectionHeader from "@/components/admin/dashboard/DashboardSectionHeader.vue";
import type { ChartDataPoint } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";

const props = defineProps<{ data: ChartDataPoint[] }>();

const maxRevenue = computed(() => Math.max(...props.data.map((d) => d.revenue), 1));
const totalRevenue = computed(() => props.data.reduce((sum, d) => sum + d.revenue, 0));
const totalOrders = computed(() => props.data.reduce((sum, d) => sum + d.orders, 0));
const chartSummary = computed(
  () => `7-day revenue ${formatCurrency(totalRevenue.value)} across ${totalOrders.value} orders`,
);

function barHeight(revenue: number) {
  return revenue <= 0 ? 0 : Math.max((revenue / maxRevenue.value) * 100, 6);
}
</script>

<template>
  <div class="admin-card w-full overflow-hidden">
    <DashboardSectionHeader title="Revenue">
      <template #trailing>
        <div class="flex gap-5 text-xs">
          <div class="text-right">
            <p class="text-gray-500 dark:text-gray-400">7-day total</p>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(totalRevenue) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-gray-500 dark:text-gray-400">Orders</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ totalOrders }}</p>
          </div>
        </div>
      </template>
    </DashboardSectionHeader>

    <div class="px-5 py-4">
      <div
        v-if="data.length > 0"
        role="img"
        :aria-label="chartSummary"
        class="flex h-44 items-end justify-between gap-1.5 sm:h-48 sm:gap-2"
      >
        <div v-for="point in data" :key="point.label" class="group flex flex-1 flex-col items-center gap-2">
          <div class="relative flex w-full flex-1 items-end">
            <div
              class="w-full rounded-sm bg-brand-500 transition-colors group-hover:bg-brand-600 dark:bg-brand-500 dark:group-hover:bg-brand-400"
              :style="{ height: `${barHeight(point.revenue)}%` }"
              :title="`${point.label}: ${formatCurrency(point.revenue)}`"
              aria-hidden="true"
            />
          </div>
          <span
            class="text-[10px] font-medium text-gray-500 sm:text-xs dark:text-gray-400"
            aria-hidden="true"
          >
            {{ point.label }}
          </span>
        </div>
      </div>
      <div
        v-else
        class="flex h-44 items-center justify-center text-sm text-gray-500 sm:h-48 dark:text-gray-400"
      >
        No revenue data yet
      </div>
    </div>
  </div>
</template>
