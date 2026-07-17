<script setup lang="ts">
defineProps<{
  title: string;
  href?: string | null;
  linkLabel?: string;
}>();
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800"
  >
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    <slot name="trailing">
      <RouterLink
        v-if="href"
        :to="href"
        class="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        {{ linkLabel ?? "View all" }}
      </RouterLink>
    </slot>
  </div>
</template>
