import { Component, input, output } from '@angular/core';
import { IconComponent } from '@/app/shared/icon.component';

/** Inline error card with a retry action for failed loads. */
@Component({
  selector: 'app-admin-error-state',
  imports: [IconComponent],
  template: `
    <div class="admin-card flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span
        class="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15"
      >
        <app-icon name="alert-triangle" [size]="24" />
      </span>
      <h2 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">{{ title() }}</h2>
      <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{{ message() }}</p>
      <button type="button" class="admin-btn admin-btn-secondary mt-5" (click)="retry.emit()">
        <app-icon name="rotate-cw" [size]="16" />
        Try again
      </button>
    </div>
  `,
})
export class AdminErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
