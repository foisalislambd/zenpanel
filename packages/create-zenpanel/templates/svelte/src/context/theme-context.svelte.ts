import { getContext, setContext } from "svelte";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "zenpanel-theme";
export const THEME_KEY = Symbol("theme");

export type ThemeContext = ReturnType<typeof createTheme>;

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Ignore quota / private-mode failures.
  }
  return defaultTheme;
}

function applyThemeClass(resolved: ResolvedTheme, disableTransition: boolean) {
  const root = document.documentElement;
  let style: HTMLStyleElement | null = null;

  if (disableTransition) {
    style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none !important;}";
    document.head.appendChild(style);
  }

  root.classList.toggle("dark", resolved === "dark");

  if (style) {
    window.getComputedStyle(style).opacity;
    document.head.removeChild(style);
  }
}

export function createTheme(options?: {
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const defaultTheme = options?.defaultTheme ?? "light";
  const enableSystem = options?.enableSystem ?? true;
  const disableTransition = options?.disableTransitionOnChange ?? false;

  let theme = $state<Theme>(defaultTheme);
  let systemTheme = $state<ResolvedTheme>("light");

  $effect(() => {
    theme = readStoredTheme(defaultTheme);
    systemTheme = getSystemTheme();

    if (!enableSystem) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      systemTheme = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  });

  const resolvedTheme = $derived(
    theme === "system" ? systemTheme : (theme as ResolvedTheme),
  );

  $effect(() => {
    applyThemeClass(resolvedTheme, disableTransition);
  });

  function setTheme(next: Theme) {
    theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore quota / private-mode failures.
    }
  }

  const ctx = {
    get theme() {
      return theme;
    },
    get resolvedTheme() {
      return resolvedTheme;
    },
    setTheme,
  };

  setContext(THEME_KEY, ctx);
  return ctx;
}

export function useTheme() {
  const ctx = getContext<ThemeContext>(THEME_KEY);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
