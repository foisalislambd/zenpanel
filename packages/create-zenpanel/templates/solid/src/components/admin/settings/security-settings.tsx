import { SettingsCard } from "@/components/admin/settings/settings-card";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { firstError, validatePassword, type FieldErrors } from "@/lib/admin-forms";
import { useAdminToast } from "@/lib/admin-toast";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";
import { Eye, EyeOff } from "lucide-solid";
import { createSignal, Show } from "solid-js";

type Key = "current" | "next" | "confirm";

/** Password change with confirmation and strength rules. */
export function SecuritySettings() {
  const { toast } = useAdminToast();
  const [values, setValues] = createSignal<Record<Key, string>>({ current: "", next: "", confirm: "" });
  const [show, setShow] = createSignal(false);
  const [errors, setErrors] = createSignal<FieldErrors<Key>>({});

  function submit() {
    const v = values();
    const next = validatePassword(v.current, v.next, v.confirm);
    setErrors(next);
    const first = firstError(["current", "next", "confirm"] as const, next);
    if (first) {
      document.getElementById(`security-${first}`)?.focus();
      return;
    }
    setValues({ current: "", next: "", confirm: "" });
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  }

  const field = (key: Key, label: string, hint?: string) => (
    <AdminFormField id={`security-${key}`} label={label} required error={errors()[key]} hint={hint}>
      <input
        id={`security-${key}`}
        type={show() ? "text" : "password"}
        value={values()[key]}
        onInput={(e) => {
          const value = e.currentTarget.value;
          setValues((v) => ({ ...v, [key]: value }));
        }}
        autocomplete={key === "current" ? "current-password" : "new-password"}
        aria-invalid={Boolean(errors()[key])}
        aria-describedby={fieldDescribedBy(`security-${key}`, errors()[key], hint)}
        class={cn(adminInputClass, errors()[key] && adminInputErrorClass)}
      />
    </AdminFormField>
  );

  return (
    <SettingsCard
      title="Password"
      description="Choose a strong password you don't use elsewhere."
      onSubmit={submit}
      footer={
        <button type="submit" class="admin-btn admin-btn-primary">
          Update password
        </button>
      }
    >
      {field("current", "Current password")}
      <div class="grid gap-4 sm:grid-cols-2">
        {field("next", "New password", "At least 8 characters with a letter and a number.")}
        {field("confirm", "Confirm new password")}
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        onClick={() => setShow((s) => !s)}
      >
        <Show when={show()} fallback={<Eye class="h-4 w-4" aria-hidden />}>
          <EyeOff class="h-4 w-4" aria-hidden />
        </Show>
        {show() ? "Hide passwords" : "Show passwords"}
      </button>
    </SettingsCard>
  );
}
