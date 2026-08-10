"use client";

import { Eye, Pencil, Trash2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

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
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">;

function ActionButton({
  label,
  icon: Icon,
  onClick,
  pending = false,
  size = "sm",
  className = "",
  ...rest
}: ActionButtonProps) {
  const enabled = Boolean(onClick) && !pending;
  const dim = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const iconSize = size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      title={enabled ? label : pendingTitle}
      aria-label={label}
      className={`${btnBase} ${dim} ${enabled ? btnEnabled : btnDisabled} ${className}`}
      {...rest}
    >
      <Icon className={iconSize} aria-hidden />
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
  className?: string;
};

/**
 * Standard row actions for admin tables.
 * Pass handlers to enable buttons; omit (or set `pending`) for UI-shell preview.
 */
export function AdminRowActions({
  itemLabel,
  onView,
  onEdit,
  onDelete,
  pending = false,
  size = "sm",
  className = "",
}: AdminRowActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-0.5 ${className}`}>
      <ActionButton
        label={`View ${itemLabel}`}
        icon={Eye}
        onClick={onView}
        pending={pending}
        size={size}
      />
      <ActionButton
        label={`Edit ${itemLabel}`}
        icon={Pencil}
        onClick={onEdit}
        pending={pending}
        size={size}
      />
      <ActionButton
        label={`Delete ${itemLabel}`}
        icon={Trash2}
        onClick={onDelete}
        pending={pending}
        size={size}
      />
    </div>
  );
}
