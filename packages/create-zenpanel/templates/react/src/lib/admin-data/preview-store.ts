import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny in-memory collection store for the UI preview.
 * Edits survive client-side navigation (until reload) so add / edit / delete
 * feel real. Replace with your API calls when you connect a backend.
 */
const collections = new Map<string, unknown[]>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

export function usePreviewCollection<T>(key: string, initial: T[]) {
  if (!collections.has(key)) collections.set(key, initial);

  const subscribe = useCallback(
    (fn: () => void) => {
      let set = listeners.get(key);
      if (!set) listeners.set(key, (set = new Set()));
      set.add(fn);
      return () => set.delete(fn);
    },
    [key],
  );

  // Client-only store (SPA) - no server snapshot needed.
  const items = useSyncExternalStore(subscribe, () => (collections.get(key) ?? initial) as T[]);

  const setItems = useCallback(
    (update: (prev: T[]) => T[]) => {
      collections.set(key, update((collections.get(key) ?? initial) as T[]));
      emit(key);
    },
    [key, initial],
  );

  return [items, setItems] as const;
}

export function previewId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
