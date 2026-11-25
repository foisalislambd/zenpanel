<script lang="ts">
  import type { Snippet } from "svelte";

  /** Two-column settings section; renders a <form> when `onSubmit` is set. */
  type Props = {
    title: string;
    description: string;
    onSubmit?: () => void;
    children?: Snippet;
    footer?: Snippet;
  };
  let { title, description, onSubmit, children, footer }: Props = $props();
</script>

{#snippet body()}
  <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
    <div>
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <div class="min-w-0 space-y-4">{@render children?.()}</div>
  </div>
  {#if footer}
    <div
      class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 md:px-6 dark:border-gray-800 dark:bg-white/[0.02]"
    >
      {@render footer()}
    </div>
  {/if}
{/snippet}

{#if onSubmit}
  <form
    novalidate
    class="admin-card overflow-hidden"
    onsubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    {@render body()}
  </form>
{:else}
  <div class="admin-card overflow-hidden">{@render body()}</div>
{/if}
