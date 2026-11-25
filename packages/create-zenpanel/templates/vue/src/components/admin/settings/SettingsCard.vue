<script setup lang="ts">
/** Two-column settings section; renders a <form> when `form` is set. */
withDefaults(defineProps<{ title: string; description: string; form?: boolean }>(), { form: false });
const emit = defineEmits<{ submit: [] }>();
</script>

<template>
  <component
    :is="form ? 'form' : 'div'"
    :novalidate="form || undefined"
    class="admin-card overflow-hidden"
    @submit.prevent="emit('submit')"
  >
    <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
      <div>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
      <div class="min-w-0 space-y-4"><slot /></div>
    </div>
    <div
      v-if="$slots.footer"
      class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 md:px-6 dark:border-gray-800 dark:bg-white/[0.02]"
    >
      <slot name="footer" />
    </div>
  </component>
</template>
