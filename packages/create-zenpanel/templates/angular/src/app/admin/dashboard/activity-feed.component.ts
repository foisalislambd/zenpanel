import { Component, Input } from '@angular/core';
import type { ActivityItem, ActivityType } from '@/app/lib/admin-api';
import { IconComponent } from '@/app/shared/icon.component';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

const activityConfig: Record<ActivityType, { icon: string; color: string; bg: string }> = {
  user: { icon: 'user-plus', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/15' },
  order: {
    icon: 'shopping-cart',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/15',
  },
  payment: {
    icon: 'credit-card',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
  },
  message: { icon: 'mail', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/15' },
  blog: {
    icon: 'newspaper',
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-500/15',
  },
  newsletter: { icon: 'mail', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/15' },
};

const fallbackConfig = { icon: 'activity', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' };

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

type ActivityRow = ActivityItem & { icon: string; color: string; bg: string; relativeTime: string };

@Component({
  selector: 'app-activity-feed',
  host: { class: 'block w-full' },
  imports: [IconComponent, DashboardSectionHeaderComponent],
  template: `
    <div class="admin-card overflow-hidden">
      <app-dashboard-section-header title="Activity" />

      @if (rows.length > 0) {
        <ul class="admin-scrollbar max-h-[380px] divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
          @for (item of rows; track item.id) {
            <li
              class="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
            >
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                [class]="item.bg"
              >
                <app-icon [name]="item.icon" [size]="14" [class]="item.color" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm text-gray-900 dark:text-white">{{ item.title }}</p>
                @if (item.description) {
                  <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                    {{ item.description }}
                  </p>
                }
              </div>
              @if (item.meta) {
                <span class="shrink-0 text-sm font-medium text-gray-900 dark:text-white">{{
                  item.meta
                }}</span>
              }
              <span class="shrink-0 text-xs tabular-nums text-gray-400">{{ item.relativeTime }}</span>
            </li>
          }
        </ul>
      } @else {
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No recent activity
        </div>
      }
    </div>
  `,
})
export class ActivityFeedComponent {
  rows: ActivityRow[] = [];

  @Input({ required: true })
  set items(value: ActivityItem[]) {
    this.rows = value.map((item) => {
      const config = activityConfig[item.type] ?? fallbackConfig;
      return { ...item, ...config, relativeTime: formatRelativeTime(item.timestamp) };
    });
  }
}
