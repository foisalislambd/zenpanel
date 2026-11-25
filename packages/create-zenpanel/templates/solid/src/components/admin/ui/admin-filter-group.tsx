import { cn } from "@/lib/cn";
import { For, Show } from "solid-js";

type Option<T extends string> = { value: T; label: string; count?: number };

/** Segmented filter control (single choice, `aria-pressed` buttons). */
export function AdminFilterGroup<T extends string>(props: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** Visible label (e.g. "Status") - helps when several groups sit side by side. */
  label?: string;
}) {
  return (
    <div role="group" aria-label={props.ariaLabel} class="flex min-w-0 flex-wrap items-center gap-1.5">
      <Show when={props.label}>
        <span class="mr-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          {props.label}
        </span>
      </Show>
      <For each={props.options}>
        {(option) => {
          const active = () => props.value === option.value;
          return (
            <button
              type="button"
              aria-pressed={active()}
              onClick={() => props.onChange(option.value)}
              class={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active()
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5",
              )}
            >
              {option.label}
              <Show when={typeof option.count === "number"}>
                <span
                  class={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active()
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400",
                  )}
                >
                  {option.count}
                </span>
              </Show>
            </button>
          );
        }}
      </For>
    </div>
  );
}
