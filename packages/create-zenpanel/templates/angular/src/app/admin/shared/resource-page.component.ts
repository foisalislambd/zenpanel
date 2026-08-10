import { Component, Input, computed, signal } from '@angular/core';
import type { AdminResource, AdminResourceStatus } from '@/app/lib/admin-data/resources';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AdminAddButtonComponent } from '@/app/admin/ui/admin-add-button.component';
import { AdminFilterGroupComponent } from '@/app/admin/ui/admin-filter-group.component';
import { AdminRowActionsComponent } from '@/app/admin/ui/admin-row-actions.component';
import { AdminEmptyStateComponent } from '@/app/admin/ui/admin-empty-state.component';
import { IconComponent } from '@/app/shared/icon.component';

type StatusFilter = 'all' | AdminResourceStatus;

const statusStyles: Record<AdminResourceStatus, string> = {
  published: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  archived: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
};

const irregularPlurals: Record<string, string> = {
  category: 'categories',
  post: 'posts',
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

/**
 * Reusable admin resource list page: search, status filters, table, row actions.
 * Drop into any project and pass `items` + optional action handlers.
 */
@Component({
  selector: 'app-resource-page',
  imports: [
    AdminBreadcrumbsComponent,
    AdminPageHeaderComponent,
    AdminAddButtonComponent,
    AdminFilterGroupComponent,
    AdminRowActionsComponent,
    AdminEmptyStateComponent,
    IconComponent,
  ],
  template: `
    <div class="admin-content space-y-6">
      <app-admin-breadcrumbs />
      <app-admin-page-header [title]="title">
        <app-admin-add-button actions [onClick]="onAdd" />
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
            [placeholder]="searchPlaceholder"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
            [attr.aria-label]="'Search ' + pluralize(resourceLabel, 2)"
          />
        </div>

        <app-admin-filter-group
          ariaLabel="Filter by status"
          [value]="statusFilter()"
          (valueChange)="onStatusFilter($event)"
          [options]="statusOptions"
        />
      </div>

      <div class="admin-card w-full overflow-hidden">
        @if (filtered().length === 0) {
          @if (itemsSig().length === 0) {
            <app-admin-empty-state
              icon="database"
              [title]="'No ' + resourceLabel.toLowerCase() + ' yet'"
              [description]="
                'This page is ready for your data. Connect your backend API to load, create, and manage ' +
                resourceLabel.toLowerCase() +
                ' from here.'
              "
            />
          } @else {
            <div class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No {{ pluralize(resourceLabel, 2) }} match your filters
            </div>
          }
        } @else {
          <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            @for (item of filtered(); track item.id) {
              <li class="px-4 py-3.5">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                    <p class="mt-0.5 truncate text-sm text-gray-500">{{ item.meta ?? '—' }}</p>
                    <div class="mt-2">
                      <span
                        [class]="
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                          statusStyles[item.status]
                        "
                        >{{ item.status }}</span
                      >
                    </div>
                  </div>
                  <app-admin-row-actions
                    [itemLabel]="item.title"
                    size="md"
                    [onView]="onView ? bindAction(onView, item) : undefined"
                    [onEdit]="onEdit ? bindAction(onEdit, item) : undefined"
                    [onDelete]="onDelete ? bindAction(onDelete, item) : undefined"
                  />
                </div>
              </li>
            }
          </ul>

          <div class="admin-scrollbar hidden overflow-x-auto md:block">
            <table class="w-full min-w-[720px] text-left text-sm">
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
                @for (item of filtered(); track item.id) {
                  <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                    <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{{ item.title }}</td>
                    <td class="px-5 py-3.5">
                      <span
                        [class]="
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                          statusStyles[item.status]
                        "
                        >{{ item.status }}</span
                      >
                    </td>
                    <td class="max-w-[220px] truncate px-5 py-3.5 text-gray-500">{{ item.meta ?? '—' }}</td>
                    <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                      {{ formatDate(item.updatedAt) }}
                    </td>
                    <td class="px-5 py-3.5">
                      <app-admin-row-actions
                        [itemLabel]="item.title"
                        [onView]="onView ? bindAction(onView, item) : undefined"
                        [onEdit]="onEdit ? bindAction(onEdit, item) : undefined"
                        [onDelete]="onDelete ? bindAction(onDelete, item) : undefined"
                      />
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class ResourcePageComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) resourceLabel!: string;
  @Input() searchPlaceholder = 'Search title, details...';
  /** Optional handlers — omit to keep the UI-shell preview (disabled actions) */
  @Input() onAdd?: () => void;
  @Input() onView?: (item: AdminResource) => void;
  @Input() onEdit?: (item: AdminResource) => void;
  @Input() onDelete?: (item: AdminResource) => void;

  /** Keep items in a signal so filtered() updates when parent passes new data. */
  readonly itemsSig = signal<AdminResource[]>([]);

  @Input() set items(value: AdminResource[] | null | undefined) {
    this.itemsSig.set(value ?? []);
  }
  get items(): AdminResource[] {
    return this.itemsSig();
  }

  readonly query = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly statusStyles = statusStyles;
  readonly pluralize = pluralize;
  readonly tableHeadings = ['Title', 'Status', 'Details', 'Updated', 'Actions'];
  readonly statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.itemsSig().filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!q) return true;
      const haystack = [item.title, item.meta ?? '', item.id].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  });

  onStatusFilter(value: string): void {
    this.statusFilter.set(value as StatusFilter);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }

  bindAction(handler: (item: AdminResource) => void, item: AdminResource): () => void {
    return () => handler(item);
  }
}
