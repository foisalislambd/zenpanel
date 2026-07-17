<script lang="ts">
  import type { Snippet } from "svelte";
  import { createTheme } from "@/context/theme-context.svelte";

  type Props = {
    children?: Snippet;
    defaultTheme?: "light" | "dark" | "system";
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  };

  let {
    children,
    defaultTheme = "light",
    enableSystem = true,
    disableTransitionOnChange = false,
  }: Props = $props();

  createTheme({
    get defaultTheme() {
      return defaultTheme;
    },
    get enableSystem() {
      return enableSystem;
    },
    get disableTransitionOnChange() {
      return disableTransitionOnChange;
    },
  });
</script>

{@render children?.()}
