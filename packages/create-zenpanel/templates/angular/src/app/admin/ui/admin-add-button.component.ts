import { Component, Input } from '@angular/core';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-add-button',
  imports: [IconComponent],
  template: `
    <button
      type="button"
      (click)="enabled && onClick?.()"
      [disabled]="!enabled"
      [title]="enabled ? label : 'Available after you connect your API'"
      [class]="
        'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white ' +
        (enabled
          ? 'bg-brand-500 shadow-sm shadow-brand-500/20 hover:bg-brand-600'
          : 'cursor-not-allowed bg-brand-500/50 text-white/90')
      "
    >
      <app-icon name="plus" [size]="16" />
      {{ label }}
    </button>
  `,
})
export class AdminAddButtonComponent {
  @Input() label = 'Add new';
  @Input() onClick?: () => void;
  /** When true (default for shell), button is disabled until API is wired */
  @Input() pending = false;

  get enabled(): boolean {
    return Boolean(this.onClick) && !this.pending;
  }
}
