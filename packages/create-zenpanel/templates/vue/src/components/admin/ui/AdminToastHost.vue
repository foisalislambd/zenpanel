<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, X } from "lucide-vue-next";
import { useAdminToast } from "@/composables/use-admin-toast";
import { cn } from "@/lib/cn";

const { toasts, dismiss } = useAdminToast();

const icons = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const iconColors = {
  success: "text-success-600 dark:text-success-500",
  error: "text-error-500",
  info: "text-brand-500 dark:text-brand-400",
} as const;
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="polite"
      aria-atomic="false"
      class="admin-portal pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        :role="t.variant === 'error' ? 'alert' : 'status'"
        class="admin-toast pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg sm:w-[360px] dark:border-gray-700 dark:bg-gray-900"
      >
        <component :is="icons[t.variant]" :class="cn('mt-0.5 h-5 w-5 shrink-0', iconColors[t.variant])" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t.title }}</p>
          <p v-if="t.description" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ t.description }}</p>
        </div>
        <button
          type="button"
          class="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          aria-label="Dismiss notification"
          @click="dismiss(t.id)"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
