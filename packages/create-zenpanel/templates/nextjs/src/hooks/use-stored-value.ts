"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * SSR-safe localStorage value: the server (and hydration) render `fallback`,
 * then the stored value is used on the client without a hydration mismatch.
 * Returns the raw string; parse it in the caller.
 */
export function useStoredValue(key: string, fallback: string | null = null) {
  const value = useSyncExternalStore(
    subscribe,
    () => readRaw(key) ?? fallback,
    () => fallback,
  );

  const setValue = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        // ignore private-mode storage errors
      }
      listeners.forEach((fn) => fn());
    },
    [key],
  );

  return [value, setValue] as const;
}
