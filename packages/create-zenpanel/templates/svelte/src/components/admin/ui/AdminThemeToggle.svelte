<script lang="ts">
  import { useTheme } from "@/context/theme-context.svelte";
  import { Moon, Sun } from "lucide-svelte";

  type Props = { class?: string };
  let { class: className = "" }: Props = $props();

  const theme = useTheme();
  const isDark = $derived(theme.resolvedTheme === "dark");
</script>

<button
  type="button"
  onclick={() => theme.setTheme(isDark ? "light" : "dark")}
  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 {className}"
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
>
  {#if isDark}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>
