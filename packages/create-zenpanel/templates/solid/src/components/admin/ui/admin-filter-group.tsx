import { For } from "solid-js";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

export function AdminFilterGroup<T extends string>(props: Props<T>) {
  return (
    <div
      role="group"
      aria-label={props.ariaLabel}
      class="flex shrink-0 flex-wrap items-center gap-1.5"
    >
      <For each={props.options}>
        {(option) => {
          const active = () => props.value === option.value;
          return (
            <button
              type="button"
              onClick={() => props.onChange(option.value)}
              class={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active()
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {option.label}
            </button>
          );
        }}
      </For>
    </div>
  );
}
