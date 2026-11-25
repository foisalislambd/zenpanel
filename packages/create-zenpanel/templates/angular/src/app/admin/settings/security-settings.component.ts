import { Component, inject, signal } from '@angular/core';
import { AdminFormFieldComponent } from '@/app/admin/ui/admin-form-field.component';
import { ToastService } from '@/app/core/toast.service';
import { firstError, validatePassword, type FieldErrors } from '@/app/lib/admin-forms';
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from '@/app/lib/admin-ui';
import { IconComponent } from '@/app/shared/icon.component';
import { SettingsCardComponent } from './settings-card.component';

type Key = 'current' | 'next' | 'confirm';

const fields: { key: Key; label: string; hint?: string }[] = [
  { key: 'current', label: 'Current password' },
  { key: 'next', label: 'New password', hint: 'At least 8 characters with a letter and a number.' },
  { key: 'confirm', label: 'Confirm new password' },
];

/** Password change with confirmation and strength rules. */
@Component({
  selector: 'app-security-settings',
  host: { class: 'block' },
  imports: [AdminFormFieldComponent, SettingsCardComponent, IconComponent],
  template: `
    <form app-settings-card novalidate title="Password" description="Choose a strong password you don't use elsewhere." (submit)="submit($event)">
      <div class="grid gap-4 sm:grid-cols-2">
        @for (f of fields; track f.key) {
          <app-admin-form-field
            [fieldId]="'security-' + f.key"
            [label]="f.label"
            [required]="true"
            [error]="errors()[f.key]"
            [hint]="f.hint"
            [class.sm:col-span-2]="f.key === 'current'"
          >
            <input
              [id]="'security-' + f.key"
              [type]="show() ? 'text' : 'password'"
              [value]="values()[f.key]"
              (input)="setValue(f.key, $any($event.target).value)"
              [attr.autocomplete]="f.key === 'current' ? 'current-password' : 'new-password'"
              [attr.aria-invalid]="!!errors()[f.key]"
              [attr.aria-describedby]="describedBy('security-' + f.key, errors()[f.key], f.hint)"
              [class]="errors()[f.key] ? inputClass + ' ' + errorClass : inputClass"
            />
          </app-admin-form-field>
        }
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        (click)="show.set(!show())"
      >
        <app-icon [name]="show() ? 'eye-off' : 'eye'" [size]="16" />
        {{ show() ? 'Hide passwords' : 'Show passwords' }}
      </button>
      <button settingsFooter type="submit" class="admin-btn admin-btn-primary">Update password</button>
    </form>
  `,
})
export class SecuritySettingsComponent {
  private readonly toaster = inject(ToastService);
  readonly fields = fields;
  readonly inputClass = adminInputClass;
  readonly errorClass = adminInputErrorClass;
  readonly describedBy = fieldDescribedBy;
  readonly values = signal<Record<Key, string>>({ current: '', next: '', confirm: '' });
  readonly show = signal(false);
  readonly errors = signal<FieldErrors<Key>>({});

  setValue(key: Key, value: string): void {
    this.values.update((v) => ({ ...v, [key]: value }));
  }

  submit(e: Event): void {
    e.preventDefault();
    const v = this.values();
    const next = validatePassword(v.current, v.next, v.confirm);
    this.errors.set(next);
    const first = firstError(['current', 'next', 'confirm'] as const, next);
    if (first) {
      document.getElementById(`security-${first}`)?.focus();
      return;
    }
    this.values.set({ current: '', next: '', confirm: '' });
    this.toaster.toast({ title: 'Password updated', description: 'Use your new password next time you sign in.' });
  }
}
