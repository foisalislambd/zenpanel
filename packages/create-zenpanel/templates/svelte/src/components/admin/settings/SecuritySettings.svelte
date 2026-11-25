<script lang="ts">
  import { Eye, EyeOff } from "lucide-svelte";
  import SettingsCard from "@/components/admin/settings/SettingsCard.svelte";
  import AdminFormField from "@/components/admin/ui/AdminFormField.svelte";
  import { firstError, validatePassword, type FieldErrors } from "@/lib/admin-forms";
  import { useAdminToast } from "@/lib/admin-toast.svelte";
  import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
  import { cn } from "@/lib/cn";

  type Key = "current" | "next" | "confirm";

  /** Password change with confirmation and strength rules. */
  const { toast } = useAdminToast();
  let values = $state<Record<Key, string>>({ current: "", next: "", confirm: "" });
  let show = $state(false);
  let errors = $state<FieldErrors<Key>>({});

  function submit() {
    const next = validatePassword(values.current, values.next, values.confirm);
    errors = next;
    const first = firstError(["current", "next", "confirm"] as const, next);
    if (first) {
      document.getElementById(`security-${first}`)?.focus();
      return;
    }
    values = { current: "", next: "", confirm: "" };
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  }
</script>

{#snippet field(key: Key, label: string, hint?: string)}
  <AdminFormField id="security-{key}" {label} required error={errors[key]} {hint}>
    <input
      id="security-{key}"
      type={show ? "text" : "password"}
      bind:value={values[key]}
      autocomplete={key === "current" ? "current-password" : "new-password"}
      aria-invalid={Boolean(errors[key])}
      aria-describedby={fieldDescribedBy(`security-${key}`, errors[key], hint)}
      class={cn(adminInputClass, errors[key] && adminInputErrorClass)}
    />
  </AdminFormField>
{/snippet}

<SettingsCard title="Password" description="Choose a strong password you don't use elsewhere." onSubmit={submit}>
  {@render field("current", "Current password")}
  <div class="grid gap-4 sm:grid-cols-2">
    {@render field("next", "New password", "At least 8 characters with a letter and a number.")}
    {@render field("confirm", "Confirm new password")}
  </div>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
    onclick={() => (show = !show)}
  >
    {#if show}
      <EyeOff class="h-4 w-4" aria-hidden={true} />
    {:else}
      <Eye class="h-4 w-4" aria-hidden={true} />
    {/if}
    {show ? "Hide passwords" : "Show passwords"}
  </button>
  {#snippet footer()}
    <button type="submit" class="admin-btn admin-btn-primary">Update password</button>
  {/snippet}
</SettingsCard>
