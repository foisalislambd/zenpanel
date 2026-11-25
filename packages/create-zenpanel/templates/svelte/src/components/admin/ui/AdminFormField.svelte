<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "@/lib/cn";

  /** Label + control + hint/error. Give the control `aria-describedby={fieldDescribedBy(id, error, hint)}`. */
  type Props = {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    class?: string;
    children?: Snippet;
  };

  let { id, label, error, hint, required = false, class: className, children }: Props = $props();
</script>

<div class={cn("space-y-1.5", className)}>
  <label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {label}{#if required}<span class="ml-0.5 text-error-500" aria-hidden="true">*</span>{/if}
  </label>
  {@render children?.()}
  {#if error}
    <p id="{id}-error" class="text-sm text-error-500">{error}</p>
  {:else if hint}
    <p id="{id}-hint" class="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
  {/if}
</div>
