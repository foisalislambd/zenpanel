import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-section-header',
  imports: [RouterLink],
  template: `
    <div
      class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800"
    >
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <ng-content select="[trailing]" />
      @if (href && !hasTrailing) {
        <a
          [routerLink]="href"
          class="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {{ linkLabel }}
        </a>
      }
    </div>
  `,
})
export class DashboardSectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() href?: string;
  @Input() linkLabel?: string = 'View all';
  @Input() hasTrailing = false;
}
