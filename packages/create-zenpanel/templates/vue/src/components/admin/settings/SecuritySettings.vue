<script setup lang="ts">
import { reactive, ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import SettingsCard from "@/components/admin/settings/SettingsCard.vue";
import AdminFormField from "@/components/admin/ui/AdminFormField.vue";
import { useAdminToast } from "@/composables/use-admin-toast";
import { firstError, validatePassword, type FieldErrors } from "@/lib/admin-forms";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";

type Key = "current" | "next" | "confirm";

/** Password change with confirmation and strength rules. */
const { toast } = useAdminToast();
const values = reactive<Record<Key, string>>({ current: "", next: "", confirm: "" });
const show = ref(false);
const errors = ref<FieldErrors<Key>>({});

const fields: { key: Key; label: string; hint?: string }[] = [
  { key: "current", label: "Current password" },
  { key: "next", label: "New password", hint: "At least 8 characters with a letter and a number." },
  { key: "confirm", label: "Confirm new password" },
];

function submit() {
  const next = validatePassword(values.current, values.next, values.confirm);
  errors.value = next;
  const first = firstError(["current", "next", "confirm"] as const, next);
  if (first) {
    document.getElementById(`security-${first}`)?.focus();
    return;
  }
  values.current = "";
  values.next = "";
  values.confirm = "";
  toast({ title: "Password updated", description: "Use your new password next time you sign in." });
}
</script>

<template>
  <SettingsCard title="Password" description="Choose a strong password you don't use elsewhere." form @submit="submit">
    <template v-for="(group, gi) in [[fields[0]], [fields[1], fields[2]]]" :key="gi">
      <div :class="gi === 1 ? 'grid gap-4 sm:grid-cols-2' : ''">
        <AdminFormField
          v-for="f in group"
          :id="`security-${f.key}`"
          :key="f.key"
          :label="f.label"
          required
          :error="errors[f.key]"
          :hint="f.hint"
        >
          <input
            :id="`security-${f.key}`"
            v-model="values[f.key]"
            :type="show ? 'text' : 'password'"
            :autocomplete="f.key === 'current' ? 'current-password' : 'new-password'"
            :aria-invalid="Boolean(errors[f.key])"
            :aria-describedby="fieldDescribedBy(`security-${f.key}`, errors[f.key], f.hint)"
            :class="cn(adminInputClass, errors[f.key] && adminInputErrorClass)"
          />
        </AdminFormField>
      </div>
    </template>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
      @click="show = !show"
    >
      <EyeOff v-if="show" class="h-4 w-4" aria-hidden="true" />
      <Eye v-else class="h-4 w-4" aria-hidden="true" />
      {{ show ? "Hide passwords" : "Show passwords" }}
    </button>
    <template #footer>
      <button type="submit" class="admin-btn admin-btn-primary">Update password</button>
    </template>
  </SettingsCard>
</template>
