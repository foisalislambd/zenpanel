import { Component, computed, input, output } from '@angular/core';
import type { SortDirection } from '@/app/lib/sort';
import { IconComponent } from '@/app/shared/icon.component';

/** Clickable, accessible column header. Use on a <th>: `<th app-sort-header ...>`. */
@Component({
  selector: 'th[app-sort-header]',
  imports: [IconComponent],
  host: {
    scope: 'col',
    class: 'px-5 py-3',
    '[attr.aria-sort]': "active() ? (direction() === 'asc' ? 'ascending' : 'descending') : 'none'",
  },
  template: `
    <button
      type="button"
      class="-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors hover:text-gray-900 dark:hover:text-white"
      [class]="active() ? 'text-gray-900 dark:text-white' : 'text-gray-500'"
      (click)="sort.emit()"
    >
      {{ label() }}
      <app-icon [name]="icon()" [size]="14" [class.opacity-60]="!active()" />
    </button>
  `,
})
export class AdminSortHeaderComponent {
  readonly label = input.required<string>();
  readonly active = input(false);
  readonly direction = input<SortDirection>('asc');
  readonly sort = output<void>();

  readonly icon = computed(() =>
    !this.active() ? 'chevrons-up-down' : this.direction() === 'asc' ? 'arrow-up' : 'arrow-down',
  );
}
