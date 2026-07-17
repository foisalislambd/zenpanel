<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "@/composables/use-theme";
import { Moon, Sun } from "lucide-vue-next";

const props = defineProps<{ class?: string }>();

const theme = useTheme();
const isDark = computed(() => theme.resolvedTheme === "dark");
</script>

<template>
  <button
    type="button"
    :class="[
      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5',
      props.class,
    ]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="theme.setTheme(isDark ? 'light' : 'dark')"
  >
    <Sun v-if="isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
  </button>
</template>
