<script setup lang="ts" generic="T extends string">
import { cn } from "@/lib/cn";

/** Segmented filter control (single choice, `aria-pressed` buttons). */
defineProps<{
  options: { value: T; label: string; count?: number }[];
  value: T;
  groupLabel: string;
  /** Visible label (e.g. "Status") - helps when several groups sit side by side. */
  label?: string;
}>();

const emit = defineEmits<{ change: [value: T] }>();
</script>

<template>
  <div role="group" :aria-label="groupLabel" class="flex min-w-0 flex-wrap items-center gap-1.5">
    <span v-if="label" class="mr-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
      {{ label }}
    </span>
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="value === option.value"
      :class="
        cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          value === option.value
            ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5',
        )
      "
      @click="emit('change', option.value)"
    >
      {{ option.label }}
      <span
        v-if="typeof option.count === 'number'"
        :class="
          cn(
            'rounded-full px-1.5 text-xs tabular-nums',
            value === option.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400',
          )
        "
      >
        {{ option.count }}
      </span>
    </button>
  </div>
</template>
