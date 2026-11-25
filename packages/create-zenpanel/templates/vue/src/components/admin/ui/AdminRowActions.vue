<script setup lang="ts">
import { computed, type Component } from "vue";
import { Eye, Pencil, Trash2 } from "lucide-vue-next";

const pendingTitle = "Available after you connect your API";

const btnBase =
  "flex items-center justify-center rounded-lg text-gray-500 transition-colors dark:text-gray-400";
const btnEnabled =
  "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200";
const btnDanger =
  "hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/15 dark:hover:text-error-500";
const btnDisabled = "cursor-not-allowed opacity-70";

const props = withDefaults(
  defineProps<{
    itemLabel: string;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    pending?: boolean;
    size?: "sm" | "md";
    class?: string;
  }>(),
  {
    pending: false,
    size: "sm",
    class: "",
  },
);

const dim = computed(() => (props.size === "md" ? "h-9 w-9" : "h-8 w-8"));
const iconSize = computed(() =>
  props.size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4",
);

type Action = {
  label: string;
  icon: Component;
  onClick?: () => void;
  danger?: boolean;
};

const actions = computed<Action[]>(() => [
  { label: `View ${props.itemLabel}`, icon: Eye, onClick: props.onView },
  { label: `Edit ${props.itemLabel}`, icon: Pencil, onClick: props.onEdit },
  { label: `Delete ${props.itemLabel}`, icon: Trash2, onClick: props.onDelete, danger: true },
]);

function isEnabled(onClick?: () => void) {
  return Boolean(onClick) && !props.pending;
}
</script>

<template>
  <div :class="['flex items-center justify-end gap-0.5', props.class]">
    <button
      v-for="action in actions"
      :key="action.label"
      type="button"
      :disabled="!isEnabled(action.onClick)"
      :title="isEnabled(action.onClick) ? undefined : pendingTitle"
      :aria-label="action.label"
      :class="[
        btnBase,
        dim,
        isEnabled(action.onClick) ? (action.danger ? btnDanger : btnEnabled) : btnDisabled,
      ]"
      @click="isEnabled(action.onClick) ? action.onClick?.() : undefined"
    >
      <component :is="action.icon" :class="iconSize" aria-hidden="true" />
    </button>
  </div>
</template>
