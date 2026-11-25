"use client";

import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: string; count?: number };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** Visible label (e.g. "Status") - helps when several groups sit side by side. */
  label?: string;
};

/** Segmented filter control (single choice, `aria-pressed` buttons). */
export function AdminFilterGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  label,
}: Props<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex min-w-0 flex-wrap items-center gap-1.5">
      {label && (
        <span className="mr-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          {label}
        </span>
      )}
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5",
            )}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
