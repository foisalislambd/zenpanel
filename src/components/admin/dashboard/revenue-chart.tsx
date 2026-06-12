"use client";

import type { ChartDataPoint } from "@/lib/admin-api";

type Props = {
  data: ChartDataPoint[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RevenueChart({ data }: Props) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="admin-card w-full overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            Revenue overview
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Last 7 days performance
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Orders</p>
            <p className="font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="admin-card-body">
        <div className="flex h-48 items-end justify-between gap-2 sm:h-52 sm:gap-3">
          {data.map((point) => {
            const height = Math.max((point.revenue / maxRevenue) * 100, 8);
            return (
              <div
                key={point.label}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="relative w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-500 dark:from-brand-600 dark:to-brand-400"
                    style={{ height: `${height}%` }}
                    title={`${point.label}: ${formatCurrency(point.revenue)} · ${point.orders} orders`}
                  >
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700 sm:block">
                      {formatCurrency(point.revenue)}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-500 sm:text-xs dark:text-gray-400">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
