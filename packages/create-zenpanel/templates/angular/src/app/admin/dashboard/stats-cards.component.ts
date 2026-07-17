import { Component, Input } from '@angular/core';
import type { DashboardStats } from '@/app/lib/admin-api';
import { formatCurrency } from '@/app/lib/format';
import { IconComponent } from '@/app/shared/icon.component';

type StatCard = {
  label: string;
  sublabel?: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
};

function formatChange(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

@Component({
  selector: 'app-stats-cards',
  host: { class: 'block w-full' },
  imports: [IconComponent],
  template: `
    <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      @for (card of cards; track card.label) {
        <div class="admin-card overflow-hidden">
          <div class="flex items-center justify-between gap-3 p-4">
            <div class="min-w-0">
              <p
                class="truncate text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {{ card.label }}
              </p>
              @if (card.sublabel) {
                <p class="truncate text-[10px] text-gray-400 dark:text-gray-500">
                  {{ card.sublabel }}
                </p>
              }
              <p
                class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
              >
                {{ card.value }}
              </p>
            </div>
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              [class]="card.iconBg"
            >
              <app-icon [name]="card.icon" [size]="20" [class]="card.iconColor" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class StatsCardsComponent {
  cards: StatCard[] = [];

  @Input({ required: true })
  set stats(value: DashboardStats) {
    this.cards = [
      {
        label: 'Revenue',
        sublabel: `All time · ${formatChange(value.revenueChangePercent)}`,
        value: formatCurrency(value.totalRevenue),
        icon: 'dollar-sign',
        iconColor: 'text-brand-600 dark:text-brand-400',
        iconBg: 'bg-brand-50 dark:bg-brand-500/15',
      },
      {
        label: 'Users',
        sublabel: `+${value.newUsersLast7Days.toLocaleString()} last 7 days`,
        value: value.totalUsers.toLocaleString(),
        icon: 'users',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-50 dark:bg-blue-500/15',
      },
      {
        label: 'Orders',
        sublabel: `Last 7 days · ${formatChange(value.ordersChangePercent)}`,
        value: value.newOrdersLast7Days.toLocaleString(),
        icon: 'shopping-cart',
        iconColor: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-50 dark:bg-violet-500/15',
      },
      {
        label: 'Messages',
        sublabel: 'Unread',
        value: value.unreadMessages.toLocaleString(),
        icon: 'message-circle',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-50 dark:bg-amber-500/15',
      },
      {
        label: 'Projects',
        sublabel: 'Total',
        value: value.totalProjects.toLocaleString(),
        icon: 'folder-kanban',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
      },
      {
        label: 'Subscribers',
        sublabel: 'Newsletter',
        value: value.newsletterSubscribers.toLocaleString(),
        icon: 'mail',
        iconColor: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-50 dark:bg-rose-500/15',
      },
    ];
  }
}
