const THEME_KEY = "zenpanel-theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

/** Stored preference: "light" | "dark" | "system" (default). */
export function getThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // Private mode / blocked storage
  }
  return "system";
}

/** Resolved theme currently applied: "light" | "dark". */
export function getTheme() {
  const pref = getThemePreference();
  if (pref === "system") return media().matches ? "dark" : "light";
  return pref;
}

function paint() {
  const dark = getTheme() === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** @param {"light"|"dark"|"system"} preference */
export function setThemePreference(preference) {
  try {
    localStorage.setItem(THEME_KEY, preference);
  } catch {
    // Theme still applies for this page load.
  }
  paint();
}

/** @deprecated use setThemePreference - kept for older pages. */
export function applyTheme(theme) {
  setThemePreference(theme);
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setThemePreference(next);
  return next;
}

let listening = false;
export function initTheme() {
  paint();
  if (!listening) {
    listening = true;
    media().addEventListener("change", () => getThemePreference() === "system" && paint());
  }
}
