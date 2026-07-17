import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import {
  adminConfig,
  adminNavItems,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/app/core/admin.config';
import { AuthService } from '@/app/core/auth.service';
import { SidebarService } from '@/app/core/sidebar.service';
import { ThemeService } from '@/app/core/theme.service';
import { isAdminNavActive, isExternalUrl, normalizePathname } from '@/app/core/admin-nav';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, IconComponent],
  template: `
    <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
      <div
        class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
        [style.width.px]="sidebarWidth()"
        aria-hidden="true"
      ></div>

      <aside
        class="fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900"
        [class.translate-x-0]="sidebar.isMobileOpen()"
        [class.-translate-x-full]="!sidebar.isMobileOpen()"
        [class.lg:translate-x-0]="true"
        [style.width.px]="asideWidth()"
        aria-label="Admin navigation"
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
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Close menu"
              (click)="sidebar.closeMobileSidebar()"
            >
              <app-icon name="x" [size]="20" />
            </button>
          }
        </div>

        <nav class="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
          @if (showLabels()) {
            <p
              class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
            >
              Menu
            </p>
          }
          @for (item of navItems; track item.href) {
            <a
              [routerLink]="item.href"
              (click)="sidebar.closeMobileSidebar()"
              class="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              [class.bg-brand-500]="isActive(item.href)"
              [class.text-white]="isActive(item.href)"
              [class.hover:bg-brand-600]="isActive(item.href)"
              [class.dark:bg-brand-500]="isActive(item.href)"
              [title]="item.name"
            >
              <app-icon [name]="item.icon" [size]="22" />
              @if (showLabels()) {
                <span>{{ item.name }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer space-y-1 border-t border-gray-100 p-3 dark:border-gray-800">
          @if (externalSite) {
            <a
              [href]="siteUrl"
              class="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <app-icon name="external-link" [size]="22" />
              @if (showLabels()) {
                <span>View site</span>
              }
            </a>
          } @else {
            <a
              [routerLink]="siteUrl"
              (click)="sidebar.closeMobileSidebar()"
              class="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <app-icon name="external-link" [size]="22" />
              @if (showLabels()) {
                <span>View site</span>
              }
            </a>
          }
          @if (sidebar.isDesktop()) {
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              [class.justify-center]="!showLabels()"
              (click)="sidebar.toggleSidebar()"
            >
              <app-icon [name]="sidebar.isExpanded() ? 'chevron-left' : 'chevron-right'" [size]="22" />
              @if (showLabels()) {
                <span>Collapse</span>
              }
            </button>
          }
        </div>
      </aside>

      @if (sidebar.isMobileOpen() && !sidebar.isDesktop()) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          (click)="sidebar.closeMobileSidebar()"
        ></button>
      }

      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          class="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95"
        >
          <div class="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden dark:border-gray-800 dark:text-gray-400"
              aria-label="Open menu"
              (click)="sidebar.toggleMobileSidebar()"
            >
              <app-icon name="menu" [size]="20" />
            </button>

            <a routerLink="/admin" class="flex items-center gap-2 lg:hidden">
              <span
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white"
                >{{ brand.letter }}</span
              >
              <span class="text-base font-semibold text-gray-900 dark:text-white">{{
                brand.name
              }}</span>
            </a>

            <div class="hidden flex-1 lg:block lg:max-w-lg">
              <label class="relative block">
                <span
                  class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                >
                  <app-icon name="search" [size]="16" />
                </span>
                <input
                  type="search"
                  disabled
                  placeholder="Search — connect API to enable"
                  class="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-500 placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/5"
                  aria-label="Search"
                />
              </label>
            </div>

            <div class="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                class="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
                aria-label="AI assistant (preview)"
              >
                <app-icon name="panel-right-open" [size]="16" />
                <span class="hidden sm:inline">AI</span>
              </button>

              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
                [attr.aria-label]="
                  theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                "
                (click)="theme.toggle()"
              >
                <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="20" />
              </button>

              <div class="relative flex items-center gap-2">
                <button
                  type="button"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                  (click)="menuOpen = !menuOpen; $event.stopPropagation()"
                >
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
                    >{{ initials() }}</span
                  >
                  <span class="hidden text-left sm:block">
                    <span class="block text-sm font-medium text-gray-900 dark:text-white">{{
                      auth.admin()?.username
                    }}</span>
                    <span class="block text-xs text-gray-500">{{ auth.admin()?.email }}</span>
                  </span>
                  <app-icon name="chevron-down" [size]="16" class="text-gray-400" />
                </button>
                @if (menuOpen) {
                  <div
                    class="absolute top-full right-0 z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    (click)="$event.stopPropagation()"
                  >
                    <button
                      type="button"
                      class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      (click)="signOut()"
                    >
                      Sign out
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </header>

        <main class="admin-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div class="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly sidebar = inject(SidebarService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly brand = adminConfig.brand;
  readonly navItems = adminNavItems;
  readonly siteUrl = this.brand.siteUrl || '/';
  readonly externalSite = isExternalUrl(this.siteUrl);
  menuOpen = false;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showLabels = computed(
    () => !this.sidebar.isDesktop() || this.sidebar.isExpanded() || this.sidebar.isMobileOpen(),
  );

  readonly sidebarWidth = computed(() =>
    this.sidebar.isDesktop() ? this.sidebar.desktopWidth() : 0,
  );

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.sidebar.closeMobileSidebar();
        this.menuOpen = false;
      });

    const onDocClick = () => {
      if (this.menuOpen) this.menuOpen = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.menuOpen = false;
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    });
  }

  asideWidth(): number {
    if (this.sidebar.isDesktop()) return this.sidebar.desktopWidth();
    return Math.min(320, SIDEBAR_WIDTH_EXPANDED);
  }

  isActive(href: string): boolean {
    const path = normalizePathname(this.url().split('?')[0] ?? '/');
    return isAdminNavActive(path, href);
  }

  initials(): string {
    return (this.auth.admin()?.username || 'A').charAt(0).toUpperCase();
  }

  signOut(): void {
    this.menuOpen = false;
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login', { replaceUrl: true });
  }

  protected readonly SIDEBAR_WIDTH_COLLAPSED = SIDEBAR_WIDTH_COLLAPSED;
}
