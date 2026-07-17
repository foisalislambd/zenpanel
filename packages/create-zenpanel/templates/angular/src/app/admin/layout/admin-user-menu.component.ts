import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/auth.service';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-user-menu',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="relative" #containerRef>
      <button
        #triggerRef
        type="button"
        (click)="toggle()"
        class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-1.5 pr-2 pl-1.5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white"
          >{{ initials() }}</span
        >
        <span class="hidden min-w-0 text-left md:block">
          <span class="block truncate text-sm font-medium text-gray-800 dark:text-white/90">{{
            auth.admin()?.username ?? 'admin'
          }}</span>
          <span class="block max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">{{
            auth.admin()?.email
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
          role="menu"
          class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
            <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
              {{ auth.admin()?.username }}
            </p>
            <p class="truncate text-xs text-gray-500">{{ auth.admin()?.email }}</p>
          </div>
          <a
            routerLink="/admin/settings"
            role="menuitem"
            (click)="open.set(false)"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
          >
            <app-icon name="settings" [size]="16" />
            Settings
          </a>
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

  readonly open = signal(false);

  @ViewChild('containerRef') private containerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('triggerRef') private triggerRef?: ElementRef<HTMLButtonElement>;

  private readonly onDocClick = (e: MouseEvent) => {
    if (this.containerRef && !this.containerRef.nativeElement.contains(e.target as Node)) {
      this.open.set(false);
    }
  };

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.open.set(false);
      this.triggerRef?.nativeElement.focus();
    }
  };

  ngOnInit(): void {
    document.addEventListener('mousedown', this.onDocClick);
    document.addEventListener('keydown', this.onKeyDown);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('mousedown', this.onDocClick);
      document.removeEventListener('keydown', this.onKeyDown);
    });
  }

  toggle(): void {
    this.open.update((v) => !v);
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
