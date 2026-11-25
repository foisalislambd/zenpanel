import { Component, input } from '@angular/core';

/**
 * Label + projected control + hint/error. Give the control
 * `[attr.aria-describedby]="fieldDescribedBy(id, error, hint)"`.
 */
@Component({
  selector: 'app-admin-form-field',
  host: { class: 'block space-y-1.5' },
  template: `
    <label [attr.for]="fieldId()" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label() }}
      @if (required()) {
        <span class="ml-0.5 text-error-500" aria-hidden="true">*</span>
      }
    </label>
    <ng-content />
    @if (error()) {
      <p [id]="fieldId() + '-error'" class="text-sm text-error-500">{{ error() }}</p>
    } @else if (hint()) {
      <p [id]="fieldId() + '-hint'" class="text-xs text-gray-500 dark:text-gray-400">{{ hint() }}</p>
    }
  `,
})
export class AdminFormFieldComponent {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly error = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly required = input(false);
}
