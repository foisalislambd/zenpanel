<script setup lang="ts">
import { computed } from "vue";
import { resourceSamples } from "../lib/data";

const props = defineProps<{
  title: string;
  resourceKey: string;
}>();

const items = computed(() => resourceSamples[props.resourceKey] ?? []);
</script>

<template>
  <h1 class="page-title">{{ title }}</h1>
  <div class="admin-card">
    <div
      style="
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--gray-200);
        font-weight: 600;
        font-size: 0.875rem;
      "
    >
      {{ title }}
    </div>
    <ul v-if="items.length" style="list-style: none; margin: 0; padding: 0">
      <li
        v-for="item in items"
        :key="item"
        style="
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid var(--gray-100);
          font-size: 0.875rem;
        "
      >
        {{ item }}
      </li>
    </ul>
    <p
      v-else
      class="muted"
      style="padding: 2.5rem 1.25rem; text-align: center; font-size: 0.875rem"
    >
      No {{ title.toLowerCase() }} yet.
    </p>
  </div>
</template>
