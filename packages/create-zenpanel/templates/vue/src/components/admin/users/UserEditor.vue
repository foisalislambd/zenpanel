<script setup lang="ts">
import { ref } from "vue";
import AdminDialog from "@/components/admin/ui/AdminDialog.vue";
import AdminFormField from "@/components/admin/ui/AdminFormField.vue";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { firstError, validateUser, type FieldErrors } from "@/lib/admin-forms";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";

export type UserInput = Pick<PortalUserRow, "name" | "email" | "country" | "phone" | "status">;

const props = defineProps<{
  user: PortalUserRow | null;
  existingEmails: string[];
  onSave: (input: UserInput) => Promise<void>;
}>();
const emit = defineEmits<{ cancel: [] }>();

const id = "user-form";
const name = ref(props.user?.name ?? "");
const email = ref(props.user?.email ?? "");
const country = ref(props.user?.country ?? "");
const phone = ref(props.user?.phone ?? "");
const status = ref<UserAccountStatus>(props.user?.status ?? "active");
const errors = ref<FieldErrors<"name" | "email" | "phone">>({});
const saving = ref(false);

const fieldClass = (key: "name" | "email" | "phone") => cn(adminInputClass, errors.value[key] && adminInputErrorClass);

async function submit() {
  const next = validateUser({ name: name.value, email: email.value, phone: phone.value }, props.existingEmails);
  errors.value = next;
  const first = firstError(["name", "email", "phone"] as const, next);
  if (first) {
    document.getElementById(`${id}-${first}`)?.focus();
    return;
  }
  saving.value = true;
  try {
    await props.onSave({
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      country: country.value.trim() || null,
      phone: phone.value.trim() || null,
      status: status.value,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <AdminDialog
    open
    :title="user ? 'Edit user' : 'Invite user'"
    :description="user ? 'Update profile details and account status.' : 'They\'ll receive an email invitation to set a password.'"
    @close="emit('cancel')"
  >
    <form :id="id" novalidate class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <AdminFormField :id="`${id}-name`" label="Full name" required :error="errors.name" class="sm:col-span-2">
        <input
          :id="`${id}-name`"
          v-model="name"
          data-autofocus
          autocomplete="off"
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="fieldDescribedBy(`${id}-name`, errors.name)"
          :class="fieldClass('name')"
        />
      </AdminFormField>
      <AdminFormField :id="`${id}-email`" label="Email" required :error="errors.email" class="sm:col-span-2">
        <input
          :id="`${id}-email`"
          v-model="email"
          type="email"
          autocomplete="off"
          placeholder="name@example.com"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="fieldDescribedBy(`${id}-email`, errors.email)"
          :class="fieldClass('email')"
        />
      </AdminFormField>
      <AdminFormField :id="`${id}-country`" label="Country">
        <input :id="`${id}-country`" v-model="country" :class="adminInputClass" />
      </AdminFormField>
      <AdminFormField :id="`${id}-phone`" label="Phone" :error="errors.phone">
        <input
          :id="`${id}-phone`"
          v-model="phone"
          type="tel"
          placeholder="+1 555 000 0000"
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="fieldDescribedBy(`${id}-phone`, errors.phone)"
          :class="fieldClass('phone')"
        />
      </AdminFormField>
      <AdminFormField :id="`${id}-status`" label="Account status" class="sm:col-span-2">
        <select :id="`${id}-status`" v-model="status" :class="adminInputClass">
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </AdminFormField>
    </form>
    <template #footer>
      <button type="button" class="admin-btn admin-btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" :form="id" :disabled="saving" class="admin-btn admin-btn-primary">
        {{ saving ? "Saving…" : user ? "Save changes" : "Send invite" }}
      </button>
    </template>
  </AdminDialog>
</template>
