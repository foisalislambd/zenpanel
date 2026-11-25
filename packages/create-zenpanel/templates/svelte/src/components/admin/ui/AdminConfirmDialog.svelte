<script lang="ts">
  import type { Snippet } from "svelte";
  import { AlertTriangle } from "lucide-svelte";
  import AdminDialog from "@/components/admin/ui/AdminDialog.svelte";
  import { cn } from "@/lib/cn";

  /** Confirmation step for destructive actions (delete, ban). Focuses Cancel first. */
  type Props = {
    open: boolean;
    title: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: "danger" | "default";
    onConfirm: () => void;
    onCancel: () => void;
    children?: Snippet;
  };

  let {
    open,
    title,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    tone = "danger",
    onConfirm,
    onCancel,
    children,
  }: Props = $props();
</script>

<AdminDialog {open} {title} size="sm" onClose={onCancel}>
  <div class="flex gap-3">
    {#if tone === "danger"}
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
        <AlertTriangle class="h-5 w-5" aria-hidden={true} />
      </span>
    {/if}
    <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      {@render children?.()}
    </div>
  </div>
  {#snippet footer()}
    <button type="button" data-autofocus class="admin-btn admin-btn-secondary" onclick={onCancel}>{cancelLabel}</button>
    <button
      type="button"
      class={cn("admin-btn", tone === "danger" ? "admin-btn-danger" : "admin-btn-primary")}
      onclick={onConfirm}
    >
      {confirmLabel}
    </button>
  {/snippet}
</AdminDialog>
