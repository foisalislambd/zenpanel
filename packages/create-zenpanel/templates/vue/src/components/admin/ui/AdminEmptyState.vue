<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center px-6 py-16 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
      <component :is="icon" class="h-7 w-7 text-gray-400 dark:text-gray-500" aria-hidden="true" />
    </div>
    <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
