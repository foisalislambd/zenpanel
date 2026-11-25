<script lang="ts">
  import AdminDialog from "@/components/admin/ui/AdminDialog.svelte";
  import AdminFormField from "@/components/admin/ui/AdminFormField.svelte";
  import type { ResourceInput } from "@/components/admin/shared/resource-types";
  import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
  import { firstError, validateResource, type FieldErrors } from "@/lib/admin-forms";
  import { RESOURCE_STATUSES } from "@/lib/admin-resources";
  import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
  import { cn } from "@/lib/cn";

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

  let { item, label, titleLabel, metaLabel, titleIsEmail, statusText, onCancel, onSave }: Props = $props();

  // Initial values only - the editor is re-created per item.
  // svelte-ignore state_referenced_locally
  let titleValue = $state(item?.title ?? "");
  // svelte-ignore state_referenced_locally
  let status = $state<AdminResourceStatus>(item?.status ?? "draft");
  // svelte-ignore state_referenced_locally
  let meta = $state(item?.meta ?? "");
  let errors = $state<FieldErrors<"title" | "meta">>({});
  let saving = $state(false);
  const formId = $derived(`resource-form-${label}`);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const next = validateResource({ title: titleValue, meta }, { titleLabel, metaLabel, titleIsEmail });
    errors = next;
    const first = firstError(["title", "meta"] as const, next);
    if (first) {
      document.getElementById(`${formId}-${first}`)?.focus();
      return;
    }
    saving = true;
    try {
      await onSave({ title: titleValue.trim(), status, meta: meta.trim() || undefined });
    } finally {
      saving = false;
    }
  }
</script>

<AdminDialog
  open
  title={item ? `Edit ${label}` : `New ${label}`}
  description={item ? "Update the details and save your changes." : `Fill in the details to create a ${label}.`}
  onClose={onCancel}
>
  <form id={formId} novalidate class="space-y-4" onsubmit={submit}>
    <AdminFormField id="{formId}-title" label={titleLabel} required error={errors.title}>
      <input
        id="{formId}-title"
        bind:value={titleValue}
        data-autofocus
        aria-invalid={Boolean(errors.title)}
        aria-describedby={fieldDescribedBy(`${formId}-title`, errors.title)}
        aria-required="true"
        type={titleIsEmail ? "email" : "text"}
        autocomplete="off"
        class={cn(adminInputClass, errors.title && adminInputErrorClass)}
        placeholder={titleIsEmail ? "name@example.com" : `e.g. New ${label}`}
      />
    </AdminFormField>
    <AdminFormField id="{formId}-status" label="Status">
      <select id="{formId}-status" bind:value={status} class={adminInputClass}>
        {#each RESOURCE_STATUSES as s (s)}
          <option value={s}>{statusText(s)}</option>
        {/each}
      </select>
    </AdminFormField>
    <AdminFormField
      id="{formId}-meta"
      label={metaLabel}
      error={errors.meta}
      hint="Optional - shown in the table (max 160 characters)."
    >
      <input
        id="{formId}-meta"
        bind:value={meta}
        aria-invalid={Boolean(errors.meta)}
        aria-describedby={fieldDescribedBy(`${formId}-meta`, errors.meta, "hint")}
        class={cn(adminInputClass, errors.meta && adminInputErrorClass)}
      />
    </AdminFormField>
  </form>
  {#snippet footer()}
    <button type="button" class="admin-btn admin-btn-secondary" onclick={onCancel}>Cancel</button>
    <button type="submit" form={formId} disabled={saving} class="admin-btn admin-btn-primary">
      {saving ? "Saving…" : item ? "Save changes" : `Create ${label}`}
    </button>
  {/snippet}
</AdminDialog>
