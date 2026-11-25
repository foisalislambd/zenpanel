<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { X } from "lucide-vue-next";
import { activateDialog } from "@/lib/dialog";
import { cn } from "@/lib/cn";

/**
 * Accessible modal / drawer: focus trap, Escape to close, scroll lock,
 * focus restored to the trigger on close. Mark the element to focus first
 * with `data-autofocus` (defaults to the first focusable control).
 */
const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    /** `center` = modal, `right` = side drawer */
    placement?: "center" | "right";
    size?: "sm" | "md" | "lg";
  }>(),
  { description: undefined, placement: "center", size: "md" },
);

const emit = defineEmits<{ close: [] }>();
const slots = defineSlots<{ default?: () => unknown; footer?: () => unknown; description?: () => unknown }>();

const panel = ref<HTMLElement | null>(null);
const titleId = useId();
const descId = useId();
const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" } as const;
let release: (() => void) | null = null;

watch(
  () => props.open,
  async (open) => {
    release?.();
    release = null;
    if (!open) return;
    await nextTick();
    if (panel.value) release = activateDialog(panel.value, () => emit("close"));
  },
  { immediate: true },
);

onBeforeUnmount(() => release?.());
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :class="
        cn(
          'admin-portal fixed inset-0 z-[60] flex',
          placement === 'center' ? 'items-end justify-center p-0 sm:items-center sm:p-4' : 'justify-end',
        )
      "
    >
      <div
        class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="emit('close')"
      />
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="description || slots.description ? descId : undefined"
        tabindex="-1"
        :class="
          cn(
            'relative flex w-full flex-col bg-white shadow-2xl outline-none dark:bg-gray-900',
            placement === 'center'
              ? cn(
                  'admin-dialog max-h-[92dvh] rounded-t-2xl border border-gray-200 sm:rounded-2xl dark:border-gray-800',
                  widths[size],
                )
              : 'admin-drawer h-full max-w-md border-l border-gray-200 dark:border-gray-800',
          )
        "
      >
        <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div class="min-w-0">
            <h2 :id="titleId" class="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h2>
            <div
              v-if="description || slots.description"
              :id="descId"
              class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
            >
              <slot name="description">{{ description }}</slot>
            </div>
          </div>
          <button
            type="button"
            class="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label="Close"
            @click="emit('close')"
          >
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div class="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <slot />
        </div>
        <div
          v-if="slots.footer"
          class="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
