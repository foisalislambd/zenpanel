import { AdminDialog } from "@/components/admin/ui/admin-dialog";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
import { firstError, validateResource, type FieldErrors } from "@/lib/admin-forms";
import { RESOURCE_STATUSES } from "@/lib/admin-resources";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { createSignal, For } from "solid-js";

export type ResourceInput = Pick<AdminResource, "title" | "status" | "meta">;

type Props = {
  item: AdminResource | null;
  label: string;
  titleLabel: string;
  metaLabel: string;
  titleIsEmail: boolean;
  statusText: (s: AdminResourceStatus) => string;
  onCancel: () => void;
  onSave: (input: ResourceInput) => Promise<void>;
};

/** Create / edit dialog for a resource row. Re-created per item (initial values only). */
export function ResourceEditor(props: Props) {
  const [title, setTitle] = createSignal(props.item?.title ?? "");
  const [status, setStatus] = createSignal<AdminResourceStatus>(props.item?.status ?? "draft");
  const [meta, setMeta] = createSignal(props.item?.meta ?? "");
  const [errors, setErrors] = createSignal<FieldErrors<"title" | "meta">>({});
  const [saving, setSaving] = createSignal(false);
  const formId = () => `resource-form-${props.label}`;

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const next = validateResource(
      { title: title(), meta: meta() },
      { titleLabel: props.titleLabel, metaLabel: props.metaLabel, titleIsEmail: props.titleIsEmail },
    );
    setErrors(next);
    const first = firstError(["title", "meta"] as const, next);
    if (first) {
      document.getElementById(`${formId()}-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await props.onSave({ title: title().trim(), status: status(), meta: meta().trim() || undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open
      title={props.item ? `Edit ${props.label}` : `New ${props.label}`}
      description={
        props.item ? "Update the details and save your changes." : `Fill in the details to create a ${props.label}.`
      }
      onClose={props.onCancel}
      footer={
        <>
          <button type="button" class="admin-btn admin-btn-secondary" onClick={() => props.onCancel()}>
            Cancel
          </button>
          <button type="submit" form={formId()} disabled={saving()} class="admin-btn admin-btn-primary">
            {saving() ? "Saving…" : props.item ? "Save changes" : `Create ${props.label}`}
          </button>
        </>
      }
    >
      <form id={formId()} novalidate class="space-y-4" onSubmit={submit}>
        <AdminFormField id={`${formId()}-title`} label={props.titleLabel} required error={errors().title}>
          <input
            id={`${formId()}-title`}
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            data-autofocus
            aria-invalid={Boolean(errors().title)}
            aria-describedby={fieldDescribedBy(`${formId()}-title`, errors().title)}
            aria-required="true"
            type={props.titleIsEmail ? "email" : "text"}
            autocomplete="off"
            class={cn(adminInputClass, errors().title && adminInputErrorClass)}
            placeholder={props.titleIsEmail ? "name@example.com" : `e.g. New ${props.label}`}
          />
        </AdminFormField>
        <AdminFormField id={`${formId()}-status`} label="Status">
          <select
            id={`${formId()}-status`}
            class={adminInputClass}
            onChange={(e) => setStatus(e.currentTarget.value as AdminResourceStatus)}
          >
            <For each={RESOURCE_STATUSES}>
              {(s) => (
                <option value={s} selected={s === status()}>
                  {props.statusText(s)}
                </option>
              )}
            </For>
          </select>
        </AdminFormField>
        <AdminFormField
          id={`${formId()}-meta`}
          label={props.metaLabel}
          error={errors().meta}
          hint="Optional - shown in the table (max 160 characters)."
        >
          <input
            id={`${formId()}-meta`}
            value={meta()}
            onInput={(e) => setMeta(e.currentTarget.value)}
            aria-invalid={Boolean(errors().meta)}
            aria-describedby={fieldDescribedBy(`${formId()}-meta`, errors().meta, "hint")}
            class={cn(adminInputClass, errors().meta && adminInputErrorClass)}
          />
        </AdminFormField>
      </form>
    </AdminDialog>
  );
}
