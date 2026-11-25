<script setup lang="ts">
import { initials } from "@/lib/admin-resources";

defineProps<{ name: string }>();
</script>

<template>
  <span
    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
    aria-hidden="true"
  >
    {{ initials(name) }}
  </span>
</template>
