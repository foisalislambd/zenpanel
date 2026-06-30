"use client";

import { DashboardSectionHeader } from "@/components/admin/dashboard/dashboard-section-header";
import type { OrderStatus, RecentOrder } from "@/lib/admin-api";

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-400",
  processing:
    "bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/15 dark:text-brand-400",
  completed:
    "bg-success-50 text-success-600 ring-success-600/20 dark:bg-success-500/15 dark:text-success-500",
  cancelled:
    "bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="admin-card w-full overflow-hidden">
      <DashboardSectionHeader title="Recent orders" href="/admin/service-orders" />

      {orders.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No orders yet
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            {orders.map((order) => (
              <li key={order.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                      {order.service}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <StatusBadge status={order.status} />
                  <span className="font-mono text-xs text-gray-400">{order.id}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="admin-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500">Order</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500">Service</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-2.5 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-gray-600 dark:text-gray-400">
                      {order.service}
                    </td>
                    <td className="px-5 py-3 font-medium tabular-nums text-gray-900 dark:text-white">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
