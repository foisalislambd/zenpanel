import { Component, OnInit, computed, inject, input, signal, type WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { ResourceEditorComponent, type ResourceInput } from '@/app/admin/shared/resource-editor.component';
import { ResourceStatusBadgeComponent } from '@/app/admin/shared/resource-status-badge.component';
import { AdminAddButtonComponent } from '@/app/admin/ui/admin-add-button.component';
import { AdminConfirmDialogComponent } from '@/app/admin/ui/admin-confirm-dialog.component';
import { AdminDialogComponent } from '@/app/admin/ui/admin-dialog.component';
import { AdminFilterGroupComponent } from '@/app/admin/ui/admin-filter-group.component';
import { AdminPaginationComponent } from '@/app/admin/ui/admin-pagination.component';
import { AdminRowActionsComponent } from '@/app/admin/ui/admin-row-actions.component';
import { AdminSortHeaderComponent } from '@/app/admin/ui/admin-sort-header.component';
import { PreviewStoreService, previewId } from '@/app/core/preview-store.service';
import { ToastService } from '@/app/core/toast.service';
import type { AdminResource, AdminResourceStatus } from '@/app/lib/admin-data/resources';
import {
  RESOURCE_STATUSES,
  capitalize,
  countResourceStatuses,
  filterResources,
  pluralize,
  type ResourceSortKey,
  type ResourceStatusFilter,
} from '@/app/lib/admin-resources';
import { formatDate } from '@/app/lib/format';
import { ADMIN_PAGE_SIZE, slicePage } from '@/app/lib/pagination';
import { downloadCsv, nextSort, type SortState } from '@/app/lib/sort';
import { IconComponent } from '@/app/shared/icon.component';

export type { ResourceInput };

/**
 * Reusable admin resource list page: search, status filters, sortable table,
 * pagination, CSV export, create / edit / view / delete with confirmation.
 * Without the `on*` handlers it edits an in-memory preview copy.
 */
@Component({
  selector: 'app-resource-page',
  imports: [
    AdminPageHeaderComponent,
    AdminAddButtonComponent,
    AdminConfirmDialogComponent,
    AdminDialogComponent,
    AdminFilterGroupComponent,
    AdminPaginationComponent,
    AdminRowActionsComponent,
    AdminSortHeaderComponent,
    ResourceEditorComponent,
    ResourceStatusBadgeComponent,
    IconComponent,
  ],
  template: `
    <div class="admin-content">
      <app-admin-page-header [title]="title()">
        <button
          actions
          type="button"
          [disabled]="filtered().length === 0"
          class="admin-btn admin-btn-secondary"
          (click)="exportCsv()"
        >
          <app-icon name="download" [size]="16" />
          Export
        </button>
        <app-admin-add-button actions [label]="'Add ' + label()" [onClick]="openCreate" />
      </app-admin-page-header>

      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="relative w-full max-w-md">
          <app-icon
            name="search"
            [size]="16"
            class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            [value]="query()"
            (input)="setQuery($any($event.target).value)"
            [placeholder]="searchPlaceholder()"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            [attr.aria-label]="'Search ' + plural()"
          />
          @if (query()) {
            <button
              type="button"
              class="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
              aria-label="Clear search"
              (click)="setQuery('')"
            >
              <app-icon name="x" [size]="16" />
            </button>
          }
        </div>
        <app-admin-filter-group
          ariaLabel="Filter by status"
          [value]="statusFilter()"
          [options]="filterOptions()"
          (valueChange)="setStatusFilter($any($event))"
        />
      </div>

      <div class="admin-card w-full overflow-hidden">
        @if (filtered().length === 0) {
          <div class="flex flex-col items-center px-6 py-16 text-center">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500"
            >
              <app-icon [name]="items().length === 0 ? 'inbox' : 'search-x'" [size]="24" />
            </span>
            <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              {{ items().length === 0 ? 'No ' + plural() + ' yet' : 'No ' + plural() + ' match your filters' }}
            </p>
            <p class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {{
                items().length === 0
                  ? 'Create your first ' + label() + ' to get started.'
                  : 'Try a different search term or clear the filters.'
              }}
            </p>
            <div class="mt-5">
              @if (items().length === 0) {
                <app-admin-add-button [label]="'Add ' + label()" [onClick]="openCreate" />
              } @else if (hasFilters()) {
                <button type="button" class="admin-btn admin-btn-secondary" (click)="clearFilters()">
                  Clear filters
                </button>
              }
            </div>
          </div>
        } @else {
          <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            @for (item of paged().rows; track item.id) {
              <li class="px-4 py-3.5">
                <div class="flex items-start justify-between gap-3">
                  <button type="button" class="min-w-0 flex-1 rounded-md text-left" (click)="viewing.set(item)">
                    <p class="truncate font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                    <p class="mt-0.5 truncate text-sm text-gray-500">{{ item.meta ?? '-' }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <app-resource-status-badge [status]="item.status" [label]="statusText(item.status)" />
                      <span class="text-xs text-gray-500">{{ formatDate(item.updatedAt) }}</span>
                    </div>
                  </button>
                  <app-admin-row-actions
                    [itemLabel]="item.title"
                    size="md"
                    [onView]="bind(viewing, item)"
                    [onEdit]="bind(editing, item)"
                    [onDelete]="bind(deleting, item)"
                  />
                </div>
              </li>
            }
          </ul>

          <!-- Scrollable region must be keyboard-focusable (WCAG 2.1.1). -->
          <div
            class="admin-scrollbar hidden overflow-x-auto md:block"
            tabindex="0"
            role="region"
            [attr.aria-label]="title() + ' table'"
          >
            <table class="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th app-sort-header [label]="titleLabel()" [active]="sort().key === 'title'" [direction]="sort().direction" (sort)="sortBy('title')"></th>
                  <th app-sort-header label="Status" [active]="sort().key === 'status'" [direction]="sort().direction" (sort)="sortBy('status')"></th>
                  <th scope="col" class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
                    {{ metaLabel() }}
                  </th>
                  <th app-sort-header label="Updated" [active]="sort().key === 'updatedAt'" [direction]="sort().direction" (sort)="sortBy('updatedAt')"></th>
                  <th scope="col" class="px-5 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of paged().rows; track item.id) {
                  <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                    <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                      <button
                        type="button"
                        class="rounded text-left hover:text-brand-600 dark:hover:text-brand-400"
                        (click)="viewing.set(item)"
                      >
                        {{ item.title }}
                      </button>
                    </td>
                    <td class="px-5 py-3.5">
                      <app-resource-status-badge [status]="item.status" [label]="statusText(item.status)" />
                    </td>
                    <td class="max-w-[260px] truncate px-5 py-3.5 text-gray-500" [attr.title]="item.meta">
                      {{ item.meta ?? '-' }}
                    </td>
                    <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                      <time [attr.datetime]="item.updatedAt">{{ formatDate(item.updatedAt) }}</time>
                    </td>
                    <td class="px-5 py-3.5">
                      <app-admin-row-actions
                        [itemLabel]="item.title"
                        [onView]="bind(viewing, item)"
                        [onEdit]="bind(editing, item)"
                        [onDelete]="bind(deleting, item)"
                      />
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        <app-admin-pagination
          [page]="paged().page"
          [pageCount]="paged().pageCount"
          [total]="filtered().length"
          [pageSize]="pageSize()"
          [showPageSize]="true"
          (pageChange)="page.set($event)"
          (pageSizeChange)="setPageSize($event)"
        />
      </div>

      @if (editing(); as target) {
        <app-resource-editor
          [item]="target === 'new' ? null : target"
          [label]="label()"
          [titleLabel]="titleLabel()"
          [metaLabel]="metaLabel()"
          [titleIsEmail]="titleIsEmail()"
          [statusText]="statusTextFn"
          [save]="handleSave"
          (cancelled)="closeEditor()"
        />
      }

      <app-admin-dialog
        [open]="viewing() !== null"
        placement="right"
        [title]="viewing()?.title ?? ''"
        [description]="viewing() ? capitalize(label()) + ' · ' + viewing()!.id : undefined"
        (closed)="viewing.set(null)"
      >
        @if (viewing(); as v) {
          <dl class="space-y-4 text-sm">
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ titleLabel() }}</dt>
              <dd class="mt-1 text-gray-900 dark:text-white">{{ v.title }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Status</dt>
              <dd class="mt-1"><app-resource-status-badge [status]="v.status" [label]="statusText(v.status)" /></dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ metaLabel() }}</dt>
              <dd class="mt-1 text-gray-900 dark:text-white">{{ v.meta || '-' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last updated</dt>
              <dd class="mt-1 text-gray-900 dark:text-white">{{ toLocale(v.updatedAt) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">ID</dt>
              <dd class="mt-1 text-gray-900 dark:text-white">
                <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">{{ v.id }}</code>
              </dd>
            </div>
          </dl>
        }
        <button dialogFooter type="button" class="admin-btn admin-btn-danger-ghost" (click)="deleteFromDrawer()">
          Delete
        </button>
        <button dialogFooter type="button" class="admin-btn admin-btn-primary" (click)="editFromDrawer()">
          Edit {{ label() }}
        </button>
      </app-admin-dialog>

      <app-admin-confirm-dialog
        [open]="deleting() !== null"
        [title]="'Delete ' + label() + '?'"
        [confirmLabel]="'Delete ' + label()"
        (cancelled)="deleting.set(null)"
        (confirmed)="handleDelete()"
      >
        <strong class="font-semibold text-gray-900 dark:text-white">“{{ deleting()?.title }}”</strong>
        will be permanently removed. This action cannot be undone.
      </app-admin-confirm-dialog>
    </div>
  `,
})
export class ResourcePageComponent implements OnInit {
  readonly title = input.required<string>();
  readonly resourceLabel = input.required<string>();
  readonly initialItems = input.required<AdminResource[]>({ alias: 'items' });
  readonly searchPlaceholder = input('Search title, details...');
  readonly titleLabel = input('Title');
  readonly metaLabel = input('Details');
  /** Validate the title as an email address (newsletter, contacts). */
  readonly titleIsEmail = input(false);
  /** Rename statuses per resource, e.g. `{ published: 'Paid' }`. */
  readonly statusLabels = input<Partial<Record<AdminResourceStatus, string>>>({});
  /** Persist changes to your API. Omit to edit an in-memory preview copy. */
  readonly onCreate = input<(input: ResourceInput) => Promise<AdminResource> | AdminResource>();
  readonly onUpdate = input<(item: AdminResource, input: ResourceInput) => Promise<AdminResource> | AdminResource>();
  readonly onDelete = input<(item: AdminResource) => Promise<void> | void>();

  private readonly store = inject(PreviewStoreService);
  private readonly toaster = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private collection!: WritableSignal<AdminResource[]>;
  readonly items = computed(() => this.collection());

  readonly query = signal('');
  readonly statusFilter = signal<ResourceStatusFilter>('all');
  readonly sort = signal<SortState<ResourceSortKey>>({ key: 'updatedAt', direction: 'desc' });
  readonly page = signal(1);
  readonly pageSize = signal(ADMIN_PAGE_SIZE);
  readonly editing = signal<AdminResource | 'new' | null>(null);
  readonly viewing = signal<AdminResource | null>(null);
  readonly deleting = signal<AdminResource | null>(null);

  readonly label = computed(() => this.resourceLabel().toLowerCase());
  readonly plural = computed(() => pluralize(this.label(), 2));
  readonly counts = computed(() => countResourceStatuses(this.items()));
  readonly filtered = computed(() => filterResources(this.items(), this.query(), this.statusFilter(), this.sort()));
  readonly paged = computed(() => slicePage(this.filtered(), this.page(), this.pageSize()));
  readonly hasFilters = computed(() => this.query().trim() !== '' || this.statusFilter() !== 'all');
  readonly filterOptions = computed(() => [
    { value: 'all', label: 'All', count: this.counts().all },
    ...RESOURCE_STATUSES.map((s) => ({ value: s, label: this.statusText(s), count: this.counts()[s] })),
  ]);

  readonly capitalize = capitalize;
  readonly formatDate = formatDate;
  readonly statusTextFn = (s: AdminResourceStatus) => this.statusText(s);
  readonly openCreate = () => this.editing.set('new');

  ngOnInit(): void {
    this.collection = this.store.collection(`resource:${this.resourceLabel()}`, this.initialItems());
    if (this.route.snapshot.queryParamMap.get('new') === '1') this.editing.set('new');
  }

  statusText(s: AdminResourceStatus): string {
    return this.statusLabels()[s] ?? capitalize(s);
  }

  toLocale(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  bind<T>(target: WritableSignal<T | null>, value: T): () => void {
    return () => target.set(value);
  }

  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: ResourceStatusFilter): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  sortBy(key: ResourceSortKey): void {
    this.sort.update((s) => nextSort(s, key));
    this.page.set(1);
  }

  clearFilters(): void {
    this.query.set('');
    this.statusFilter.set('all');
    this.page.set(1);
  }

  closeEditor(): void {
    this.editing.set(null);
    if (this.route.snapshot.queryParamMap.has('new')) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { new: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  editFromDrawer(): void {
    this.editing.set(this.viewing());
    this.viewing.set(null);
  }

  deleteFromDrawer(): void {
    this.deleting.set(this.viewing());
    this.viewing.set(null);
  }

  readonly handleSave = async (input: ResourceInput): Promise<void> => {
    const target = this.editing();
    const label = this.label();
    try {
      if (target === 'new') {
        const onCreate = this.onCreate();
        const created = onCreate
          ? await onCreate(input)
          : { id: previewId(label.slice(0, 3)), updatedAt: new Date().toISOString(), ...input };
        this.collection.update((list) => [created, ...list]);
        this.statusFilter.set('all');
        this.page.set(1);
        this.toaster.toast({ title: `${capitalize(label)} created`, description: `“${created.title}” was added.` });
      } else if (target) {
        const onUpdate = this.onUpdate();
        const updated = onUpdate
          ? await onUpdate(target, input)
          : { ...target, ...input, updatedAt: new Date().toISOString() };
        this.collection.update((list) => list.map((i) => (i.id === target.id ? updated : i)));
        this.toaster.toast({ title: 'Changes saved', description: `“${updated.title}” was updated.` });
      }
      this.closeEditor();
    } catch (err) {
      this.toaster.toast({ variant: 'error', title: 'Could not save', description: errMsg(err) });
    }
  };

  async handleDelete(): Promise<void> {
    const target = this.deleting();
    if (!target) return;
    this.deleting.set(null);
    try {
      await this.onDelete()?.(target);
      this.collection.update((list) => list.filter((i) => i.id !== target.id));
      this.toaster.toast({
        title: `${capitalize(this.label())} deleted`,
        description: `“${target.title}” was removed.`,
      });
    } catch (err) {
      this.toaster.toast({ variant: 'error', title: 'Could not delete', description: errMsg(err) });
    }
  }

  exportCsv(): void {
    const rows = this.filtered();
    downloadCsv(
      `${this.plural()}.csv`,
      ['ID', this.titleLabel(), 'Status', this.metaLabel(), 'Updated'],
      rows.map((i) => [i.id, i.title, this.statusText(i.status), i.meta ?? '', i.updatedAt]),
    );
    this.toaster.toast({
      variant: 'info',
      title: 'Export ready',
      description: `${rows.length} ${pluralize(this.label(), rows.length)} exported to CSV.`,
    });
  }
}

function errMsg(err: unknown): string | undefined {
  return err instanceof Error ? err.message : undefined;
}
