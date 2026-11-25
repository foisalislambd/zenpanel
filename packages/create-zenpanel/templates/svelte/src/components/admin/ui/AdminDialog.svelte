<script lang="ts">
  import type { Snippet } from "svelte";
  import { tick } from "svelte";
  import { X } from "lucide-svelte";
  import { activateDialog } from "@/lib/dialog";
  import { cn } from "@/lib/cn";
  import { portal } from "@/lib/portal";

  /**
   * Accessible modal / drawer: focus trap, Escape to close, scroll lock,
   * focus restored to the trigger on close. Mark the element to focus first
   * with `data-autofocus` (defaults to the first focusable control).
   */
  type Props = {
    open: boolean;
    title: string;
    description?: string | Snippet;
    /** `center` = modal, `right` = side drawer */
    placement?: "center" | "right";
    size?: "sm" | "md" | "lg";
    onClose: () => void;
    children?: Snippet;
    footer?: Snippet;
  };

  let { open, title, description, placement = "center", size = "md", onClose, children, footer }: Props = $props();

  const uid = $props.id();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" } as const;
  let panel = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!open || !panel) return;
    let release: (() => void) | null = null;
    const el = panel;
    void tick().then(() => {
      release = activateDialog(el, () => onClose());
    });
    return () => release?.();
  });
</script>

{#if open}
  <div
    use:portal
    class={cn(
      "admin-portal fixed inset-0 z-[60] flex",
      placement === "center" ? "items-end justify-center p-0 sm:items-center sm:p-4" : "justify-end",
    )}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" aria-hidden="true" onclick={onClose}></div>
    <div
      bind:this={panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      tabindex="-1"
      class={cn(
        "relative flex w-full flex-col bg-white shadow-2xl outline-none dark:bg-gray-900",
        placement === "center"
          ? cn(
              "admin-dialog max-h-[92dvh] rounded-t-2xl border border-gray-200 sm:rounded-2xl dark:border-gray-800",
              widths[size],
            )
          : "admin-drawer h-full max-w-md border-l border-gray-200 dark:border-gray-800",
      )}
    >
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div class="min-w-0">
          <h2 id={titleId} class="truncate text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          {#if description}
            <div id={descId} class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {#if typeof description === "string"}{description}{:else}{@render description()}{/if}
            </div>
          {/if}
        </div>
        <button
          type="button"
          class="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200"
          aria-label="Close"
          onclick={onClose}
        >
          <X class="h-5 w-5" aria-hidden={true} />
        </button>
      </div>
      <div class="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {@render children?.()}
      </div>
      {#if footer}
        <div
          class="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800"
        >
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
