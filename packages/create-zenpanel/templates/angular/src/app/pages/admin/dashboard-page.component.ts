import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/auth.service';
import { adminConfig } from '@/app/core/admin.config';
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
} from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, IconComponent, DatePipe, DecimalPipe],
  template: `
    @if (loading()) {
      <p class="text-sm text-gray-500">Loading dashboard…</p>
    } @else if (error()) {
      <div class="admin-card admin-card-body text-sm text-error-500">{{ error() }}</div>
    } @else {
      <div class="admin-content space-y-5">
        <div
          class="relative overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-5 sm:p-6 lg:p-8 dark:border-brand-500/20"
        >
          <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="text-sm font-medium text-brand-100">
                {{ greeting() }}, {{ auth.admin()?.username ?? brand.name }}
              </p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard overview
              </h1>
              <p class="mt-2 flex items-center gap-2 text-sm text-brand-100/90">
                <app-icon name="calendar-days" [size]="16" />
                {{ today }}
              </p>
            </div>
            <div class="flex shrink-0 flex-wrap gap-2">
              <a
                routerLink="/admin/projects"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-sm hover:bg-brand-50"
              >
                <app-icon name="folder-kanban" [size]="16" />
                Manage projects
              </a>
              <a
                routerLink="/admin/settings"
                class="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
              >
                <app-icon name="settings" [size]="16" />
                Settings
              </a>
            </div>
          </div>
        </div>

        @if (stats(); as s) {
          <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Revenue</p>
                  <p class="text-[10px] text-gray-400">
                    All time · {{ formatChange(s.revenueChangePercent) }}
                  </p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ money(s.totalRevenue) }}
                  </p>
                </div>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/15"
                >
                  <app-icon name="dollar-sign" [size]="20" class="text-brand-600" />
                </div>
              </div>
            </div>
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Users</p>
                  <p class="text-[10px] text-gray-400">
                    +{{ s.newUsersLast7Days | number }} last 7 days
                  </p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ s.totalUsers | number }}
                  </p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15">
                  <app-icon name="users" [size]="20" />
                </div>
              </div>
            </div>
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Orders</p>
                  <p class="text-[10px] text-gray-400">
                    Last 7 days · {{ formatChange(s.ordersChangePercent) }}
                  </p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ s.newOrdersLast7Days | number }}
                  </p>
                </div>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/15"
                >
                  <app-icon name="shopping-cart" [size]="20" />
                </div>
              </div>
            </div>
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Messages</p>
                  <p class="text-[10px] text-gray-400">Unread</p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ s.unreadMessages | number }}
                  </p>
                </div>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15"
                >
                  <app-icon name="message-circle" [size]="20" />
                </div>
              </div>
            </div>
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Projects</p>
                  <p class="text-[10px] text-gray-400">Total</p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ s.totalProjects | number }}
                  </p>
                </div>
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/15"
                >
                  <app-icon name="folder-kanban" [size]="20" />
                </div>
              </div>
            </div>
            <div class="admin-card overflow-hidden">
              <div class="flex items-center justify-between gap-3 p-4">
                <div class="min-w-0">
                  <p class="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Subscribers
                  </p>
                  <p class="text-[10px] text-gray-400">Newsletter</p>
                  <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    {{ s.newsletterSubscribers | number }}
                  </p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/15">
                  <app-icon name="mail" [size]="20" />
                </div>
              </div>
            </div>
          </div>
        }

        <div class="grid items-start gap-5 xl:grid-cols-3">
          <div class="space-y-5 xl:col-span-2">
            <div class="admin-card overflow-hidden">
              <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
                Revenue (7 days)
              </div>
              <div class="flex h-48 items-end gap-2 p-4">
                @for (point of chart(); track point.label) {
                  <div class="flex flex-1 flex-col items-center gap-2">
                    <div
                      class="w-full rounded-t bg-brand-500/80"
                      [style.height.%]="barHeight(point.revenue)"
                    ></div>
                    <span class="text-[10px] text-gray-500">{{ point.label }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="admin-card overflow-hidden">
              <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
                Recent activity
              </div>
              <ul class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of activity(); track item.id) {
                  <li class="px-4 py-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">{{ item.description }}</p>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div class="admin-card overflow-hidden">
            <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
              Users by provider
            </div>
            @if (stats(); as s) {
              <ul class="space-y-3 p-4 text-sm">
                <li class="flex justify-between"><span>Email</span><span>{{ s.usersByProvider.email }}</span></li>
                <li class="flex justify-between"><span>Google</span><span>{{ s.usersByProvider.google }}</span></li>
                <li class="flex justify-between"><span>Apple</span><span>{{ s.usersByProvider.apple }}</span></li>
                <li class="flex justify-between"><span>Discord</span><span>{{ s.usersByProvider.discord }}</span></li>
              </ul>
            }
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <div class="admin-card overflow-hidden">
            <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
              Recent orders
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="text-xs text-gray-500">
                  <tr>
                    <th class="px-4 py-2">Order</th>
                    <th class="px-4 py-2">Customer</th>
                    <th class="px-4 py-2">Amount</th>
                    <th class="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of orders(); track order.id) {
                    <tr class="border-t border-gray-100 dark:border-gray-800">
                      <td class="px-4 py-2">{{ order.id }}</td>
                      <td class="px-4 py-2">{{ order.customer }}</td>
                      <td class="px-4 py-2">{{ money(order.amount) }}</td>
                      <td class="px-4 py-2 capitalize">{{ order.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="admin-card overflow-hidden">
            <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
              Recent users
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="text-xs text-gray-500">
                  <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Email</th>
                    <th class="px-4 py-2">Provider</th>
                    <th class="px-4 py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of users(); track user.id) {
                    <tr class="border-t border-gray-100 dark:border-gray-800">
                      <td class="px-4 py-2">{{ user.name }}</td>
                      <td class="px-4 py-2">{{ user.email }}</td>
                      <td class="px-4 py-2 capitalize">{{ user.authProvider }}</td>
                      <td class="px-4 py-2">{{ user.createdAt | date: 'shortDate' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DashboardPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly brand = adminConfig.brand;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly stats = signal<DashboardStats | null>(null);
  readonly users = signal<PortalUserRow[]>([]);
  readonly chart = signal<ChartDataPoint[]>([]);
  readonly activity = signal<ActivityItem[]>([]);
  readonly orders = signal<RecentOrder[]>([]);

  readonly today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  private maxRevenue = 1;

  ngOnInit(): void {
    Promise.all([
      previewFetchStats(),
      previewFetchUsers(),
      previewFetchChartData(),
      previewFetchActivity(),
      previewFetchRecentOrders(),
    ])
      .then(([statsRes, usersRes, chartRes, activityRes, ordersRes]) => {
        this.stats.set(statsRes.stats);
        this.users.set(usersRes.users);
        this.chart.set(chartRes.chart);
        this.activity.set(activityRes.activity);
        this.orders.set(ordersRes.orders);
        this.maxRevenue = Math.max(...chartRes.chart.map((c) => c.revenue), 1);
      })
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard');
      })
      .finally(() => this.loading.set(false));
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  formatChange(percent: number): string {
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  }

  money(value: number): string {
    return formatCurrency(value);
  }

  barHeight(revenue: number): number {
    return Math.max(8, (revenue / this.maxRevenue) * 100);
  }
}
