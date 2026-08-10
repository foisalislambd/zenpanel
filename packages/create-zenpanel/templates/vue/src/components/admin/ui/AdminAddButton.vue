<script setup lang="ts">
import { computed } from "vue";
import { Plus } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    label?: string;
    onClick?: () => void;
    /** When true (default for shell), button is disabled until API is wired */
    pending?: boolean;
  }>(),
  {
    label: "Add new",
    pending: false,
  },
);

const enabled = computed(() => Boolean(props.onClick) && !props.pending);
</script>

<template>
  <button
    type="button"
    :disabled="!enabled"
    :title="enabled ? label : 'Available after you connect your API'"
    :class="[
      'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white',
      enabled
        ? 'bg-brand-500 shadow-sm shadow-brand-500/20 hover:bg-brand-600'
        : 'cursor-not-allowed bg-brand-500/50 text-white/90',
    ]"
    @click="enabled ? onClick?.() : undefined"
  >
    <Plus class="h-4 w-4" aria-hidden="true" />
    {{ label }}
  </button>
</template>
