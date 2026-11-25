import { Component, computed, input } from '@angular/core';
import type { DashboardStats } from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { IconComponent } from '@/app/shared/icon.component';

type StatCard = {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  /** Percent change vs previous period. */
  trend?: number;
  hint?: string;
};

@Component({
  selector: 'app-stats-cards',
  host: { class: 'block w-full' },
  imports: [IconComponent],
  template: `
    <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      @for (card of cards(); track card.label) {
        <div class="admin-card overflow-hidden">
          <div class="flex items-center justify-between gap-3 p-4">
            <div class="min-w-0">
              <p class="truncate text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {{ card.label }}
              </p>
              <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                {{ card.value }}
              </p>
              @if (card.trend !== undefined || card.hint) {
                <p class="mt-1 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                  @if (card.trend !== undefined) {
                    <span
                      class="inline-flex items-center gap-0.5 font-semibold"
                      [class]="card.trend >= 0 ? 'text-success-600 dark:text-success-500' : 'text-error-500'"
                    >
                      <app-icon [name]="card.trend >= 0 ? 'trending-up' : 'trending-down'" [size]="14" />
                      {{ card.trend >= 0 ? '+' : '' }}{{ card.trend }}%
                    </span>
                  }
                  {{ card.hint ?? '' }}
                </p>
              }
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" [class]="card.iconBg">
              <app-icon [name]="card.icon" [size]="20" [class]="card.iconColor" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class StatsCardsComponent {
  readonly stats = input.required<DashboardStats>();

  readonly cards = computed<StatCard[]>(() => {
    const value = this.stats();
    return [
      {
        label: 'Revenue',
        value: formatCurrency(value.totalRevenue),
        trend: value.revenueChangePercent,
        hint: 'vs last month',
        icon: 'dollar-sign',
        iconColor: 'text-brand-600 dark:text-brand-400',
        iconBg: 'bg-brand-50 dark:bg-brand-500/15',
      },
      {
        label: 'Users',
        value: value.totalUsers.toLocaleString(),
        hint: `+${value.newUsersLast7Days.toLocaleString()} this week`,
        icon: 'users',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-50 dark:bg-blue-500/15',
      },
      {
        label: 'Orders (7d)',
        value: value.newOrdersLast7Days.toLocaleString(),
        trend: value.ordersChangePercent,
        hint: 'vs prior week',
        icon: 'shopping-cart',
        iconColor: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-50 dark:bg-violet-500/15',
      },
      {
        label: 'Messages',
        value: value.unreadMessages.toLocaleString(),
        hint: 'unread',
        icon: 'message-circle',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-50 dark:bg-amber-500/15',
      },
      {
        label: 'Projects',
        value: value.totalProjects.toLocaleString(),
        icon: 'folder-kanban',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
      },
      {
        label: 'Subscribers',
        value: value.newsletterSubscribers.toLocaleString(),
        icon: 'mail',
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-50 dark:bg-rose-500/15',
      },
    ];
  });
}
