import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-page-header',
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1">
        <h1
          class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
        >
          {{ title }}
        </h1>
      </div>
      <ng-content select="[actions]" />
    </div>
  `,
})
export class AdminPageHeaderComponent {
  @Input({ required: true }) title!: string;
}
