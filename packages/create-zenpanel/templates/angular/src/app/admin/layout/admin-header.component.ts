import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { adminConfig } from '@/app/core/admin.config';
import { AdminChatPanelService } from '@/app/core/admin-chat-panel.service';
import { SidebarService } from '@/app/core/sidebar.service';
import { IconComponent } from '@/app/shared/icon.component';
import { AdminThemeToggleComponent } from '@/app/admin/ui/admin-theme-toggle.component';
import { isMacPlatform } from '@/app/lib/command-palette';
import { AdminCommandPaletteComponent } from './admin-command-palette.component';
import { AdminUserMenuComponent } from './admin-user-menu.component';

@Component({
  selector: 'app-admin-header',
  imports: [
    RouterLink,
    IconComponent,
    AdminThemeToggleComponent,
    AdminUserMenuComponent,
    AdminCommandPaletteComponent,
  ],
  host: { '(window:keydown)': 'onWindowKeyDown($event)' },
  template: `
    <header
      class="admin-topbar sticky top-0 z-30 w-full bg-white dark:bg-gray-900"
    >
      <div class="flex h-full items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <button
          type="button"
          (click)="sidebar.toggleMobileSidebar()"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
          [class.lg:hidden]="sidebar.isDesktop()"
          [attr.aria-label]="!sidebar.isDesktop() && sidebar.isMobileOpen() ? 'Close menu' : 'Open menu'"
          [attr.aria-expanded]="!sidebar.isDesktop() ? sidebar.isMobileOpen() : null"
        >
          <app-icon [name]="!sidebar.isDesktop() && sidebar.isMobileOpen() ? 'x' : 'menu'" [size]="20" />
        </button>

        <a routerLink="/admin" class="flex items-center gap-2 lg:hidden">
          <span
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white"
            >{{ brand.letter }}</span
          >
          <span class="text-base font-semibold text-gray-900 dark:text-white">{{ brand.name }}</span>
        </a>

        <div class="hidden flex-1 lg:block lg:max-w-lg">
          <button
            type="button"
            class="flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 pr-2 pl-3 text-sm text-gray-500 transition hover:border-gray-300 hover:bg-white dark:border-gray-800 dark:bg-white/5 dark:text-gray-400 dark:hover:border-gray-700"
            aria-label="Search pages and actions"
            aria-keyshortcuts="Control+K Meta+K"
            (click)="paletteOpen.set(true)"
          >
            <app-icon name="search" [size]="16" class="text-gray-400" />
            <span class="flex-1 text-left">Search pages and actions…</span>
            <kbd
              class="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >{{ isMac ? '⌘' : 'Ctrl' }} K</kbd
            >
          </button>
        </div>

        <div class="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
            aria-label="Search pages and actions"
            (click)="paletteOpen.set(true)"
          >
            <app-icon name="search" [size]="16" />
          </button>
          <button
            type="button"
            (click)="chat.togglePanel()"
            class="flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            [class]="
              chat.isOpen()
                ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5'
            "
            [attr.aria-label]="chat.isOpen() ? 'Close AI assistant' : 'Open AI assistant'"
            [attr.aria-expanded]="chat.isOpen()"
          >
            <app-icon name="sparkles" [size]="16" />
            <span class="hidden sm:inline">AI</span>
          </button>
          <app-admin-theme-toggle />
          <app-admin-user-menu />
        </div>
      </div>
      @if (paletteOpen()) {
        <app-admin-command-palette (closed)="paletteOpen.set(false)" />
      }
    </header>
  `,
})
export class AdminHeaderComponent {
  readonly sidebar = inject(SidebarService);
  readonly chat = inject(AdminChatPanelService);
  readonly brand = adminConfig.brand;
  readonly isMac = isMacPlatform;
  readonly paletteOpen = signal(false);

  onWindowKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.paletteOpen.update((v) => !v);
    }
  }
}
