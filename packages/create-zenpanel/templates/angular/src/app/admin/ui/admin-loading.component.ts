import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-loading',
  host: { class: 'block w-full' },
  template: `
    <div
      class="flex items-center justify-center"
      [class]="fullHeight ? 'h-dvh w-full' : 'min-h-[50vh]'"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          aria-hidden="true"
        ></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>
    </div>
  `,
})
export class AdminLoadingComponent {
  @Input() message = 'Loading…';
  @Input() fullHeight = false;
}
