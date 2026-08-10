import { Eye, Pencil, Trash2, type LucideIcon } from "lucide-solid";
import type { JSX } from "solid-js";

const pendingTitle = "Available after you connect your API";

const btnBase =
  "flex items-center justify-center rounded-lg text-gray-400 transition-colors";
const btnEnabled =
  "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200";
const btnDisabled = "cursor-not-allowed opacity-70";

type ActionButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  pending?: boolean;
  size?: "sm" | "md";
  class?: string;
} & Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children" | "class">;

function ActionButton(props: ActionButtonProps) {
  const enabled = () => Boolean(props.onClick) && !props.pending;
  const dim = () => (props.size === "md" ? "h-9 w-9" : "h-8 w-8");
  const iconSize = () => (props.size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4");
  const Icon = props.icon;

  return (
    <button
      type="button"
      onClick={() => {
        if (enabled()) props.onClick?.();
      }}
      disabled={!enabled()}
      title={enabled() ? props.label : pendingTitle}
      aria-label={props.label}
      class={`${btnBase} ${dim()} ${enabled() ? btnEnabled : btnDisabled} ${props.class ?? ""}`}
    >
      <Icon class={iconSize()} aria-hidden />
    </button>
  );
}

export type AdminRowActionsProps = {
  /** Used in aria-labels, e.g. item title or user name */
  itemLabel: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Force all actions into pending/disabled preview mode */
  pending?: boolean;
  size?: "sm" | "md";
  class?: string;
};

/**
 * Standard row actions for admin tables.
 * Pass handlers to enable buttons; omit (or set `pending`) for UI-shell preview.
 */
export function AdminRowActions(props: AdminRowActionsProps) {
  return (
    <div class={`flex items-center justify-end gap-0.5 ${props.class ?? ""}`}>
      <ActionButton
        label={`View ${props.itemLabel}`}
        icon={Eye}
        onClick={props.onView}
        pending={props.pending}
        size={props.size}
      />
      <ActionButton
        label={`Edit ${props.itemLabel}`}
        icon={Pencil}
        onClick={props.onEdit}
        pending={props.pending}
        size={props.size}
      />
      <ActionButton
        label={`Delete ${props.itemLabel}`}
        icon={Trash2}
        onClick={props.onDelete}
        pending={props.pending}
        size={props.size}
      />
    </div>
  );
}
