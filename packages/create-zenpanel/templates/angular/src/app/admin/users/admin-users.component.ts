import { Component, OnInit, computed, inject, input, signal, type WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AdminAddButtonComponent } from '@/app/admin/ui/admin-add-button.component';
import { AdminConfirmDialogComponent } from '@/app/admin/ui/admin-confirm-dialog.component';
import { AdminDialogComponent } from '@/app/admin/ui/admin-dialog.component';
import { AdminFilterGroupComponent, type AdminFilterOption } from '@/app/admin/ui/admin-filter-group.component';
import { AdminPaginationComponent } from '@/app/admin/ui/admin-pagination.component';
import { AdminRowActionsComponent } from '@/app/admin/ui/admin-row-actions.component';
import { AdminSortHeaderComponent } from '@/app/admin/ui/admin-sort-header.component';
import { UserAvatarComponent } from '@/app/admin/users/user-avatar.component';
import { UserBadgesComponent } from '@/app/admin/users/user-badges.component';
import { UserEditorComponent, type UserInput } from '@/app/admin/users/user-editor.component';
import { PreviewStoreService, previewId } from '@/app/core/preview-store.service';
import { ToastService } from '@/app/core/toast.service';
import type { PortalUserRow, UserAccountStatus } from '@/app/lib/admin-api';
import {
  USERS_CSV_HEADERS,
  capitalize,
  dash,
  filterUsers,
  presentProviders,
  usersCsvRows,
  type UserSortKey,
  type UserStatusFilter,
} from '@/app/lib/admin-resources';
import { formatDate } from '@/app/lib/format';
import { ADMIN_PAGE_SIZE, slicePage } from '@/app/lib/pagination';
import { downloadCsv, nextSort, type SortState } from '@/app/lib/sort';
import { IconComponent } from '@/app/shared/icon.component';

export type { UserInput };

const statusOptions: AdminFilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
];

/**
 * Users management: search, filters, sortable table, pagination, CSV export,
 * detail drawer, invite / edit / ban / delete with confirmation.
 */
