<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
    <div class="min-w-0 flex-1">
      <h1
        class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
      >
        {{ title }}
      </h1>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
