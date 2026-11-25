import { Injectable, signal, type WritableSignal } from '@angular/core';

/**
 * Tiny in-memory collection store for the UI preview. Edits survive
 * client-side navigation (until reload) so add / edit / delete feel real.
 * Replace with your API calls when you connect a backend.
 */
@Injectable({ providedIn: 'root' })
export class PreviewStoreService {
  private readonly collections = new Map<string, WritableSignal<unknown[]>>();

  collection<T>(key: string, initial: T[]): WritableSignal<T[]> {
    let entry = this.collections.get(key);
    if (!entry) {
      entry = signal<unknown[]>(initial);
      this.collections.set(key, entry);
    }
    return entry as unknown as WritableSignal<T[]>;
  }
}

export function previewId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