@Component({
  selector: 'app-admin-users',
  imports: [
    AdminPageHeaderComponent,
    AdminAddButtonComponent,
    AdminConfirmDialogComponent,
    AdminDialogComponent,
    AdminFilterGroupComponent,
    AdminPaginationComponent,
    AdminRowActionsComponent,
    AdminSortHeaderComponent,
    UserAvatarComponent,
    UserBadgesComponent,
    UserEditorComponent,
    IconComponent,
  ],
  template: `
    <div class="admin-content">
      <app-admin-page-header title="Users">
        <button actions type="button" [disabled]="filtered().length === 0" class="admin-btn admin-btn-secondary" (click)="exportCsv()">
          <app-icon name="download" [size]="16" />
          Export
        </button>
        <app-admin-add-button actions label="Invite user" [onClick]="openCreate" />
      </app-admin-page-header>

      <div class="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div class="relative w-full max-w-md">
          <app-icon name="search" [size]="16" class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            [value]="query()"
            (input)="setQuery($any($event.target).value)"
            placeholder="Search name, email, phone, IP..."
            class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search users"
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
        <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
          <app-admin-filter-group
            label="Status"
            ariaLabel="Filter by status"
            [value]="statusFilter()"
            [options]="statusOptions"
            (valueChange)="statusFilter.set($any($event)); page.set(1)"
          />
          <app-admin-filter-group
            label="Provider"
            ariaLabel="Filter by sign-in provider"
            [value]="providerFilter()"
            [options]="providerOptions()"
            (valueChange)="providerFilter.set($event); page.set(1)"
          />
        </div>
      </div>

      <div class="admin-card w-full overflow-hidden">
        @if (filtered().length === 0) {
          <div class="flex flex-col items-center px-6 py-16 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
              <app-icon name="search-x" [size]="24" />
            </span>
            <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              {{ users().length === 0 ? 'No users yet' : 'No users match your filters' }}
            </p>
            <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {{ users().length === 0 ? 'Invite your first user to get started.' : 'Try a different search or clear the filters.' }}
            </p>
            @if (hasFilters()) {
              <button type="button" class="admin-btn admin-btn-secondary mt-5" (click)="clearFilters()">Clear filters</button>
            }
          </div>
        } @else {
          <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            @for (user of paged().rows; track user.id) {
              <li class="px-4 py-3.5">
                <div class="flex items-start justify-between gap-3">
                  <button type="button" class="flex min-w-0 flex-1 gap-3 rounded-md text-left" (click)="selectedId.set(user.id)">
                    <app-user-avatar [name]="user.name" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                      <span class="mt-0.5 block truncate text-sm text-gray-500">{{ user.email }}</span>
                      <span class="mt-2 flex flex-wrap items-center gap-1.5"><app-user-badges [user]="user" /></span>
                    </span>
                  </button>
                  <app-admin-row-actions
                    [itemLabel]="user.name"
                    size="md"
                    [onView]="view(user)"
                    [onEdit]="bind(editing, user)"
                    [onDelete]="bind(deleting, user)"
                  />
                </div>
              </li>
            }
          </ul>

          <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="Users table">
            <table class="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th app-sort-header label="User" [active]="sort().key === 'name'" [direction]="sort().direction" (sort)="sortBy('name')"></th>
                  <th app-sort-header label="Country" [active]="sort().key === 'country'" [direction]="sort().direction" (sort)="sortBy('country')"></th>
                  <th scope="col" [class]="plainTh">Phone</th>
                  <th app-sort-header label="Provider" [active]="sort().key === 'authProvider'" [direction]="sort().direction" (sort)="sortBy('authProvider')"></th>
                  <th scope="col" [class]="plainTh">Status</th>
                  <th app-sort-header label="Joined" [active]="sort().key === 'createdAt'" [direction]="sort().direction" (sort)="sortBy('createdAt')"></th>
                  <th scope="col" [class]="plainTh + ' text-right'">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (user of paged().rows; track user.id) {
                  <tr class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                    <td class="px-5 py-3">
                      <button type="button" class="group flex items-center gap-3 rounded-md text-left" (click)="selectedId.set(user.id)">
                        <app-user-avatar [name]="user.name" />
                        <span>
                          <span class="block font-medium text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">{{
                            user.name
                          }}</span>
                          <span class="mt-0.5 block text-sm text-gray-500">{{ user.email }}</span>
                        </span>
                      </button>
                    </td>
                    <td class="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{{ dash(user.country) }}</td>
                    <td class="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">{{ dash(user.phone) }}</td>
                    <td class="px-5 py-3"><app-user-badges [user]="user" [status]="false" /></td>
                    <td class="px-5 py-3">
                      <div class="flex flex-wrap items-center gap-1.5"><app-user-badges [user]="user" [provider]="false" /></div>
                    </td>
                    <td class="px-5 py-3 whitespace-nowrap text-gray-500">
                      <time [attr.datetime]="user.createdAt">{{ formatDate(user.createdAt) }}</time>
                    </td>
                    <td class="px-5 py-3">
                      <app-admin-row-actions
                        [itemLabel]="user.name"
                        [onView]="view(user)"
                        [onEdit]="bind(editing, user)"
                        [onDelete]="bind(deleting, user)"
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
          (pageSizeChange)="pageSize.set($event); page.set(1)"
        />
      </div>

      <app-admin-dialog
        [open]="selected() !== null"
        placement="right"
        [title]="selected()?.name ?? ''"
        [description]="selected()?.email"
        (closed)="selectedId.set(null)"
      >
        @if (selected(); as user) {
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <app-user-avatar [name]="user.name" />
              <div class="flex flex-wrap gap-1.5"><app-user-badges [user]="user" /></div>
            </div>
            <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              @for (row of detailRows(user); track row.label) {
                <div>
                  <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ row.label }}</dt>
                  <dd class="mt-1 break-words text-gray-900 dark:text-white">{{ row.value }}</dd>
                </div>
              }
            </dl>
          </div>
        }
        <button dialogFooter type="button" class="admin-btn admin-btn-danger-ghost" (click)="deleting.set(selected())">Delete</button>
        <button dialogFooter type="button" class="admin-btn admin-btn-secondary" (click)="banning.set(selected())">
          @if (selected()?.status === 'banned') {
            <app-icon name="shield-check" [size]="16" /> Reactivate
          } @else {
            <app-icon name="ban" [size]="16" /> Ban user
          }
        </button>
        <button dialogFooter type="button" class="admin-btn admin-btn-primary" (click)="editing.set(selected()); selectedId.set(null)">
          Edit user
        </button>
      </app-admin-dialog>

      @if (editing(); as target) {
        <app-user-editor
          [user]="target === 'new' ? null : target"
          [existingEmails]="existingEmails()"
          [save]="handleSave"
          (cancelled)="closeEditor()"
        />
      }

      <app-admin-confirm-dialog
        [open]="deleting() !== null"
        title="Delete user?"
        confirmLabel="Delete user"
        (cancelled)="deleting.set(null)"
        (confirmed)="confirmDelete()"
      >
        <strong class="font-semibold text-gray-900 dark:text-white">{{ deleting()?.name }}</strong>
        ({{ deleting()?.email }}) and their data will be permanently removed. This cannot be undone.
      </app-admin-confirm-dialog>

      <app-admin-confirm-dialog
        [open]="banning() !== null"
        [tone]="banning()?.status === 'banned' ? 'default' : 'danger'"
        [title]="banning()?.status === 'banned' ? 'Reactivate user?' : 'Ban user?'"
        [confirmLabel]="banning()?.status === 'banned' ? 'Reactivate' : 'Ban user'"
        (cancelled)="banning.set(null)"
        (confirmed)="confirmBanToggle()"
      >
        {{
          banning()?.status === 'banned'
            ? banning()?.name + ' will be able to sign in again.'
            : banning()?.name + ' will be signed out and blocked from signing in until reactivated.'
        }}
      </app-admin-confirm-dialog>
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  readonly initialUsers = input.required<PortalUserRow[]>({ alias: 'users' });
  /** Persist changes to your API. Omit to edit an in-memory preview copy. */
  readonly onCreate = input<(input: UserInput) => Promise<PortalUserRow> | PortalUserRow>();
  readonly onUpdate = input<(user: PortalUserRow, input: UserInput) => Promise<PortalUserRow> | PortalUserRow>();
  readonly onDelete = input<(user: PortalUserRow) => Promise<void> | void>();

  private readonly store = inject(PreviewStoreService);
  private readonly toaster = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private collection!: WritableSignal<PortalUserRow[]>;
  readonly users = computed(() => this.collection());

  readonly statusOptions = statusOptions;
  readonly plainTh = 'px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase';
  readonly dash = dash;
  readonly formatDate = formatDate;

  readonly query = signal('');
  readonly statusFilter = signal<UserStatusFilter>('all');
  readonly providerFilter = signal('all');
  readonly sort = signal<SortState<UserSortKey>>({ key: 'createdAt', direction: 'desc' });
  readonly page = signal(1);
  readonly pageSize = signal(ADMIN_PAGE_SIZE);
  readonly selectedId = signal<string | null>(null);
  readonly editing = signal<PortalUserRow | 'new' | null>(null);
  readonly deleting = signal<PortalUserRow | null>(null);
  readonly banning = signal<PortalUserRow | null>(null);

  readonly selected = computed(() => this.users().find((u) => u.id === this.selectedId()) ?? null);
  readonly providerOptions = computed<AdminFilterOption[]>(() => [
    { value: 'all', label: 'All' },
    ...presentProviders(this.users()).map((p) => ({ value: p as string, label: capitalize(p) })),
  ]);
  readonly filtered = computed(() =>
    filterUsers(this.users(), this.query(), this.statusFilter(), this.providerFilter(), this.sort()),
  );
  readonly paged = computed(() => slicePage(this.filtered(), this.page(), this.pageSize()));
  readonly hasFilters = computed(
    () => this.query().trim() !== '' || this.statusFilter() !== 'all' || this.providerFilter() !== 'all',
  );
  readonly existingEmails = computed(() => {
    const target = this.editing();
    return this.users()
      .filter((u) => target === 'new' || (target !== null && u.id !== target.id))
      .map((u) => u.email.toLowerCase());
  });

  readonly openCreate = () => this.editing.set('new');

  ngOnInit(): void {
    this.collection = this.store.collection('users', this.initialUsers());
    if (this.route.snapshot.queryParamMap.get('new') === '1') this.editing.set('new');
  }

  view(user: PortalUserRow): () => void {
    return () => this.selectedId.set(user.id);
  }

  bind<T>(target: WritableSignal<T | null>, value: T): () => void {
    return () => target.set(value);
  }

  detailRows(user: PortalUserRow): Array<{ label: string; value: string }> {
    return [
      { label: 'Country', value: dash(user.country) },
      { label: 'Phone', value: dash(user.phone) },
      { label: 'Email verified', value: user.emailVerified ? 'Yes' : 'No' },
      { label: 'Last IP', value: dash(user.lastIp) },
      { label: 'Joined', value: new Date(user.createdAt).toLocaleString() },
      { label: 'User ID', value: user.id },
    ];
  }

  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  sortBy(key: UserSortKey): void {
    this.sort.update((s) => nextSort(s, key));
    this.page.set(1);
  }

  clearFilters(): void {
    this.query.set('');
    this.statusFilter.set('all');
    this.providerFilter.set('all');
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

  readonly handleSave = async (input: UserInput): Promise<void> => {
    const target = this.editing();
    try {
      if (target === 'new') {
        const onCreate = this.onCreate();
        const created: PortalUserRow = onCreate
          ? await onCreate(input)
          : {
              id: previewId('u'),
              authProvider: 'email',
              createdAt: new Date().toISOString(),
              emailVerified: false,
              lastIp: null,
              ...input,
            };
        this.collection.update((list) => [created, ...list]);
        this.page.set(1);
        this.toaster.toast({ title: 'User invited', description: `An invitation was sent to ${created.email}.` });
      } else if (target) {
        const onUpdate = this.onUpdate();
        const updated = onUpdate ? await onUpdate(target, input) : { ...target, ...input };
        this.collection.update((list) => list.map((u) => (u.id === target.id ? updated : u)));
        this.toaster.toast({ title: 'User updated', description: `${updated.name}'s profile was saved.` });
      }
      this.closeEditor();
    } catch (err) {
      this.toaster.toast({ variant: 'error', title: 'Could not save user', description: errMsg(err) });
    }
  };

  async confirmDelete(): Promise<void> {
    const target = this.deleting();
    if (!target) return;
    this.deleting.set(null);
    try {
      await this.onDelete()?.(target);
      this.collection.update((list) => list.filter((u) => u.id !== target.id));
      if (this.selectedId() === target.id) this.selectedId.set(null);
      this.toaster.toast({ title: 'User deleted', description: `${target.name} was removed.` });
    } catch (err) {
      this.toaster.toast({ variant: 'error', title: 'Could not delete user', description: errMsg(err) });
    }
  }

  async confirmBanToggle(): Promise<void> {
    const target = this.banning();
    if (!target) return;
    this.banning.set(null);
    const status: UserAccountStatus = target.status === 'banned' ? 'active' : 'banned';
    try {
      const onUpdate = this.onUpdate();
      const updated = onUpdate ? await onUpdate(target, { ...target, status }) : { ...target, status };
      this.collection.update((list) => list.map((u) => (u.id === target.id ? updated : u)));
      this.toaster.toast({
        title: status === 'banned' ? 'User banned' : 'User reactivated',
        description: status === 'banned' ? `${target.name} can no longer sign in.` : `${target.name} can sign in again.`,
      });
    } catch (err) {
      this.toaster.toast({ variant: 'error', title: 'Could not update status', description: errMsg(err) });
    }
  }

  exportCsv(): void {
    const rows = this.filtered();
    downloadCsv('users.csv', USERS_CSV_HEADERS, usersCsvRows(rows));
    this.toaster.toast({ variant: 'info', title: 'Export ready', description: `${rows.length} users exported to CSV.` });
  }
}

function errMsg(err: unknown): string | undefined {
  return err instanceof Error ? err.message : undefined;
}
