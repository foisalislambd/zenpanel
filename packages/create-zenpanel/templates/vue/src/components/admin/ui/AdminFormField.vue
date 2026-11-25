<script setup lang="ts">
import { cn } from "@/lib/cn";

/** Label + control + hint/error. Give the control `aria-describedby="fieldDescribedBy(id, error, hint)"`. */
defineProps<{
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  class?: string;
}>();
</script>

<template>
  <div :class="cn('space-y-1.5', $props.class)">
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}<span v-if="required" class="ml-0.5 text-error-500" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="text-sm text-error-500">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="text-xs text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>
