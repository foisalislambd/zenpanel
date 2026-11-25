<script lang="ts">
  import AdminDialog from "@/components/admin/ui/AdminDialog.svelte";
  import AdminFormField from "@/components/admin/ui/AdminFormField.svelte";
  import type { UserInput } from "@/components/admin/users/user-types";
  import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
  import { firstError, validateUser, type FieldErrors } from "@/lib/admin-forms";
  import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
  import { cn } from "@/lib/cn";

  type Props = {
    user: PortalUserRow | null;
    existingEmails: string[];
    onCancel: () => void;
    onSave: (input: UserInput) => Promise<void>;
  };
  let { user, existingEmails, onCancel, onSave }: Props = $props();

  const id = "user-form";
  // Initial values only - the editor is re-created per user.
  // svelte-ignore state_referenced_locally
  let name = $state(user?.name ?? "");
  // svelte-ignore state_referenced_locally
  let email = $state(user?.email ?? "");
  // svelte-ignore state_referenced_locally
  let country = $state(user?.country ?? "");
  // svelte-ignore state_referenced_locally
  let phone = $state(user?.phone ?? "");
  // svelte-ignore state_referenced_locally
  let status = $state<UserAccountStatus>(user?.status ?? "active");
  let errors = $state<FieldErrors<"name" | "email" | "phone">>({});
  let saving = $state(false);

  const fieldClass = (key: "name" | "email" | "phone") => cn(adminInputClass, errors[key] && adminInputErrorClass);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const next = validateUser({ name, email, phone }, existingEmails);
    errors = next;
    const first = firstError(["name", "email", "phone"] as const, next);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    saving = true;
    try {
      await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        country: country.trim() || null,
        phone: phone.trim() || null,
        status,
      });
    } finally {
      saving = false;
    }
  }
</script>

<AdminDialog
  open
  title={user ? "Edit user" : "Invite user"}
  description={user ? "Update profile details and account status." : "They'll receive an email invitation to set a password."}
  onClose={onCancel}
>
  <form {id} novalidate class="grid gap-4 sm:grid-cols-2" onsubmit={submit}>
    <AdminFormField id="{id}-name" label="Full name" required error={errors.name} class="sm:col-span-2">
      <input
        id="{id}-name"
        bind:value={name}
        data-autofocus
        autocomplete="off"
        aria-invalid={Boolean(errors.name)}
        aria-describedby={fieldDescribedBy(`${id}-name`, errors.name)}
        class={fieldClass("name")}
      />
    </AdminFormField>
    <AdminFormField id="{id}-email" label="Email" required error={errors.email} class="sm:col-span-2">
      <input
        id="{id}-email"
        bind:value={email}
        type="email"
        autocomplete="off"
        placeholder="name@example.com"
        aria-invalid={Boolean(errors.email)}
        aria-describedby={fieldDescribedBy(`${id}-email`, errors.email)}
        class={fieldClass("email")}
      />
    </AdminFormField>
    <AdminFormField id="{id}-country" label="Country">
      <input id="{id}-country" bind:value={country} class={adminInputClass} />
    </AdminFormField>
    <AdminFormField id="{id}-phone" label="Phone" error={errors.phone}>
      <input
        id="{id}-phone"
        bind:value={phone}
        type="tel"
        placeholder="+1 555 000 0000"
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={fieldDescribedBy(`${id}-phone`, errors.phone)}
        class={fieldClass("phone")}
      />
    </AdminFormField>
    <AdminFormField id="{id}-status" label="Account status" class="sm:col-span-2">
      <select id="{id}-status" bind:value={status} class={adminInputClass}>
        <option value="active">Active</option>
        <option value="banned">Banned</option>
      </select>
    </AdminFormField>
  </form>
  {#snippet footer()}
    <button type="button" class="admin-btn admin-btn-secondary" onclick={onCancel}>Cancel</button>
    <button type="submit" form={id} disabled={saving} class="admin-btn admin-btn-primary">
      {saving ? "Saving…" : user ? "Save changes" : "Send invite"}
    </button>
  {/snippet}
</AdminDialog>
