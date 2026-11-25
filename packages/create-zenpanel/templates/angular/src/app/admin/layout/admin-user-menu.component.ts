import { Component, DestroyRef, ElementRef, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/auth.service';
import { activateMenu } from '@/app/lib/dialog';
import { IconComponent } from '@/app/shared/icon.component';

const itemClass =
  'flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5';

@Component({
  selector: 'app-admin-user-menu',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="relative" #containerRef>
      <button
        #triggerRef
        type="button"
        (click)="open.set(!open())"
        class="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pr-2 pl-1 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
        [attr.aria-controls]="open() ? 'zp-account-menu' : null"
        [attr.aria-label]="'Account menu for ' + (auth.admin()?.username ?? 'admin')"
      >
        <span
          class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-semibold text-white"
          >{{ initials() }}</span
        >
        <span class="hidden min-w-0 text-left md:block">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-white">{{
            auth.admin()?.username ?? 'admin'
          }}</span>
        </span>
        <app-icon
          name="chevron-down"
          [size]="16"
          class="hidden shrink-0 text-gray-500 transition md:block"
          [class.rotate-180]="open()"
        />
      </button>

      @if (open()) {
        <div
          #menuRef
          id="zp-account-menu"
          role="menu"
          aria-label="Account"
          class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ auth.admin()?.username }}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ auth.admin()?.email }}</p>
          </div>
          <a routerLink="/admin/settings" role="menuitem" (click)="open.set(false)" [class]="itemClass">
            <app-icon name="settings" [size]="16" />
            Account settings
          </a>
          <a
            routerLink="/admin/settings"
            [queryParams]="{ tab: 'preferences' }"
            role="menuitem"
            (click)="open.set(false)"
            [class]="itemClass"
          >
            <app-icon name="sliders-horizontal" [size]="16" />
            Preferences
          </a>
          <div class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator"></div>
          <button
            type="button"
            role="menuitem"
            (click)="handleLogout()"
            class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10"
          >
            <app-icon name="log-out" [size]="16" />
            Sign out
          </button>
        </div>
      }
    </div>
  `,
})
export class AdminUserMenuComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly itemClass = itemClass;

  readonly open = signal(false);

  private readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('containerRef');
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('triggerRef');
  private readonly menuRef = viewChild<ElementRef<HTMLDivElement>>('menuRef');

  private readonly onDocClick = (e: MouseEvent) => {
    const container = this.containerRef()?.nativeElement;
    if (container && !container.contains(e.target as Node)) this.open.set(false);
  };

  constructor() {
    effect((onCleanup) => {
      const menu = this.menuRef()?.nativeElement;
      if (!menu) return;
      const release = activateMenu(menu, (restoreFocus) => {
        this.open.set(false);
        if (restoreFocus) this.triggerRef()?.nativeElement.focus();
      });
      onCleanup(release);
    });
  }

  ngOnInit(): void {
    document.addEventListener('mousedown', this.onDocClick);
    this.destroyRef.onDestroy(() => document.removeEventListener('mousedown', this.onDocClick));
  }

  initials(): string {
    return (this.auth.admin()?.username || 'A').charAt(0).toUpperCase();
  }

  handleLogout(): void {
    this.open.set(false);
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login', { replaceUrl: true });
  }
}
