import { Component, OnInit, computed, signal } from '@angular/core';
import {
  previewFetchUsers,
  type PortalUserRow,
  type UserAccountStatus,
} from '@/app/lib/admin-api';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminLoadingComponent } from '@/app/admin/ui/admin-loading.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AdminAddButtonComponent } from '@/app/admin/ui/admin-add-button.component';
import { AdminFilterGroupComponent } from '@/app/admin/ui/admin-filter-group.component';
import { AdminRowActionsComponent } from '@/app/admin/ui/admin-row-actions.component';
import { IconComponent } from '@/app/shared/icon.component';

type StatusFilter = 'all' | UserAccountStatus;
type ProviderFilter = 'all' | 'email' | 'google';

const providerStyles: Record<string, string> = {
  email: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
  google: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  apple: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  discord: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
};

function dash(value: string | null | undefined) {
  return value?.trim() ? value : '—';
}

/**
 * Reusable users management page: search, filters, table, detail drawer.
 * Wire `onAdd` / `onEdit` / `onDelete` when connecting your API.
 */
@Component({
  selector: 'app-users-page',
  imports: [
    AdminBreadcrumbsComponent,
    AdminPageHeaderComponent,
    AdminLoadingComponent,
    AdminAddButtonComponent,
    AdminFilterGroupComponent,
    AdminRowActionsComponent,
    IconComponent,
  ],
  template: `
    @if (loading()) {
      <app-admin-loading message="Loading users…" />
    } @else if (error()) {
      <div class="admin-content">
        <div class="admin-card admin-card-body text-sm text-error-500">{{ error() }}</div>
      </div>
    } @else {
      <div class="admin-content space-y-6">
        <app-admin-breadcrumbs />
        <app-admin-page-header title="Users">
          <app-admin-add-button actions />
        </app-admin-page-header>

        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full max-w-md">
            <span
              class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
            >
              <app-icon name="search" [size]="16" />
            </span>
            <input
              type="search"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
              placeholder="Search name, email, phone, IP..."
              class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
              aria-label="Search users"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <app-admin-filter-group
              ariaLabel="Filter by status"
              [value]="statusFilter()"
              (valueChange)="onStatusFilter($event)"
              [options]="statusOptions"
            />
            <app-admin-filter-group
              ariaLabel="Filter by provider"
              [value]="providerFilter()"
              (valueChange)="onProviderFilter($event)"
              [options]="providerOptions"
            />
          </div>
        </div>

        <div class="admin-card w-full overflow-hidden">
          @if (filtered().length === 0) {
            <div class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No users match your filters
            </div>
          } @else {
            <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
              @for (user of filtered(); track user.id) {
                <li class="px-4 py-3.5">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                      <p class="mt-0.5 truncate text-sm text-gray-500">{{ user.email }}</p>
                      <div class="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          [class]="
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                            providerStyle(user.authProvider)
                          "
                          >{{ user.authProvider }}</span
                        >
                        @if (user.status === 'active') {
                          <span
                            class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
                            >Active</span
                          >
                        } @else {
                          <span
                            class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15"
                            >Banned</span
                          >
                        }
                        @if (!user.emailVerified) {
                          <span
                            class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                            >Unverified</span
                          >
                        }
                      </div>
                    </div>
                    <app-admin-row-actions
                      [itemLabel]="user.name"
                      size="md"
                      [onView]="viewUser(user)"
                    />
                  </div>
                </li>
              }
            </ul>

            <div class="admin-scrollbar hidden overflow-x-auto md:block">
              <table class="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-800">
                    @for (heading of tableHeadings; track heading) {
                      <th
                        class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase"
                        [class.text-right]="heading === 'Actions'"
                      >
                        {{ heading }}
                      </th>
                    }
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  @for (user of filtered(); track user.id) {
                    <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                      <td class="px-5 py-3.5">
                        <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                        <p class="mt-0.5 text-sm text-gray-500">{{ user.email }}</p>
                      </td>
                      <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {{ dash(user.country) }}
                      </td>
                      <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {{ dash(user.phone) }}
                      </td>
                      <td class="px-5 py-3.5">
                        <span
                          [class]="
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                            providerStyle(user.authProvider)
                          "
                          >{{ user.authProvider }}</span
                        >
                      </td>
                      <td class="px-5 py-3.5">
                        <div class="flex flex-wrap items-center gap-1.5">
                          @if (user.status === 'active') {
                            <span
                              class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
                              >Active</span
                            >
                          } @else {
                            <span
                              class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15"
                              >Banned</span
                            >
                          }
                          @if (!user.emailVerified) {
                            <span
                              class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                              >Unverified</span
                            >
                          }
                        </div>
                      </td>
                      <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                        {{ formatDate(user.createdAt) }}
                      </td>
                      <td class="px-5 py-3.5">
                        <app-admin-row-actions
                          [itemLabel]="user.name"
                          [onView]="viewUser(user)"
                        />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        @if (selected(); as user) {
          <div class="fixed inset-0 z-50 flex justify-end">
            <button
              type="button"
              class="absolute inset-0 bg-gray-900/40"
              aria-label="Close user details"
              (click)="selected.set(null)"
            ></button>
            <aside
              class="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
              >
                <div class="min-w-0">
                  <h2 class="truncate text-lg font-semibold text-gray-900 dark:text-white">
                    {{ user.name }}
                  </h2>
                  <p class="truncate text-sm text-gray-500">{{ user.email }}</p>
                </div>
                <button
                  type="button"
                  (click)="selected.set(null)"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  <app-icon name="x" [size]="20" />
                </button>
              </div>
              <dl class="admin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm">
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Provider</dt>
                  <dd class="mt-1 capitalize text-gray-900 dark:text-white">{{ user.authProvider }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Status</dt>
                  <dd class="mt-1 capitalize text-gray-900 dark:text-white">{{ user.status }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Email verified
                  </dt>
                  <dd class="mt-1 text-gray-900 dark:text-white">
                    {{ user.emailVerified ? 'Yes' : 'No' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Country</dt>
                  <dd class="mt-1 text-gray-900 dark:text-white">{{ dash(user.country) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Phone</dt>
                  <dd class="mt-1 text-gray-900 dark:text-white">{{ dash(user.phone) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last IP</dt>
                  <dd class="mt-1 text-gray-900 dark:text-white">{{ dash(user.lastIp) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Joined</dt>
                  <dd class="mt-1 text-gray-900 dark:text-white">
                    {{ formatDateTime(user.createdAt) }}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        }
      </div>
    }
  `,
})
export class UsersPageComponent implements OnInit {
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly users = signal<PortalUserRow[]>([]);
  readonly query = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly providerFilter = signal<ProviderFilter>('all');
  readonly selected = signal<PortalUserRow | null>(null);

