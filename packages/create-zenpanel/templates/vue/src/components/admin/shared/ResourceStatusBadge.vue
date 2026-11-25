<script setup lang="ts">
import type { AdminResourceStatus } from "@/lib/admin-data/resources";
import { resourceStatusStyles } from "@/lib/admin-resources";

defineProps<{ status: AdminResourceStatus; label: string }>();
</script>

<template>
  <span :class="['inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', resourceStatusStyles[status]]">
    {{ label }}
  </span>
</template>
