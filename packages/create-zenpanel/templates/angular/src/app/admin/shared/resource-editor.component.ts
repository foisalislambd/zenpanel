import { Component, OnInit, input, output, signal } from '@angular/core';
import { AdminDialogComponent } from '@/app/admin/ui/admin-dialog.component';
import { AdminFormFieldComponent } from '@/app/admin/ui/admin-form-field.component';
import type { AdminResource, AdminResourceStatus } from '@/app/lib/admin-data/resources';
import { firstError, validateResource, type FieldErrors } from '@/app/lib/admin-forms';
import { RESOURCE_STATUSES } from '@/app/lib/admin-resources';
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from '@/app/lib/admin-ui';

export type ResourceInput = Pick<AdminResource, 'title' | 'status' | 'meta'>;

/** Create / edit dialog for a resource row. Re-created per item (initial values only). */
@Component({
  selector: 'app-resource-editor',
  imports: [AdminDialogComponent, AdminFormFieldComponent],
  template: `
    <app-admin-dialog
      [open]="true"
      [title]="item() ? 'Edit ' + label() : 'New ' + label()"
      [description]="
        item() ? 'Update the details and save your changes.' : 'Fill in the details to create a ' + label() + '.'
      "
      (closed)="cancelled.emit()"
    >
      <form [id]="formId()" novalidate class="space-y-4" (submit)="submit($event)">
        <app-admin-form-field [fieldId]="formId() + '-title'" [label]="titleLabel()" [required]="true" [error]="errors().title">
          <input
            [id]="formId() + '-title'"
            [value]="title()"
            (input)="title.set($any($event.target).value)"
            data-autofocus
            [attr.aria-invalid]="!!errors().title"
            [attr.aria-describedby]="describedBy(formId() + '-title', errors().title)"
            aria-required="true"
            [type]="titleIsEmail() ? 'email' : 'text'"
            autocomplete="off"
            [class]="inputClass(errors().title)"
            [placeholder]="titleIsEmail() ? 'name@example.com' : 'e.g. New ' + label()"
          />
        </app-admin-form-field>
        <app-admin-form-field [fieldId]="formId() + '-status'" label="Status">
          <select
            [id]="formId() + '-status'"
            [class]="inputClass()"
            (change)="status.set($any($event.target).value)"
          >
            @for (s of statuses; track s) {
              <option [value]="s" [selected]="s === status()">{{ statusText()(s) }}</option>
            }
          </select>
        </app-admin-form-field>
        <app-admin-form-field
          [fieldId]="formId() + '-meta'"
          [label]="metaLabel()"
          [error]="errors().meta"
          hint="Optional - shown in the table (max 160 characters)."
        >
          <input
            [id]="formId() + '-meta'"
            [value]="meta()"
            (input)="meta.set($any($event.target).value)"
            [attr.aria-invalid]="!!errors().meta"
            [attr.aria-describedby]="describedBy(formId() + '-meta', errors().meta, 'hint')"
            [class]="inputClass(errors().meta)"
          />
        </app-admin-form-field>
      </form>
      <button dialogFooter type="button" class="admin-btn admin-btn-secondary" (click)="cancelled.emit()">
        Cancel
      </button>
      <button dialogFooter type="submit" [attr.form]="formId()" [disabled]="saving()" class="admin-btn admin-btn-primary">
        {{ saving() ? 'Saving…' : item() ? 'Save changes' : 'Create ' + label() }}
      </button>
    </app-admin-dialog>
  `,
})
export class ResourceEditorComponent implements OnInit {
  readonly item = input<AdminResource | null>(null);
  readonly label = input.required<string>();
  readonly titleLabel = input('Title');
  readonly metaLabel = input('Details');
  readonly titleIsEmail = input(false);
  readonly statusText = input.required<(s: AdminResourceStatus) => string>();
  readonly save = input.required<(input: ResourceInput) => Promise<void>>();
  readonly cancelled = output<void>();

  readonly statuses = RESOURCE_STATUSES;
  readonly title = signal('');
  readonly status = signal<AdminResourceStatus>('draft');
  readonly meta = signal('');
  readonly errors = signal<FieldErrors<'title' | 'meta'>>({});
  readonly saving = signal(false);
  readonly describedBy = fieldDescribedBy;

  formId(): string {
    return `resource-form-${this.label()}`;
  }

  ngOnInit(): void {
    const item = this.item();
    this.title.set(item?.title ?? '');
    this.status.set(item?.status ?? 'draft');
    this.meta.set(item?.meta ?? '');
  }

  inputClass(error?: string): string {
    return error ? `${adminInputClass} ${adminInputErrorClass}` : adminInputClass;
  }

  async submit(e: Event): Promise<void> {
    e.preventDefault();
    const next = validateResource(
      { title: this.title(), meta: this.meta() },
      { titleLabel: this.titleLabel(), metaLabel: this.metaLabel(), titleIsEmail: this.titleIsEmail() },
    );
    this.errors.set(next);
    const first = firstError(['title', 'meta'] as const, next);
    if (first) {
      document.getElementById(`${this.formId()}-${first}`)?.focus();
      return;
    }
    this.saving.set(true);
    try {
      await this.save()({ title: this.title().trim(), status: this.status(), meta: this.meta().trim() || undefined });
    } finally {
      this.saving.set(false);
    }
  }
}
