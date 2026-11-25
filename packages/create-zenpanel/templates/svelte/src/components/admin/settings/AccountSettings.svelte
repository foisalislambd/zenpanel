<script lang="ts">
  import SettingsCard from "@/components/admin/settings/SettingsCard.svelte";
  import AdminFormField from "@/components/admin/ui/AdminFormField.svelte";
  import { useAdminAuth } from "@/context/admin-auth-context.svelte";
  import { firstError, validateAccount, type FieldErrors } from "@/lib/admin-forms";
  import { useAdminToast } from "@/lib/admin-toast.svelte";
  import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
  import { cn } from "@/lib/cn";

  /** Profile details for the signed-in administrator. */
  const auth = useAdminAuth();
  const { toast } = useAdminToast();
  let username = $state(auth.admin?.username ?? "");
  let email = $state(auth.admin?.email ?? "");
  let errors = $state<FieldErrors<"username" | "email">>({});

  const dirty = $derived(username !== (auth.admin?.username ?? "") || email !== (auth.admin?.email ?? ""));

  function reset() {
    username = auth.admin?.username ?? "";
    email = auth.admin?.email ?? "";
    errors = {};
  }

  function submit() {
    const next = validateAccount(username, email);
    errors = next;
    const first = firstError(["username", "email"] as const, next);
    if (first) {
      document.getElementById(`settings-${first}`)?.focus();
      return;
    }
    auth.updateProfile({ username: username.trim(), email: email.trim() });
    toast({ title: "Profile updated", description: "Your account details were saved." });
  }
</script>

<div class="space-y-6">
  <SettingsCard title="Profile" description="How you appear across the admin panel." onSubmit={submit}>
    <div class="grid gap-4 sm:grid-cols-2">
      <AdminFormField id="settings-username" label="Username" required error={errors.username}>
        <input
          id="settings-username"
          bind:value={username}
          autocomplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={fieldDescribedBy("settings-username", errors.username)}
          class={cn(adminInputClass, errors.username && adminInputErrorClass)}
        />
      </AdminFormField>
      <AdminFormField id="settings-email" label="Email" required error={errors.email}>
        <input
          id="settings-email"
          type="email"
          bind:value={email}
          autocomplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={fieldDescribedBy("settings-email", errors.email)}
          class={cn(adminInputClass, errors.email && adminInputErrorClass)}
        />
      </AdminFormField>
    </div>
    <dl class="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
        <dd class="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">{auth.admin?.role ?? "-"}</dd>
      </div>
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
        <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {auth.admin?.lastLoginAt ? new Date(auth.admin.lastLoginAt).toLocaleString() : "-"}
        </dd>
      </div>
    </dl>
    {#snippet footer()}
      <button type="button" class="admin-btn admin-btn-secondary" disabled={!dirty} onclick={reset}>Reset</button>
      <button type="submit" class="admin-btn admin-btn-primary" disabled={!dirty}>Save changes</button>
    {/snippet}
  </SettingsCard>
</div>
