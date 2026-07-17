import { Component, Input, OnChanges } from '@angular/core';
import type { AdminResource } from '@/app/lib/admin-data/resources';
import { IconComponent } from '@/app/shared/icon.component';
import { AdminEmptyStateComponent } from '@/app/admin/ui/admin-empty-state.component';

const statusStyles: Record<AdminResource['status'], string> = {
  published: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  archived: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
};

const disabledActionTitle = 'Available after you connect your API';

const irregularPlurals: Record<string, string> = {
  category: 'categories',
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

type ResourceRow = AdminResource & { statusStyle: string; updatedLabel: string };

@Component({
  selector: 'app-resource-list',
  imports: [IconComponent, AdminEmptyStateComponent],
  template: `
    <div class="admin-card w-full overflow-hidden">
      <div
        class="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800"
      >
        <div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ rows.length }} {{ pluralLabel }}
          </p>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            UI shell — wire your API to enable create, edit, and delete.
          </p>
        </div>
        <button
          type="button"
          disabled
          [title]="disabledActionTitle"
          class="inline-flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-brand-500/50 px-4 text-sm font-semibold text-white/90"
        >
          <app-icon name="plus" [size]="16" />
          Add new
        </button>
      </div>

      @if (rows.length > 0) {
        <div class="admin-scrollbar overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-white/[0.02]">
                <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Title
                </th>
                <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Details
                </th>
                <th scope="col" class="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Updated
                </th>
                <th
                  scope="col"
                  class="px-6 py-3.5 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (item of rows; track item.id) {
                <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white/90">{{ item.title }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      [class]="item.statusStyle"
                      >{{ item.status }}</span
                    >
                  </td>
                  <td class="px-6 py-4 text-gray-500">{{ item.meta ?? '—' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ item.updatedLabel }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        disabled
                        [title]="disabledActionTitle"
                        class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        [attr.aria-label]="'Edit ' + item.title"
                      >
                        <app-icon name="pencil" [size]="16" />
                      </button>
                      <button
                        type="button"
                        disabled
                        [title]="disabledActionTitle"
                        class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        [attr.aria-label]="'More actions for ' + item.title"
                      >
                        <app-icon name="more-horizontal" [size]="16" />
                      </button>
                      <button
                        type="button"
                        disabled
                        [title]="disabledActionTitle"
                        class="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-gray-400"
                        [attr.aria-label]="'Delete ' + item.title"
                      >
                        <app-icon name="trash-2" [size]="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <app-admin-empty-state
          icon="database"
          [title]="'No ' + resourceLabel.toLowerCase() + ' yet'"
          [description]="
            'This page is ready for your data. Connect your backend API to load, create, and manage ' +
            resourceLabel.toLowerCase() +
            ' from here.'
          "
        />
      }
    </div>
  `,
})
export class ResourceListComponent implements OnChanges {
  @Input({ required: true }) items: AdminResource[] = [];
  @Input({ required: true }) resourceLabel = 'item';

  readonly disabledActionTitle = disabledActionTitle;
  rows: ResourceRow[] = [];
  pluralLabel = '';

  ngOnChanges(): void {
    this.rows = this.items.map((item) => ({
      ...item,
      statusStyle: statusStyles[item.status],
      updatedLabel: new Date(item.updatedAt).toLocaleDateString(),
    }));
    this.pluralLabel = pluralize(this.resourceLabel, this.items.length);
  }
}
