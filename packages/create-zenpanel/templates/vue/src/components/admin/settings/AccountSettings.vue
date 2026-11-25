<script setup lang="ts">
import { computed, ref } from "vue";
import SettingsCard from "@/components/admin/settings/SettingsCard.vue";
import AdminFormField from "@/components/admin/ui/AdminFormField.vue";
import { useAdminAuth } from "@/composables/use-admin-auth";
import { useAdminToast } from "@/composables/use-admin-toast";
import { firstError, validateAccount, type FieldErrors } from "@/lib/admin-forms";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";

/** Profile details for the signed-in administrator. */
const auth = useAdminAuth();
const { toast } = useAdminToast();
const username = ref(auth.admin?.username ?? "");
const email = ref(auth.admin?.email ?? "");
const errors = ref<FieldErrors<"username" | "email">>({});

const dirty = computed(
  () => username.value !== (auth.admin?.username ?? "") || email.value !== (auth.admin?.email ?? ""),
);

function reset() {
  username.value = auth.admin?.username ?? "";
  email.value = auth.admin?.email ?? "";
  errors.value = {};
}

function submit() {
  const next = validateAccount(username.value, email.value);
  errors.value = next;
  const first = firstError(["username", "email"] as const, next);
  if (first) {
    document.getElementById(`settings-${first}`)?.focus();
    return;
  }
  auth.updateProfile({ username: username.value.trim(), email: email.value.trim() });
  toast({ title: "Profile updated", description: "Your account details were saved." });
}
</script>

<template>
  <div class="space-y-6">
    <SettingsCard title="Profile" description="How you appear across the admin panel." form @submit="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminFormField id="settings-username" label="Username" required :error="errors.username">
          <input
            id="settings-username"
            v-model="username"
            autocomplete="username"
            :aria-invalid="Boolean(errors.username)"
            :aria-describedby="fieldDescribedBy('settings-username', errors.username)"
            :class="cn(adminInputClass, errors.username && adminInputErrorClass)"
          />
        </AdminFormField>
        <AdminFormField id="settings-email" label="Email" required :error="errors.email">
          <input
            id="settings-email"
            v-model="email"
            type="email"
            autocomplete="email"
            :aria-invalid="Boolean(errors.email)"
            :aria-describedby="fieldDescribedBy('settings-email', errors.email)"
            :class="cn(adminInputClass, errors.email && adminInputErrorClass)"
          />
        </AdminFormField>
      </div>
      <dl class="grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 dark:border-gray-800">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 capitalize dark:text-white">{{ auth.admin?.role ?? "-" }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {{ auth.admin?.lastLoginAt ? new Date(auth.admin.lastLoginAt).toLocaleString() : "-" }}
          </dd>
        </div>
      </dl>
      <template #footer>
        <button type="button" class="admin-btn admin-btn-secondary" :disabled="!dirty" @click="reset">Reset</button>
        <button type="submit" class="admin-btn admin-btn-primary" :disabled="!dirty">Save changes</button>
      </template>
    </SettingsCard>
  </div>
</template>
