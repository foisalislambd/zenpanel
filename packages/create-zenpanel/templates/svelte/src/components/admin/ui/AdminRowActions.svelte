<script lang="ts">
  import type { LucideIcon } from "@/lib/icon-types";
  import { Eye, Pencil, Trash2 } from "lucide-svelte";

  const pendingTitle = "Available after you connect your API";

  const btnBase =
    "flex items-center justify-center rounded-lg text-gray-500 transition-colors dark:text-gray-400";
  const btnEnabled =
    "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200";
  const btnDanger =
    "hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/15 dark:hover:text-error-500";
  const btnDisabled = "cursor-not-allowed opacity-70";

  type Props = {
    itemLabel: string;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    pending?: boolean;
    size?: "sm" | "md";
    class?: string;
  };

  let {
    itemLabel,
    onView,
    onEdit,
    onDelete,
    pending = false,
    size = "sm",
    class: className = "",
  }: Props = $props();

  const dim = $derived(size === "md" ? "h-9 w-9" : "h-8 w-8");
  const iconSize = $derived(size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4");

  type Action = {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    danger?: boolean;
  };

  const actions = $derived<Action[]>([
    { label: `View ${itemLabel}`, icon: Eye, onClick: onView },
    { label: `Edit ${itemLabel}`, icon: Pencil, onClick: onEdit },
    { label: `Delete ${itemLabel}`, icon: Trash2, onClick: onDelete, danger: true },
  ]);

  function isEnabled(onClick?: () => void) {
    return Boolean(onClick) && !pending;
  }
</script>

<div class="flex items-center justify-end gap-0.5 {className}">
  {#each actions as action (action.label)}
    {@const enabled = isEnabled(action.onClick)}
    {@const Icon = action.icon}
    <button
      type="button"
      onclick={() => {
        if (enabled) action.onClick?.();
      }}
      disabled={!enabled}
      title={enabled ? undefined : pendingTitle}
      aria-label={action.label}
      class="{btnBase} {dim} {enabled ? (action.danger ? btnDanger : btnEnabled) : btnDisabled}"
    >
      <Icon class={iconSize} aria-hidden={true} />
    </button>
  {/each}
</div>
