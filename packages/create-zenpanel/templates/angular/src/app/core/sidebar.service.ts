import { Injectable, signal } from '@angular/core';
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from './admin.config';

const SIDEBAR_KEY = 'zenpanel-sidebar-expanded';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly isExpanded = signal(true);
  readonly isMobileOpen = signal(false);
  readonly isDesktop = signal(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  constructor() {
    try {
      this.isExpanded.set(localStorage.getItem(SIDEBAR_KEY) !== '0');
    } catch {
      this.isExpanded.set(true);
    }

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(min-width: 1024px)');
      const onChange = () => {
        this.isDesktop.set(mq.matches);
        this.isMobileOpen.set(false);
      };
      mq.addEventListener('change', onChange);
    }
  }

  toggleSidebar(): void {
    const next = !this.isExpanded();
    this.isExpanded.set(next);
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
    } catch {
      // ignore
    }
  }

  toggleMobileSidebar(): void {
    this.isMobileOpen.update((v) => !v);
  }

  closeMobileSidebar(): void {
    this.isMobileOpen.set(false);
  }

  desktopWidth(): number {
    return this.isExpanded() ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;
  }
}
