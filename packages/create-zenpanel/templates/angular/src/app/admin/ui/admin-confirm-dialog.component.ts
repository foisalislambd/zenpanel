import { Component, input, output } from '@angular/core';
import { AdminDialogComponent } from './admin-dialog.component';
import { IconComponent } from '@/app/shared/icon.component';

/** Confirmation step for destructive actions (delete, ban). Focuses Cancel first. */
@Component({
  selector: 'app-admin-confirm-dialog',
  imports: [AdminDialogComponent, IconComponent],
  template: `
    <app-admin-dialog [open]="open()" [title]="title()" size="sm" (closed)="cancelled.emit()">
      <div class="flex gap-3">
        @if (tone() === 'danger') {
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15"
          >
            <app-icon name="alert-triangle" [size]="20" />
          </span>
        }
        <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <ng-content />
        </div>
      </div>
      <button
        dialogFooter
        type="button"
        data-autofocus
        class="admin-btn admin-btn-secondary"
        (click)="cancelled.emit()"
      >
        {{ cancelLabel() }}
      </button>
      <button
        dialogFooter
        type="button"
        class="admin-btn"
        [class.admin-btn-danger]="tone() === 'danger'"
        [class.admin-btn-primary]="tone() !== 'danger'"
        (click)="confirmed.emit()"
      >
        {{ confirmLabel() }}
      </button>
    </app-admin-dialog>
  `,
})
export class AdminConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly confirmLabel = input('Delete');
  readonly cancelLabel = input('Cancel');
  readonly tone = input<'danger' | 'default'>('danger');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
