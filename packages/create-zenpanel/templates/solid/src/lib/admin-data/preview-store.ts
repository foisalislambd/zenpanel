import { createSignal, type Accessor, type Setter } from "solid-js";

/**
 * Tiny in-memory collection store for the UI preview. Edits survive
 * client-side navigation (until reload) so add / edit / delete feel real.
 * Replace with your API calls when you connect a backend.
 */
const collections = new Map<string, [Accessor<unknown[]>, Setter<unknown[]>]>();

export function usePreviewCollection<T>(key: string, initial: T[]): [Accessor<T[]>, Setter<T[]>] {
  let entry = collections.get(key);
  if (!entry) {
    entry = createSignal<unknown[]>(initial);
    collections.set(key, entry);
  }
  return entry as unknown as [Accessor<T[]>, Setter<T[]>];
}

export function previewId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
