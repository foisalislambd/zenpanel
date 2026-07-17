import { Component, Input } from '@angular/core';
import type { ChartDataPoint } from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

/** Chart plot area height in px (matches h-44 / sm:h-48 minus label row). */
const CHART_PLOT_HEIGHT = 148;

@Component({
  selector: 'app-revenue-chart',
  host: { class: 'block w-full' },
  imports: [DashboardSectionHeaderComponent],
  template: `
    <div class="admin-card w-full overflow-hidden">
      <app-dashboard-section-header title="Revenue" [hasTrailing]="true">
        <div trailing class="flex gap-5 text-xs">
          <div class="text-right">
            <p class="text-gray-500 dark:text-gray-400">7-day total</p>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ totalRevenueLabel }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-gray-500 dark:text-gray-400">Orders</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ totalOrders }}</p>
          </div>
        </div>
      </app-dashboard-section-header>

      <div class="px-5 py-4">
        @if (data.length > 0) {
          <div
            role="img"
            [attr.aria-label]="chartSummary"
            class="flex h-44 items-stretch justify-between gap-1.5 sm:h-48 sm:gap-2"
          >
            @for (point of pointsWithHeight; track point.label) {
              <div class="group flex h-full min-w-0 flex-1 flex-col items-center gap-2">
                <div class="relative flex w-full min-h-0 flex-1 items-end justify-center">
                  <div
                    class="w-full max-w-full rounded-sm bg-brand-500 transition-colors group-hover:bg-brand-600 dark:bg-brand-500 dark:group-hover:bg-brand-400"
                    [style.height.px]="point.heightPx"
                    [attr.title]="point.label + ': ' + point.revenueLabel"
                    aria-hidden="true"
                  ></div>
                </div>
                <span
                  class="shrink-0 text-[10px] font-medium text-gray-500 sm:text-xs dark:text-gray-400"
                  aria-hidden="true"
                >
                  {{ point.label }}
                </span>
              </div>
            }
          </div>
        } @else {
          <div
            class="flex h-44 items-center justify-center text-sm text-gray-500 sm:h-48 dark:text-gray-400"
          >
            No revenue data yet
          </div>
        }
      </div>
    </div>
  `,
})
export class RevenueChartComponent {
  data: ChartDataPoint[] = [];
  totalRevenueLabel = formatCurrency(0);
  totalOrders = 0;
  chartSummary = '';
  pointsWithHeight: Array<{ label: string; heightPx: number; revenueLabel: string }> = [];

  @Input({ required: true })
  set chartData(value: ChartDataPoint[]) {
    this.data = value ?? [];
    if (this.data.length === 0) {
      this.totalRevenueLabel = formatCurrency(0);
      this.totalOrders = 0;
      this.chartSummary = '';
      this.pointsWithHeight = [];
      return;
    }

    const maxRevenue = Math.max(...this.data.map((d) => d.revenue), 1);
    const totalRevenue = this.data.reduce((sum, d) => sum + d.revenue, 0);
    this.totalOrders = this.data.reduce((sum, d) => sum + d.orders, 0);
    this.totalRevenueLabel = formatCurrency(totalRevenue);
    this.chartSummary = `7-day revenue ${this.totalRevenueLabel} across ${this.totalOrders} orders`;
    this.pointsWithHeight = this.data.map((point) => {
      const pct = point.revenue <= 0 ? 0 : Math.max((point.revenue / maxRevenue) * 100, 6);
      return {
        label: point.label,
        heightPx: Math.round((pct / 100) * CHART_PLOT_HEIGHT),
        revenueLabel: formatCurrency(point.revenue),
      };
    });
  }
}
