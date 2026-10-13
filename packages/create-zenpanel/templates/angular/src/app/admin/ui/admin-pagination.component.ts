import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '@/app/shared/icon.component';

export const ADMIN_PAGE_SIZE = 5;

@Component({
  selector: 'app-admin-pagination',
  imports: [IconComponent],
  template: `
    @if (total > 0) {
      <nav
        aria-label="Pagination"
        class="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ start }}–{{ end }}</span>
          of
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ total }}</span>
        </p>
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
            [disabled]="page <= 1"
            aria-label="Previous page"
            (click)="pageChange.emit(page - 1)"
          >
            <app-icon name="chevron-left" [size]="16" />
          </button>
          @for (item of items; track $index) {
            @if (item === 'ellipsis') {
              <span class="px-1 text-sm text-gray-400">…</span>
            } @else {
              <button
                type="button"
                [attr.aria-current]="item === page ? 'page' : null"
                [class]="
                  item === page
                    ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-500 px-2.5 text-sm font-medium text-white shadow-sm shadow-brand-500/20'
                    : 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5'
                "
                (click)="pageChange.emit(asPage(item))"
              >
                {{ item }}
              </button>
            }
          }
          <button
            type="button"
            class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
            [disabled]="page >= pageCount"
            aria-label="Next page"
            (click)="pageChange.emit(page + 1)"
          >
            <app-icon name="chevron-right" [size]="16" />
          </button>
        </div>
      </nav>
    }
  `,
})
export class AdminPaginationComponent {
  @Input({ required: true }) page = 1;
  @Input({ required: true }) pageCount = 1;
  @Input({ required: true }) total = 0;
  @Input() pageSize = ADMIN_PAGE_SIZE;
  @Output() pageChange = new EventEmitter<number>();

  get start(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  get end(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  get items(): Array<number | 'ellipsis'> {
    if (this.pageCount <= 7) {
      return Array.from({ length: this.pageCount }, (_, index) => index + 1);
    }
    const windowItems: Array<number | 'ellipsis'> = [1];
    const from = Math.max(2, this.page - 1);
    const to = Math.min(this.pageCount - 1, this.page + 1);
    if (from > 2) windowItems.push('ellipsis');
    for (let index = from; index <= to; index += 1) windowItems.push(index);
    if (to < this.pageCount - 1) windowItems.push('ellipsis');
    windowItems.push(this.pageCount);
    return windowItems;
  }

  asPage(item: number | 'ellipsis'): number {
    return item as number;
  }
}
