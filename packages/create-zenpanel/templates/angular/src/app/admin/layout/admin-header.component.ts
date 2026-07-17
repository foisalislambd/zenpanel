import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { adminConfig } from '@/app/core/admin.config';
import { AdminChatPanelService } from '@/app/core/admin-chat-panel.service';
import { SidebarService } from '@/app/core/sidebar.service';
import { IconComponent } from '@/app/shared/icon.component';
import { AdminThemeToggleComponent } from '@/app/admin/ui/admin-theme-toggle.component';
import { AdminUserMenuComponent } from './admin-user-menu.component';

@Component({
  selector: 'app-admin-header',
  imports: [RouterLink, IconComponent, AdminThemeToggleComponent, AdminUserMenuComponent],
  template: `
    <header
      class="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80"
    >
      <div class="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          (click)="sidebar.toggleMobileSidebar()"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
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
          <label class="relative block">
            <app-icon
              name="search"
              [size]="16"
              class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              disabled
              placeholder="Search — connect API to enable"
              class="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-500 placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/5 dark:text-gray-500"
              aria-label="Search"
              aria-describedby="admin-search-hint"
            />
            <span id="admin-search-hint" class="sr-only">
              Global search will be available after you connect your backend API.
            </span>
          </label>
        </div>

        <div class="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            (click)="chat.togglePanel()"
            class="flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            [class]="
              chat.isOpen()
                ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5'
            "
            aria-label="Toggle AI assistant"
            [attr.aria-expanded]="chat.isOpen()"
          >
            <app-icon name="panel-right-open" [size]="16" />
            <span class="hidden sm:inline">AI</span>
          </button>
          <app-admin-theme-toggle />
          <app-admin-user-menu />
        </div>
      </div>
    </header>
  `,
})
export class AdminHeaderComponent {
  readonly sidebar = inject(SidebarService);
  readonly chat = inject(AdminChatPanelService);
  readonly brand = adminConfig.brand;
}
