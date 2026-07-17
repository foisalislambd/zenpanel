import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Accessor<Theme>;
  resolvedTheme: Accessor<ResolvedTheme>;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "zenpanel-theme";
const ThemeContext = createContext<ThemeContextValue>();

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

type Props = {
  children: JSX.Element;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

export function ThemeProvider(props: Props) {
  const defaultTheme = props.defaultTheme ?? "light";
  const enableSystem = props.enableSystem ?? true;
  const disableTransition = props.disableTransitionOnChange ?? false;

  const [theme, setThemeState] = createSignal<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = createSignal<ResolvedTheme>("light");

  onMount(() => {
    setThemeState(readStoredTheme(defaultTheme));
    setSystemTheme(getSystemTheme());

    if (!enableSystem) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    onCleanup(() => mq.removeEventListener("change", onChange));
  });

  const resolvedTheme = () => (theme() === "system" ? systemTheme() : (theme() as ResolvedTheme));

  createEffect(() => {
    applyThemeClass(resolvedTheme(), disableTransition);
  });

  function setTheme(next: Theme) {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore quota / private-mode failures.
    }
  }

  const value: ThemeContextValue = { theme, resolvedTheme, setTheme };

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
