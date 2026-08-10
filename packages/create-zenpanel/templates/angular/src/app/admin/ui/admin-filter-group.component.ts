import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AdminFilterOption = { value: string; label: string };

@Component({
  selector: 'app-admin-filter-group',
  template: `
    <div role="group" [attr.aria-label]="ariaLabel" class="flex shrink-0 flex-wrap items-center gap-1.5">
      @for (option of options; track option.value) {
        <button
          type="button"
          (click)="valueChange.emit(option.value)"
          [class]="
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ' +
            (value === option.value
              ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5')
          "
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class AdminFilterGroupComponent {
  @Input({ required: true }) options: AdminFilterOption[] = [];
  @Input({ required: true }) value!: string;
  @Input({ required: true }) ariaLabel!: string;
  @Output() valueChange = new EventEmitter<string>();
}
