import { shallowRef, type ShallowRef } from "vue";

/**
 * Tiny in-memory collection store for the UI preview. Edits survive
 * client-side navigation (until reload) so add / edit / delete feel real.
 * Replace with your API calls when you connect a backend.
 */
const collections = new Map<string, ShallowRef<unknown[]>>();

export function usePreviewCollection<T>(key: string, initial: T[]): ShallowRef<T[]> {
  let entry = collections.get(key);
  if (!entry) {
    entry = shallowRef<unknown[]>(initial);
    collections.set(key, entry);
  }
  return entry as ShallowRef<T[]>;
}

export function previewId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
