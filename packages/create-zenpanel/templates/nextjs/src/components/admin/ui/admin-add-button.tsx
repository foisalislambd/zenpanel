"use client";

import { Plus } from "lucide-react";

type Props = {
  label?: string;
  onClick?: () => void;
  /** When true, button stays disabled even if onClick is set */
  pending?: boolean;
};

/**
 * Primary “Add new” control for resource/list pages.
 * Pass `onClick` after connecting your API to enable the button.
 */
export function AdminAddButton({
  label = "Add new",
  onClick,
  pending = false,
}: Props) {
  const enabled = Boolean(onClick) && !pending;

  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      title={enabled ? label : "Available after you connect your API"}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white ${
        enabled
          ? "bg-brand-500 shadow-sm shadow-brand-500/20 hover:bg-brand-600"
          : "cursor-not-allowed bg-brand-500/50 text-white/90"
      }`}
    >
      <Plus className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
