import { Injectable, computed, signal } from '@angular/core';

const THEME_KEY = 'zenpanel-theme';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** What the user picked (light / dark / follow the OS). */
  readonly preference = signal<ThemePreference>(this.readInitial());
  private readonly systemDark = signal(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  /** The theme actually applied. */
  readonly theme = computed<ThemeMode>(() => {
    const pref = this.preference();
    return pref === 'system' ? (this.systemDark() ? 'dark' : 'light') : pref;
  });

  constructor() {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e) => {
        this.systemDark.set(e.matches);
        this.apply();
      });
    }
    this.apply();
  }

  setTheme(next: ThemePreference): void {
    this.preference.set(next);
    this.apply();
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private readInitial(): ThemePreference {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
    } catch {
      // ignore
    }
    return 'system';
  }

  private apply(): void {
    document.documentElement.classList.toggle('dark', this.theme() === 'dark');
  }
}
