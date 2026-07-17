import { Component, Input } from '@angular/core';
import type { OrderStatus, RecentOrder } from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-400',
  processing: 'bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-500/15 dark:text-brand-400',
  completed:
    'bg-success-50 text-success-600 ring-success-600/20 dark:bg-success-500/15 dark:text-success-500',
  cancelled: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400',
};
const fallbackStatusStyle = 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400';

function styleFor(status: string): string {
  return statusStyles[status as OrderStatus] ?? fallbackStatusStyle;
}

type OrderRow = RecentOrder & { amountLabel: string; statusStyle: string };

@Component({
  selector: 'app-recent-orders-table',
  host: { class: 'block w-full' },
  imports: [DashboardSectionHeaderComponent],
  template: `
    <div class="admin-card w-full overflow-hidden">
      <app-dashboard-section-header title="Recent orders" href="/admin/service-orders" />

      @if (rows.length > 0) {
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          @for (order of rows; track order.id) {
            <li class="px-5 py-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ order.customer }}</p>
                  <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                    {{ order.service }}
                  </p>
                </div>
                <p class="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                  {{ order.amountLabel }}
                </p>
              </div>
              <div class="mt-2 flex items-center justify-between gap-2">
                <span
                  class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset"
                  [class]="order.statusStyle"
                  >{{ order.status }}</span
                >
                <span class="font-mono text-xs text-gray-400">{{ order.id }}</span>
              </div>
            </li>
          }
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block">
          <table class="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Order</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Customer</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Service</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (order of rows; track order.id) {
                <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                  <td class="px-5 py-3 font-mono text-xs text-gray-500">{{ order.id }}</td>
                  <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">{{ order.customer }}</td>
                  <td class="max-w-[180px] truncate px-5 py-3 text-gray-600 dark:text-gray-400">
                    {{ order.service }}
                  </td>
                  <td class="px-5 py-3 font-medium tabular-nums text-gray-900 dark:text-white">
                    {{ order.amountLabel }}
                  </td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset"
                      [class]="order.statusStyle"
                      >{{ order.status }}</span
                    >
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No orders yet</div>
      }
    </div>
  `,
})
export class RecentOrdersTableComponent {
  rows: OrderRow[] = [];

  @Input({ required: true })
  set orders(value: RecentOrder[]) {
    this.rows = value.map((order) => ({
      ...order,
      amountLabel: formatCurrency(order.amount),
      statusStyle: styleFor(order.status),
    }));
  }
}
