<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";
import AdminDialog from "@/components/admin/ui/AdminDialog.vue";
import { cn } from "@/lib/cn";

/** Confirmation step for destructive actions (delete, ban). Focuses Cancel first. */
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: "danger" | "default";
  }>(),
  { confirmLabel: "Delete", cancelLabel: "Cancel", tone: "danger" },
);

const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <AdminDialog :open="open" :title="title" size="sm" @close="emit('cancel')">
    <div class="flex gap-3">
      <span
        v-if="tone === 'danger'"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15"
      >
        <AlertTriangle class="h-5 w-5" aria-hidden="true" />
      </span>
      <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        <slot />
      </div>
    </div>
    <template #footer>
      <button type="button" data-autofocus class="admin-btn admin-btn-secondary" @click="emit('cancel')">
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        :class="cn('admin-btn', tone === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary')"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </button>
    </template>
  </AdminDialog>
</template>
