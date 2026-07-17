<script setup lang="ts">
import { provideTheme } from "@/composables/use-theme";

const props = withDefaults(
  defineProps<{
    defaultTheme?: "light" | "dark" | "system";
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }>(),
  {
    defaultTheme: "light",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
);

provideTheme({
  defaultTheme: props.defaultTheme,
  enableSystem: props.enableSystem,
  disableTransitionOnChange: props.disableTransitionOnChange,
});
</script>

<template>
  <slot />
</template>
