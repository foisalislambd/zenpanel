import { Component, input, output } from '@angular/core';

export type AdminFilterOption = { value: string; label: string; count?: number };

/** Segmented filter control (single choice, `aria-pressed` buttons). */
@Component({
  selector: 'app-admin-filter-group',
  template: `
    <div role="group" [attr.aria-label]="ariaLabel()" class="flex min-w-0 flex-wrap items-center gap-1.5">
      @if (label()) {
        <span class="mr-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{{
          label()
        }}</span>
      }
      @for (option of options(); track option.value) {
        <button
          type="button"
          [attr.aria-pressed]="value() === option.value"
          (click)="valueChange.emit(option.value)"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          [class]="
            value() === option.value
              ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5'
          "
        >
          {{ option.label }}
          @if (option.count !== undefined) {
            <span
              class="rounded-full px-1.5 text-xs tabular-nums"
              [class]="
                value() === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
              "
              >{{ option.count }}</span
            >
          }
        </button>
      }
    </div>
  `,
})
export class AdminFilterGroupComponent {
  readonly options = input.required<AdminFilterOption[]>();
  readonly value = input.required<string>();
  readonly ariaLabel = input.required<string>();
  /** Visible label (e.g. "Status") - helps when several groups sit side by side. */
  readonly label = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}
