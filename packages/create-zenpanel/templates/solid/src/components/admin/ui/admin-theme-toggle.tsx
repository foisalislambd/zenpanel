import { useTheme } from "@/components/theme/theme-provider";
import { Moon, Sun } from "lucide-solid";
import { Show } from "solid-js";

type Props = {
  class?: string;
};

export function AdminThemeToggle(props: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = () => resolvedTheme() === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark() ? "light" : "dark")}
      class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 ${props.class ?? ""}`}
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Show when={isDark()} fallback={<Moon class="h-5 w-5" />}>
        <Sun class="h-5 w-5" />
      </Show>
    </button>
  );
}
