<script setup lang="ts">
import { ref } from "vue";
import AdminDialog from "@/components/admin/ui/AdminDialog.vue";
import AdminFormField from "@/components/admin/ui/AdminFormField.vue";
import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
import { firstError, validateResource, type FieldErrors } from "@/lib/admin-forms";
import { RESOURCE_STATUSES } from "@/lib/admin-resources";
import { adminInputClass, adminInputErrorClass, fieldDescribedBy } from "@/lib/admin-ui";
import { cn } from "@/lib/cn";

export type ResourceInput = Pick<AdminResource, "title" | "status" | "meta">;

const props = defineProps<{
  item: AdminResource | null;
  label: string;
  titleLabel: string;
  metaLabel: string;
  titleIsEmail: boolean;
  statusText: (s: AdminResourceStatus) => string;
  onSave: (input: ResourceInput) => Promise<void>;
}>();
const emit = defineEmits<{ cancel: [] }>();

const titleValue = ref(props.item?.title ?? "");
const status = ref<AdminResourceStatus>(props.item?.status ?? "draft");
const meta = ref(props.item?.meta ?? "");
const errors = ref<FieldErrors<"title" | "meta">>({});
const saving = ref(false);
const formId = `resource-form-${props.label}`;

async function submit() {
  const next = validateResource(
    { title: titleValue.value, meta: meta.value },
    { titleLabel: props.titleLabel, metaLabel: props.metaLabel, titleIsEmail: props.titleIsEmail },
  );
  errors.value = next;
  const first = firstError(["title", "meta"] as const, next);
  if (first) {
    document.getElementById(`${formId}-${first}`)?.focus();
    return;
  }
  saving.value = true;
  try {
    await props.onSave({ title: titleValue.value.trim(), status: status.value, meta: meta.value.trim() || undefined });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <AdminDialog
    open
    :title="item ? `Edit ${label}` : `New ${label}`"
    :description="item ? 'Update the details and save your changes.' : `Fill in the details to create a ${label}.`"
    @close="emit('cancel')"
  >
    <form :id="formId" novalidate class="space-y-4" @submit.prevent="submit">
      <AdminFormField :id="`${formId}-title`" :label="titleLabel" required :error="errors.title">
        <input
          :id="`${formId}-title`"
          v-model="titleValue"
          data-autofocus
          :aria-invalid="Boolean(errors.title)"
          :aria-describedby="fieldDescribedBy(`${formId}-title`, errors.title)"
          aria-required="true"
          :type="titleIsEmail ? 'email' : 'text'"
          autocomplete="off"
          :class="cn(adminInputClass, errors.title && adminInputErrorClass)"
          :placeholder="titleIsEmail ? 'name@example.com' : `e.g. New ${label}`"
        />
      </AdminFormField>
      <AdminFormField :id="`${formId}-status`" label="Status">
        <select :id="`${formId}-status`" v-model="status" :class="adminInputClass">
          <option v-for="s in RESOURCE_STATUSES" :key="s" :value="s">{{ statusText(s) }}</option>
        </select>
      </AdminFormField>
      <AdminFormField
        :id="`${formId}-meta`"
        :label="metaLabel"
        :error="errors.meta"
        hint="Optional - shown in the table (max 160 characters)."
      >
        <input
          :id="`${formId}-meta`"
          v-model="meta"
          :aria-invalid="Boolean(errors.meta)"
          :aria-describedby="fieldDescribedBy(`${formId}-meta`, errors.meta, 'hint')"
          :class="cn(adminInputClass, errors.meta && adminInputErrorClass)"
        />
      </AdminFormField>
    </form>
    <template #footer>
      <button type="button" class="admin-btn admin-btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" :form="formId" :disabled="saving" class="admin-btn admin-btn-primary">
        {{ saving ? "Saving…" : item ? "Save changes" : `Create ${label}` }}
      </button>
    </template>
  </AdminDialog>
</template>
