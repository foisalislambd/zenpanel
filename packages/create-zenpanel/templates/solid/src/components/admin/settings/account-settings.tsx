import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { SettingsCard } from "@/components/admin/settings/settings-card";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { firstError, validateAccount, type FieldErrors } from "@/lib/admin-forms";
import { useAdminToast } from "@/lib/admin-toast";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { createSignal } from "solid-js";

/** Profile details for the signed-in administrator. */
export function AccountSettings() {
  const { admin, updateProfile } = useAdminAuth();
  const { toast } = useAdminToast();
  const [username, setUsername] = createSignal(admin()?.username ?? "");
  const [email, setEmail] = createSignal(admin()?.email ?? "");
  const [errors, setErrors] = createSignal<FieldErrors<"username" | "email">>({});

  const dirty = () => username() !== (admin()?.username ?? "") || email() !== (admin()?.email ?? "");

  function reset() {
    setUsername(admin()?.username ?? "");
    setEmail(admin()?.email ?? "");
    setErrors({});
  }

  function submit() {
    const next = validateAccount(username(), email());
    setErrors(next);
    const first = firstError(["username", "email"] as const, next);
    if (first) {
      document.getElementById(`settings-${first}`)?.focus();
      return;
    }
    updateProfile({ username: username().trim(), email: email().trim() });
    toast({ title: "Profile updated", description: "Your account details were saved." });
  }

  return (
    <div class="space-y-6">
      <SettingsCard
        title="Profile"
        description="How you appear across the admin panel."
        onSubmit={submit}
        footer={
          <>
            <button type="button" class="admin-btn admin-btn-secondary" disabled={!dirty()} onClick={reset}>
              Reset
            </button>
            <button type="submit" class="admin-btn admin-btn-primary" disabled={!dirty()}>
              Save changes
            </button>
          </>
        }
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminFormField id="settings-username" label="Username" required error={errors().username}>
            <input
              id="settings-username"
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
              autocomplete="username"
              aria-invalid={Boolean(errors().username)}
              aria-describedby={fieldDescribedBy("settings-username", errors().username)}
              class={cn(adminInputClass, errors().username && adminInputErrorClass)}
            />
          </AdminFormField>
          <AdminFormField id="settings-email" label="Email" required error={errors().email}>
            <input
              id="settings-email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              autocomplete="email"
              aria-invalid={Boolean(errors().email)}
              aria-describedby={fieldDescribedBy("settings-email", errors().email)}
              class={cn(adminInputClass, errors().email && adminInputErrorClass)}
            />
          </AdminFormField>
        </div>
        <dl class="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
          <div>
            <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
            <dd class="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">{admin()?.role ?? "-"}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
            <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {admin()?.lastLoginAt ? new Date(admin()!.lastLoginAt!).toLocaleString() : "-"}
            </dd>
          </div>
        </dl>
      </SettingsCard>
    </div>
  );
}
