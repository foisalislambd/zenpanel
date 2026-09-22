import { Component, Input } from '@angular/core';
import type { ChartDataPoint } from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { l: 46, r: 16, t: 18, b: 28 };

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exp;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * exp;
}

function axisMoney(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    const label = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1);
    return `$${label}k`;
  }
  return formatCurrency(value);
}

const RANGES = [
  { days: 7, label: '7D' },
  { days: 30, label: '30D' },
  { days: 90, label: '90D' },
] as const;
const SERIES_END = new Date(2026, 8, 22);

function seriesFor(source: ChartDataPoint[], days: number): ChartDataPoint[] {
  if (source.length === 0) return [];
  const points: ChartDataPoint[] = [];
  for (let ago = days - 1; ago >= 0; ago--) {
    const date = new Date(SERIES_END);
    date.setDate(SERIES_END.getDate() - ago);
    const known = ago < source.length ? source[source.length - 1 - ago] : undefined;
    const seed = (date.getDate() * 17 + date.getMonth() * 13) % 97;
    points.push({
      label:
        days <= 7 && known
          ? known.label
          : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      revenue: known?.revenue ?? 3200 + ((seed * 61) % 5400),
      orders: known?.orders ?? 2 + (seed % 8),
    });
  }
  return points;
}

function showsLabel(index: number, count: number) {
  if (count <= 7) return true;
  const step = count <= 30 ? 5 : 15;
  return index === 0 || index === count - 1 || index % step === 0;
}

@Component({
  selector: 'app-revenue-chart',
  host: { class: 'block w-full' },
  imports: [DashboardSectionHeaderComponent],
  template: `
    <div class="admin-card w-full overflow-hidden">
      <app-dashboard-section-header title="Revenue" [hasTrailing]="true">
        <div trailing class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-white/10" role="group" aria-label="Chart range">
          @for (range of ranges; track range.days) {
            <button
              type="button"
              [attr.aria-pressed]="days === range.days"
              [attr.class]="rangeButtonClass(days === range.days)"
              (click)="selectDays(range.days)"
            >
              {{ range.label }}
            </button>
          }
        </div>
      </app-dashboard-section-header>

      <div class="px-3 pt-3 pb-4 sm:px-5">
        @if (points.length > 0) {
          <div class="relative w-full" [style.aspect-ratio]="width + ' / ' + height">
            <svg
              [attr.viewBox]="'0 0 ' + width + ' ' + height"
              class="h-full w-full"
              role="img"
              [attr.aria-label]="chartSummary"
            >
              <defs>
                <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#465fff" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#465fff" stop-opacity="0.02" />
                </linearGradient>
              </defs>
              @for (tick of ticks; track tick.value) {
                <line
                  [attr.x1]="padLeft"
                  [attr.x2]="width - padRight"
                  [attr.y1]="tick.y"
                  [attr.y2]="tick.y"
                  stroke="#e4e7ec"
                  [attr.stroke-dasharray]="tick.value === 0 ? null : '4 6'"
                />
                <text
                  [attr.x]="padLeft - 8"
                  [attr.y]="tick.y + 4"
                  text-anchor="end"
                  fill="#98a2b3"
                  font-size="11"
                >
                  {{ tick.label }}
                </text>
              }
              <path [attr.d]="area" fill="url(#revenue-area)" />
              <path
                [attr.d]="line"
                fill="none"
                stroke="#465fff"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              @for (point of points; track point.x) {
                @if (point.showLabel) {
                  <text
                    [attr.x]="point.x"
                    [attr.y]="height - 8"
                    text-anchor="middle"
                    fill="#667085"
                    font-size="11"
                  >
                    {{ point.label }}
                  </text>
                }
                @if (point.showDot) {
                  <circle
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="3.5"
                    fill="#ffffff"
                    stroke="#465fff"
                    stroke-width="2"
                  >
                    <title>{{ point.label }}: {{ point.revenueLabel }} · {{ point.orders }} orders</title>
                  </circle>
                }
              }
            </svg>
          </div>
        } @else {
          <div class="flex h-52 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No revenue data yet
          </div>
        }
      </div>
    </div>
  `,
})
export class RevenueChartComponent {
  data: ChartDataPoint[] = [];
  days: (typeof RANGES)[number]['days'] = 7;
  readonly ranges = RANGES;
  chartSummary = '';
  width = WIDTH;
  height = HEIGHT;
  padLeft = PAD.l;
  padRight = PAD.r;
  line = '';
  area = '';
  ticks: Array<{ value: number; y: number; label: string }> = [];
  points: Array<{
    label: string;
    x: number;
    y: number;
    revenueLabel: string;
    orders: number;
    showLabel: boolean;
    showDot: boolean;
  }> = [];

  @Input({ required: true })
  set chartData(value: ChartDataPoint[]) {
    this.data = value ?? [];
    this.rebuild();
  }

  selectDays(days: (typeof RANGES)[number]['days']): void {
    this.days = days;
    this.rebuild();
  }

  rangeButtonClass(selected: boolean): string {
    const base =
      'rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40';
    return selected
      ? `${base} bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white`
      : `${base} text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200`;
  }

  private rebuild(): void {
    const series = seriesFor(this.data, this.days);
    if (series.length === 0) {
      this.chartSummary = '';
      this.line = '';
      this.area = '';
      this.ticks = [];
      this.points = [];
      return;
    }

    const ceiling = niceMax(Math.max(...series.map((d) => d.revenue), 1));
    const innerW = WIDTH - PAD.l - PAD.r;
    const innerH = HEIGHT - PAD.t - PAD.b;
    const baseline = PAD.t + innerH;
    const totalRevenue = series.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = series.reduce((sum, d) => sum + d.orders, 0);
    this.chartSummary = `${this.days}-day revenue ${formatCurrency(totalRevenue)} across ${totalOrders} orders`;
    this.points = series.map((point, index) => {
      const x = series.length === 1 ? PAD.l + innerW / 2 : PAD.l + (index / (series.length - 1)) * innerW;
      const y = PAD.t + (1 - point.revenue / ceiling) * innerH;
      return {
        label: point.label,
        x,
        y,
        revenueLabel: formatCurrency(point.revenue),
        orders: point.orders,
        showLabel: showsLabel(index, series.length),
        showDot: series.length <= 14,
      };
    });
    let line = this.points.length ? `M ${this.points[0].x} ${this.points[0].y}` : '';
    for (let i = 0; i < this.points.length - 1; i++) {
      const current = this.points[i];
      const next = this.points[i + 1];
      const curve = (next.x - current.x) / 2;
      line += ` C ${current.x + curve} ${current.y}, ${next.x - curve} ${next.y}, ${next.x} ${next.y}`;
    }
    this.line = line;
    this.area = this.points.length
      ? `${line} L ${this.points[this.points.length - 1].x} ${baseline} L ${this.points[0].x} ${baseline} Z`
      : '';
    this.ticks = [ceiling, ceiling / 2, 0].map((value) => ({
      value,
      y: PAD.t + (1 - value / ceiling) * innerH,
      label: axisMoney(value),
    }));
  }
}
