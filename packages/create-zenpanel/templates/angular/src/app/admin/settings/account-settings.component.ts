import { Component, computed, inject, signal } from '@angular/core';
import { AdminFormFieldComponent } from '@/app/admin/ui/admin-form-field.component';
import { AuthService } from '@/app/core/auth.service';
import { ToastService } from '@/app/core/toast.service';
import { firstError, validateAccount, type FieldErrors } from '@/app/lib/admin-forms';
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from '@/app/lib/admin-ui';
import { SettingsCardComponent } from './settings-card.component';

/** Profile details for the signed-in administrator. */
@Component({
  selector: 'app-account-settings',
  host: { class: 'block space-y-6' },
  imports: [AdminFormFieldComponent, SettingsCardComponent],
  template: `
    <form app-settings-card novalidate title="Profile" description="How you appear across the admin panel." (submit)="submit($event)">
      <div class="grid gap-4 sm:grid-cols-2">
        <app-admin-form-field fieldId="settings-username" label="Username" [required]="true" [error]="errors().username">
          <input
            id="settings-username"
            [value]="username()"
            (input)="username.set($any($event.target).value)"
            autocomplete="username"
            [attr.aria-invalid]="!!errors().username"
            [attr.aria-describedby]="describedBy('settings-username', errors().username)"
            [class]="cls(errors().username)"
          />
        </app-admin-form-field>
        <app-admin-form-field fieldId="settings-email" label="Email" [required]="true" [error]="errors().email">
          <input
            id="settings-email"
            type="email"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            autocomplete="email"
            [attr.aria-invalid]="!!errors().email"
            [attr.aria-describedby]="describedBy('settings-email', errors().email)"
            [class]="cls(errors().email)"
          />
        </app-admin-form-field>
      </div>
      <dl class="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">{{ auth.admin()?.role ?? '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ lastLogin() }}</dd>
        </div>
      </dl>
      <button settingsFooter type="button" class="admin-btn admin-btn-secondary" [disabled]="!dirty()" (click)="reset()">Reset</button>
      <button settingsFooter type="submit" class="admin-btn admin-btn-primary" [disabled]="!dirty()">Save changes</button>
    </form>
  `,
})
export class AccountSettingsComponent {
  readonly auth = inject(AuthService);
  private readonly toaster = inject(ToastService);
  readonly describedBy = fieldDescribedBy;

  readonly username = signal(this.auth.admin()?.username ?? '');
  readonly email = signal(this.auth.admin()?.email ?? '');
  readonly errors = signal<FieldErrors<'username' | 'email'>>({});
  readonly dirty = computed(
    () => this.username() !== (this.auth.admin()?.username ?? '') || this.email() !== (this.auth.admin()?.email ?? ''),
  );
  readonly lastLogin = computed(() => {
    const at = this.auth.admin()?.lastLoginAt;
    return at ? new Date(at).toLocaleString() : '-';
  });

  cls(error?: string): string {
    return error ? `${adminInputClass} ${adminInputErrorClass}` : adminInputClass;
  }

  reset(): void {
    this.username.set(this.auth.admin()?.username ?? '');
    this.email.set(this.auth.admin()?.email ?? '');
    this.errors.set({});
  }

  submit(e: Event): void {
    e.preventDefault();
    const next = validateAccount(this.username(), this.email());
    this.errors.set(next);
    const first = firstError(['username', 'email'] as const, next);
    if (first) {
      document.getElementById(`settings-${first}`)?.focus();
      return;
    }
    this.auth.updateProfile({ username: this.username().trim(), email: this.email().trim() });
    this.toaster.toast({ title: 'Profile updated', description: 'Your account details were saved.' });
  }
}
