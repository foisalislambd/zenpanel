import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@/app/shared/icon.component';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

const quickLinks = [
  { name: 'Manage projects', href: '/admin/projects', icon: 'folder-kanban' },
  { name: 'Manage services', href: '/admin/services', icon: 'briefcase' },
  { name: 'View messages', href: '/admin/messages', icon: 'message-circle' },
  { name: 'Write blog post', href: '/admin/blog', icon: 'newspaper' },
  { name: 'Add product', href: '/admin/products', icon: 'package' },
  { name: 'Manage users', href: '/admin/users', icon: 'users' },
];

const providerColors: Record<string, string> = {
  email: 'bg-brand-500',
  google: 'bg-orange-500',
  apple: 'bg-gray-600 dark:bg-gray-400',
  discord: 'bg-indigo-500',
};

type ProviderRow = { provider: string; count: number; pct: number };

@Component({
  selector: 'app-dashboard-sidebar',
  host: { class: 'block w-full' },
  imports: [RouterLink, IconComponent, DashboardSectionHeaderComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div class="admin-card overflow-hidden">
        <app-dashboard-section-header title="Quick actions" />
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          @for (link of quickLinks; track link.href) {
            <li>
              <a
                [routerLink]="link.href"
                class="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
              >
                <app-icon [name]="link.icon" [size]="16" class="shrink-0 text-gray-400" />
                <span class="min-w-0 flex-1">{{ link.name }}</span>
                <app-icon
                  name="chevron-right"
                  [size]="16"
                  class="shrink-0 text-gray-300 dark:text-gray-600"
                />
              </a>
            </li>
          }
        </ul>
      </div>

      <div class="admin-card overflow-hidden">
        <app-dashboard-section-header title="Users by provider" />
        <div class="space-y-3.5 px-5 py-4">
          @for (row of providerRows; track row.provider) {
            <div>
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="capitalize text-gray-600 dark:text-gray-400">{{ row.provider }}</span>
                <span class="font-medium tabular-nums text-gray-900 dark:text-white">
                  {{ row.count.toLocaleString() }}
                  <span class="ml-1 text-xs font-normal text-gray-400">{{ row.pct }}%</span>
                </span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full"
                  [class]="providerColors[row.provider] ?? 'bg-gray-400'"
                  [style.width.%]="row.pct"
                ></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DashboardSidebarComponent implements OnChanges {
  readonly quickLinks = quickLinks;
  readonly providerColors = providerColors;
  providerRows: ProviderRow[] = [];

  @Input({ required: true }) usersByProvider!: {
    email: number;
    google: number;
    apple: number;
    discord: number;
  };
  @Input({ required: true }) totalUsers = 0;

  ngOnChanges(): void {
    this.providerRows = Object.entries(this.usersByProvider).map(([provider, count]) => ({
      provider,
      count,
      pct: this.totalUsers > 0 ? Math.round((count / this.totalUsers) * 100) : 0,
    }));
  }
}
