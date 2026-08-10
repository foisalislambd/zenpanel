<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { value: T; label: string }[];
  value: T;
  ariaLabel: string;
}>();

const emit = defineEmits<{
  change: [value: T];
}>();
</script>

<template>
  <div
    role="group"
    :aria-label="ariaLabel"
    class="flex shrink-0 flex-wrap items-center gap-1.5"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      @click="emit('change', option.value)"
      :class="[
        'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        value === option.value
          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5',
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>
