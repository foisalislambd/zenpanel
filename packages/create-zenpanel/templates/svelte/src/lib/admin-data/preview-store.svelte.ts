/**
 * Tiny in-memory collection store for the UI preview. Edits survive
 * client-side navigation (until reload) so add / edit / delete feel real.
 * Replace with your API calls when you connect a backend.
 */
type Box<T> = { items: T[] };

const collections = new Map<string, Box<unknown>>();

export function usePreviewCollection<T>(key: string, initial: T[]): Box<T> {
  let entry = collections.get(key);
  if (!entry) {
    const box = $state<Box<unknown>>({ items: initial as unknown[] });
    collections.set(key, box);
    entry = box;
  }
  return entry as Box<T>;
}

export function previewId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
