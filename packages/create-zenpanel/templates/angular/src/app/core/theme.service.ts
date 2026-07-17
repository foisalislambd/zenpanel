import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'zenpanel-theme';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>(this.readInitial());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    const next: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }

  private readInitial(): ThemeMode {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private apply(mode: ThemeMode): void {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}
