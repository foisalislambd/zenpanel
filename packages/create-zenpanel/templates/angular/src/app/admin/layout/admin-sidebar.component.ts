import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  adminConfig,
  adminNavItems,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/app/core/admin.config';
import { SidebarService } from '@/app/core/sidebar.service';
import { isAdminNavActive, isExternalUrl, normalizePathname } from '@/app/core/admin-nav';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, IconComponent],
  template: `
    <aside
      class="fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out lg:translate-x-0 dark:border-gray-800 dark:bg-gray-900"
      [class.translate-x-0]="sidebar.isMobileOpen()"
      [class.-translate-x-full]="!sidebar.isMobileOpen()"
      [style.width.px]="asideWidth()"
      aria-label="Admin navigation"
      [attr.aria-hidden]="mobileClosed() || null"
      [attr.inert]="mobileClosed() ? '' : null"
    >
      <div class="admin-topbar flex items-center gap-3 px-4">
        <a
          routerLink="/admin"
          (click)="sidebar.closeMobileSidebar()"
          class="flex min-w-0 flex-1 items-center gap-3"
          [class.justify-center]="!showLabels()"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white"
            >{{ brand.letter }}</span
          >
          @if (showLabels()) {
            <div class="min-w-0">
              <p class="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
                {{ brand.name }}
              </p>
              <p class="truncate text-xs text-gray-500">{{ brand.tagline }}</p>
            </div>
          }
        </a>
        @if (!sidebar.isDesktop()) {
          <button
            type="button"
            (click)="sidebar.closeMobileSidebar()"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <app-icon name="x" [size]="20" />
          </button>
        }
      </div>

      <nav class="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
        @if (showLabels()) {
          <p class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Menu
          </p>
        }
        @for (item of navItems; track item.href) {
          <a
            [routerLink]="item.href"
            (click)="sidebar.closeMobileSidebar()"
            [title]="!showLabels() ? item.name : undefined"
            [attr.aria-current]="isActive(item.href) ? 'page' : null"
            [class]="navLinkClass(item.href)"
          >
            <app-icon [name]="item.icon" [size]="22" [class]="navIconClass(item.href)" />
            @if (showLabels()) {
              <span class="truncate">{{ item.name }}</span>
            }
          </a>
        }
      </nav>

      <div class="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
        @if (externalSite) {
          <a
            [href]="siteUrl"
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8"
            [class.justify-center]="!showLabels()"
            [title]="!showLabels() ? 'View site' : undefined"
          >
            <app-icon name="external-link" [size]="20" class="shrink-0" />
            @if (showLabels()) {
              <span>View site</span>
            }
          </a>
        } @else {
          <a
            [routerLink]="siteUrl"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8"
            [class.justify-center]="!showLabels()"
            [title]="!showLabels() ? 'View site' : undefined"
          >
            <app-icon name="external-link" [size]="20" class="shrink-0" />
            @if (showLabels()) {
              <span>View site</span>
            }
          </a>
        }

        @if (sidebar.isDesktop()) {
          <button
            type="button"
            (click)="sidebar.toggleSidebar()"
            class="mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
            [class.justify-center]="!showLabels()"
            [attr.aria-label]="sidebar.isExpanded() ? 'Collapse sidebar' : 'Expand sidebar'"
          >
            <app-icon
              [name]="sidebar.isExpanded() ? 'chevron-left' : 'chevron-right'"
              [size]="20"
              class="shrink-0"
            />
            @if (showLabels() && sidebar.isExpanded()) {
              <span>Collapse</span>
            }
          </button>
        }
      </div>
    </aside>
  `,
})
export class AdminSidebarComponent implements OnInit {
  readonly sidebar = inject(SidebarService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly brand = adminConfig.brand;
  readonly navItems = adminNavItems;
  readonly siteUrl = this.brand.siteUrl || '/';
  readonly externalSite = isExternalUrl(this.siteUrl);

  private currentPath = normalizePathname(this.router.url.split('?')[0] ?? '/');

  readonly showLabels = computed(
    () => !this.sidebar.isDesktop() || this.sidebar.isExpanded() || this.sidebar.isMobileOpen(),
  );

  readonly mobileClosed = computed(() => !this.sidebar.isDesktop() && !this.sidebar.isMobileOpen());

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.currentPath = normalizePathname(e.urlAfterRedirects.split('?')[0] ?? '/');
        this.sidebar.closeMobileSidebar();
      });
  }

  asideWidth(): number {
    if (this.sidebar.isDesktop()) return this.sidebar.desktopWidth();
    return Math.min(320, SIDEBAR_WIDTH_EXPANDED);
  }

  isActive(href: string): boolean {
    return isAdminNavActive(this.currentPath, href);
  }

  navLinkClass(href: string): string {
    const base =
      'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40';
    const state = this.isActive(href)
      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8';
    const layout = this.showLabels() ? '' : 'justify-center px-0';
    return `${base} ${state} ${layout}`;
  }

  navIconClass(href: string): string {
    return this.isActive(href)
      ? 'shrink-0 text-white'
      : 'shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-400';
  }
}
