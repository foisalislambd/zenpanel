<script setup lang="ts">
import { AlertTriangle, RotateCw } from "lucide-vue-next";

/** Inline error card with a retry action for failed loads. */
withDefaults(defineProps<{ title?: string; message: string; retry?: boolean }>(), {
  title: "Something went wrong",
  retry: true,
});
const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="admin-card flex flex-col items-center px-6 py-14 text-center" role="alert">
    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
      <AlertTriangle class="h-6 w-6" aria-hidden="true" />
    </span>
    <h2 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
    <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
    <button v-if="retry" type="button" class="admin-btn admin-btn-secondary mt-5" @click="emit('retry')">
      <RotateCw class="h-4 w-4" aria-hidden="true" />
      Try again
    </button>
  </div>
</template>
