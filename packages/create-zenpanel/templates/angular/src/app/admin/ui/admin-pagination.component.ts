import { Component, computed, input, output } from '@angular/core';
import { pageWindow } from '@/app/lib/admin-resources';
import { ADMIN_PAGE_SIZE, ADMIN_PAGE_SIZE_OPTIONS } from '@/app/lib/pagination';
import { IconComponent } from '@/app/shared/icon.component';

export { ADMIN_PAGE_SIZE } from '@/app/lib/pagination';

let nextPaginationId = 0;

const button =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const idle =
  'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5';
const active = 'bg-brand-500 text-white shadow-sm shadow-brand-500/20';

@Component({
  selector: 'app-admin-pagination',
  imports: [IconComponent],
  template: `
    @if (total() > 0) {
      <nav
        aria-label="Pagination"
        class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            Showing
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ start() }}–{{ end() }}</span>
            of
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ total() }}</span>
          </p>
          @if (showPageSize()) {
            <label [attr.for]="sizeId" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Rows
              <select
                [id]="sizeId"
                [value]="pageSize()"
                (change)="pageSizeChange.emit(+$any($event.target).value)"
                class="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                @for (size of sizeOptions; track size) {
                  <option [value]="size" [selected]="size === pageSize()">{{ size }}</option>
                }
              </select>
            </label>
          }
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            [class]="cls.button + ' ' + cls.idle"
            [disabled]="page() <= 1"
            aria-label="Previous page"
            (click)="pageChange.emit(page() - 1)"
          >
            <app-icon name="chevron-left" [size]="16" />
          </button>
          @for (item of items(); track $index) {
            @if (item === 'ellipsis') {
              <span class="px-1 text-sm text-gray-400" aria-hidden="true">…</span>
            } @else {
              <button
                type="button"
                [attr.aria-label]="'Page ' + item"
                [attr.aria-current]="item === page() ? 'page' : null"
                [class]="cls.button + ' ' + (item === page() ? cls.active : cls.idle)"
                (click)="pageChange.emit(item)"
              >
                {{ item }}
              </button>
            }
          }
          <button
            type="button"
            [class]="cls.button + ' ' + cls.idle"
            [disabled]="page() >= pageCount()"
            aria-label="Next page"
            (click)="pageChange.emit(page() + 1)"
          >
            <app-icon name="chevron-right" [size]="16" />
          </button>
        </div>
      </nav>
    }
  `,
})
export class AdminPaginationComponent {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly total = input.required<number>();
  readonly pageSize = input(ADMIN_PAGE_SIZE);
  /** Show the "Rows" select (emits `pageSizeChange`). */
  readonly showPageSize = input(false);
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly sizeId = `zp-page-size-${nextPaginationId++}`;
  readonly sizeOptions = ADMIN_PAGE_SIZE_OPTIONS;
  readonly cls = { button, idle, active };
  readonly start = computed(() => (this.page() - 1) * this.pageSize() + 1);
  readonly end = computed(() => Math.min(this.page() * this.pageSize(), this.total()));
  readonly items = computed(() => pageWindow(this.page(), this.pageCount()));
}
