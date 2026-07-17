<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    actions?: Snippet;
  };

  let { title, actions }: Props = $props();
</script>

<div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
  <div class="min-w-0 flex-1">
    <h1 class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
      {title}
    </h1>
  </div>
  {#if actions}
    <div class="flex shrink-0 flex-wrap items-center gap-2">
      {@render actions()}
    </div>
  {/if}
</div>
