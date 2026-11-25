import { Component, OnInit, input, output, signal } from '@angular/core';
import { AdminDialogComponent } from '@/app/admin/ui/admin-dialog.component';
import { AdminFormFieldComponent } from '@/app/admin/ui/admin-form-field.component';
import type { PortalUserRow, UserAccountStatus } from '@/app/lib/admin-api';
import { firstError, validateUser, type FieldErrors } from '@/app/lib/admin-forms';
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from '@/app/lib/admin-ui';

export type UserInput = Pick<PortalUserRow, 'name' | 'email' | 'country' | 'phone' | 'status'>;
type Key = 'name' | 'email' | 'phone';

const id = 'user-form';

/** Invite / edit user dialog. Re-created per user (initial values only). */
@Component({
  selector: 'app-user-editor',
  imports: [AdminDialogComponent, AdminFormFieldComponent],
  template: `
    <app-admin-dialog
      [open]="true"
      [title]="user() ? 'Edit user' : 'Invite user'"
      [description]="
        user() ? 'Update profile details and account status.' : 'They\\'ll receive an email invitation to set a password.'
      "
      (closed)="cancelled.emit()"
    >
      <form [id]="id" novalidate class="grid gap-4 sm:grid-cols-2" (submit)="submit($event)">
        <app-admin-form-field [fieldId]="id + '-name'" label="Full name" [required]="true" [error]="errors().name" class="sm:col-span-2">
          <input
            [id]="id + '-name'"
            [value]="name()"
            (input)="name.set($any($event.target).value)"
            data-autofocus
            autocomplete="off"
            [attr.aria-invalid]="!!errors().name"
            [attr.aria-describedby]="describedBy(id + '-name', errors().name)"
            [class]="fieldClass('name')"
          />
        </app-admin-form-field>
        <app-admin-form-field [fieldId]="id + '-email'" label="Email" [required]="true" [error]="errors().email" class="sm:col-span-2">
          <input
            [id]="id + '-email'"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            type="email"
            autocomplete="off"
            placeholder="name@example.com"
            [attr.aria-invalid]="!!errors().email"
            [attr.aria-describedby]="describedBy(id + '-email', errors().email)"
            [class]="fieldClass('email')"
          />
        </app-admin-form-field>
        <app-admin-form-field [fieldId]="id + '-country'" label="Country">
          <input
            [id]="id + '-country'"
            [value]="country()"
            (input)="country.set($any($event.target).value)"
            [class]="inputClass"
          />
        </app-admin-form-field>
        <app-admin-form-field [fieldId]="id + '-phone'" label="Phone" [error]="errors().phone">
          <input
            [id]="id + '-phone'"
            [value]="phone()"
            (input)="phone.set($any($event.target).value)"
            type="tel"
            placeholder="+1 555 000 0000"
            [attr.aria-invalid]="!!errors().phone"
            [attr.aria-describedby]="describedBy(id + '-phone', errors().phone)"
            [class]="fieldClass('phone')"
          />
        </app-admin-form-field>
        <app-admin-form-field [fieldId]="id + '-status'" label="Account status" class="sm:col-span-2">
          <select [id]="id + '-status'" [class]="inputClass" (change)="status.set($any($event.target).value)">
            <option value="active" [selected]="status() === 'active'">Active</option>
            <option value="banned" [selected]="status() === 'banned'">Banned</option>
          </select>
        </app-admin-form-field>
      </form>
      <button dialogFooter type="button" class="admin-btn admin-btn-secondary" (click)="cancelled.emit()">Cancel</button>
      <button dialogFooter type="submit" [attr.form]="id" [disabled]="saving()" class="admin-btn admin-btn-primary">
        {{ saving() ? 'Saving…' : user() ? 'Save changes' : 'Send invite' }}
      </button>
    </app-admin-dialog>
  `,
})
export class UserEditorComponent implements OnInit {
  readonly user = input<PortalUserRow | null>(null);
  readonly existingEmails = input<string[]>([]);
  readonly save = input.required<(input: UserInput) => Promise<void>>();
  readonly cancelled = output<void>();

  readonly id = id;
  readonly inputClass = adminInputClass;
  readonly describedBy = fieldDescribedBy;
  readonly name = signal('');
  readonly email = signal('');
  readonly country = signal('');
  readonly phone = signal('');
  readonly status = signal<UserAccountStatus>('active');
  readonly errors = signal<FieldErrors<Key>>({});
  readonly saving = signal(false);

  ngOnInit(): void {
    const user = this.user();
    this.name.set(user?.name ?? '');
    this.email.set(user?.email ?? '');
    this.country.set(user?.country ?? '');
    this.phone.set(user?.phone ?? '');
    this.status.set(user?.status ?? 'active');
  }

  fieldClass(key: Key): string {
    return this.errors()[key] ? `${adminInputClass} ${adminInputErrorClass}` : adminInputClass;
  }

  async submit(e: Event): Promise<void> {
    e.preventDefault();
    const next = validateUser({ name: this.name(), email: this.email(), phone: this.phone() }, this.existingEmails());
    this.errors.set(next);
    const first = firstError(['name', 'email', 'phone'] as const, next);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    this.saving.set(true);
    try {
      await this.save()({
        name: this.name().trim(),
        email: this.email().trim().toLowerCase(),
        country: this.country().trim() || null,
        phone: this.phone().trim() || null,
        status: this.status(),
      });
    } finally {
      this.saving.set(false);
    }
  }
}