  readonly dash = dash;
  readonly tableHeadings = [
    'User',
    'Country',
    'Phone',
    'Provider',
    'Status',
    'Joined',
    'Actions',
  ];
  readonly statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'banned', label: 'Banned' },
  ];
  readonly providerOptions = [
    { value: 'all', label: 'All' },
    { value: 'email', label: 'Email' },
    { value: 'google', label: 'Google' },
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    const provider = this.providerFilter();
    return this.users().filter((user) => {
      if (status !== 'all' && user.status !== status) return false;
      if (provider !== 'all' && user.authProvider !== provider) return false;
      if (!q) return true;
      const haystack = [
        user.name,
        user.email,
        user.phone ?? '',
        user.lastIp ?? '',
        user.country ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  });

  ngOnInit(): void {
    previewFetchUsers()
      .then((res) => this.users.set(res.users))
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load users');
      })
      .finally(() => this.loading.set(false));
  }

  onStatusFilter(value: string): void {
    this.statusFilter.set(value as StatusFilter);
  }

  onProviderFilter(value: string): void {
    this.providerFilter.set(value as ProviderFilter);
  }

  providerStyle(provider: string): string {
    return providerStyles[provider] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }

  formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  viewUser(user: PortalUserRow): () => void {
    return () => this.selected.set(user);
  }
}
