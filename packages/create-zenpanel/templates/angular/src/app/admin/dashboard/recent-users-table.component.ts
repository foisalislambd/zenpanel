import { Component, Input, OnChanges } from '@angular/core';
import type { PortalUserRow } from '@/app/lib/admin-api';
import { DashboardSectionHeaderComponent } from './dashboard-section-header.component';

const providerStyles: Record<string, string> = {
  email: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
  google: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  apple: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  discord: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
};
const fallbackProviderStyle = 'bg-gray-100 text-gray-600 dark:bg-gray-800';

type UserRow = PortalUserRow & { providerStyle: string; joinedLabel: string };

@Component({
  selector: 'app-recent-users-table',
  host: { class: 'block w-full' },
  imports: [DashboardSectionHeaderComponent],
  template: `
    <div class="admin-card w-full overflow-hidden">
      <app-dashboard-section-header
        title="Recent users"
        [href]="href ?? undefined"
        [linkLabel]="href ? 'View all' : undefined"
      />

      @if (rows.length > 0) {
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          @for (user of rows; track user.id) {
            <li class="px-5 py-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                  <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                </div>
                <span
                  class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize"
                  [class]="user.providerStyle"
                  >{{ user.authProvider }}</span
                >
              </div>
              <p class="mt-1.5 text-xs text-gray-400">{{ user.joinedLabel }}</p>
            </li>
          }
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block">
          <table class="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Name</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Email</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Provider</th>
                <th class="px-5 py-2.5 text-xs font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (user of rows; track user.id) {
                <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                  <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">{{ user.name }}</td>
                  <td class="max-w-[200px] truncate px-5 py-3 text-gray-600 dark:text-gray-400 lg:max-w-xs">
                    {{ user.email }}
                  </td>
                  <td class="px-5 py-3">
                    <span
                      class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize"
                      [class]="user.providerStyle"
                      >{{ user.authProvider }}</span
                    >
                  </td>
                  <td class="px-5 py-3 whitespace-nowrap text-gray-500">{{ user.joinedLabel }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No users yet</div>
      }
    </div>
  `,
})
export class RecentUsersTableComponent implements OnChanges {
  rows: UserRow[] = [];

  @Input({ required: true }) users: PortalUserRow[] = [];
  /** Pass `null` to hide the "View all" link (e.g. on the Users page). */
  @Input() href: string | null = '/admin/users';

  ngOnChanges(): void {
    this.rows = this.users.map((user) => ({
      ...user,
      providerStyle: providerStyles[user.authProvider] ?? fallbackProviderStyle,
      joinedLabel: new Date(user.createdAt).toLocaleDateString(),
    }));
  }
}
