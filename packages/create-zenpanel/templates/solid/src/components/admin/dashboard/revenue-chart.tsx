import { DashboardSectionHeader } from "@/components/admin/dashboard/dashboard-section-header";
import type { ChartDataPoint } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";
import { For, Show } from "solid-js";

type Props = {
  data: ChartDataPoint[];
};

export function RevenueChart(props: Props) {
  const maxRevenue = () => Math.max(...props.data.map((d) => d.revenue), 1);
  const totalRevenue = () => props.data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = () => props.data.reduce((sum, d) => sum + d.orders, 0);
  const chartSummary = () =>
    `7-day revenue ${formatCurrency(totalRevenue())} across ${totalOrders()} orders`;

  return (
    <div class="admin-card w-full overflow-hidden">
      <DashboardSectionHeader
        title="Revenue"
        trailing={
          <div class="flex gap-5 text-xs">
            <div class="text-right">
              <p class="text-gray-500 dark:text-gray-400">7-day total</p>
              <p class="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalRevenue())}
              </p>
            </div>
            <div class="text-right">
              <p class="text-gray-500 dark:text-gray-400">Orders</p>
              <p class="font-semibold text-gray-900 dark:text-white">{totalOrders()}</p>
            </div>
          </div>
        }
      />

      <div class="px-5 py-4">
        <Show
          when={props.data.length > 0}
          fallback={
            <div class="flex h-44 items-center justify-center text-sm text-gray-500 sm:h-48 dark:text-gray-400">
              No revenue data yet
            </div>
          }
        >
          <div
            role="img"
            aria-label={chartSummary()}
            class="flex h-44 items-end justify-between gap-1.5 sm:h-48 sm:gap-2"
          >
            <For each={props.data}>
              {(point) => {
                const height =
                  point.revenue <= 0 ? 0 : Math.max((point.revenue / maxRevenue()) * 100, 6);
                return (
                  <div class="group flex flex-1 flex-col items-center gap-2">
                    <div class="relative flex w-full flex-1 items-end">
                      <div
                        class="w-full rounded-sm bg-brand-500 transition-colors group-hover:bg-brand-600 dark:bg-brand-500 dark:group-hover:bg-brand-400"
                        style={{ height: `${height}%` }}
                        title={`${point.label}: ${formatCurrency(point.revenue)}`}
                        aria-hidden
                      />
                    </div>
                    <span
                      class="text-[10px] font-medium text-gray-500 sm:text-xs dark:text-gray-400"
                      aria-hidden
                    >
                      {point.label}
                    </span>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
