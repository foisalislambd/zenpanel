<script lang="ts">
  import type { Snippet } from "svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  type Props = {
    title: string;
    href?: string | null;
    linkLabel?: string;
    trailing?: Snippet;
  };

  let { title, href, linkLabel = "View all", trailing }: Props = $props();
</script>

<div class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
  {#if trailing}
    {@render trailing()}
  {:else if href}
    <RouterLink
      {href}
      class="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      {linkLabel}
    </RouterLink>
  {/if}
</div>
