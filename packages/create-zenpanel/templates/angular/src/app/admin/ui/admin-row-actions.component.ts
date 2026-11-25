import { Component, Input } from '@angular/core';
import { IconComponent } from '@/app/shared/icon.component';

const pendingTitle = 'Available after you connect your API';

@Component({
  selector: 'app-admin-row-actions',
  imports: [IconComponent],
  template: `
    <div [class]="'flex items-center justify-end gap-0.5 ' + className">
      <button
        type="button"
        (click)="enabled(onView) && onView?.()"
        [disabled]="!enabled(onView)"
        [attr.title]="enabled(onView) ? null : pendingTitle"
        [attr.aria-label]="'View ' + itemLabel"
        [class]="btnClass(onView)"
      >
        <app-icon name="eye" [size]="iconPx" />
      </button>
      <button
        type="button"
        (click)="enabled(onEdit) && onEdit?.()"
        [disabled]="!enabled(onEdit)"
        [attr.title]="enabled(onEdit) ? null : pendingTitle"
        [attr.aria-label]="'Edit ' + itemLabel"
        [class]="btnClass(onEdit)"
      >
        <app-icon name="pencil" [size]="iconPx" />
      </button>
      <button
        type="button"
        (click)="enabled(onDelete) && onDelete?.()"
        [disabled]="!enabled(onDelete)"
        [attr.title]="enabled(onDelete) ? null : pendingTitle"
        [attr.aria-label]="'Delete ' + itemLabel"
        [class]="btnClass(onDelete, true)"
      >
        <app-icon name="trash-2" [size]="iconPx" />
      </button>
    </div>
  `,
})
export class AdminRowActionsComponent {
  /** Used in aria-labels, e.g. item title or user name */
  @Input({ required: true }) itemLabel!: string;
  @Input() onView?: () => void;
  @Input() onEdit?: () => void;
  @Input() onDelete?: () => void;
  /** Force all actions into pending/disabled preview mode */
  @Input() pending = false;
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() className = '';

  readonly pendingTitle = pendingTitle;

  get iconPx(): number {
    return this.size === 'md' ? 18 : 16;
  }

  enabled(handler?: () => void): boolean {
    return Boolean(handler) && !this.pending;
  }

  btnClass(handler?: () => void, danger = false): string {
    const dim = this.size === 'md' ? 'h-9 w-9' : 'h-8 w-8';
    const state = !this.enabled(handler)
      ? 'cursor-not-allowed opacity-70'
      : danger
        ? 'hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/15 dark:hover:text-error-500'
        : 'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200';
    return `flex items-center justify-center rounded-lg text-gray-500 transition-colors dark:text-gray-400 ${dim} ${state}`;
  }
}
