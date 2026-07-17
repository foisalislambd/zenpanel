import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { adminConfig } from '@/app/core/admin.config';
import { AuthService } from '@/app/core/auth.service';
import { ThemeService } from '@/app/core/theme.service';
import { isExternalUrl } from '@/app/core/admin-nav';
import { IconComponent } from '@/app/shared/icon.component';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink, IconComponent],
  template: `
    <div class="admin-shell relative grid min-h-dvh w-full bg-white lg:grid-cols-2 dark:bg-gray-950">
      <div class="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          [attr.aria-label]="
            theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          "
          (click)="theme.toggle()"
        >
          <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="20" />
        </button>
      </div>

      <div class="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-16">
        <div class="mx-auto w-full max-w-[400px]">
          @if (externalSite) {
            <a
              [href]="siteUrl"
              class="inline-flex text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400"
              >← Back to site</a
            >
          } @else {
            <a
              routerLink="/"
              class="inline-flex text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400"
              >← Back to site</a
            >
          }

          <div class="mt-8 lg:mt-10">
            <div
              class="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white lg:hidden"
            >
              {{ brand.letter }}
            </div>
            <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
              Sign in
            </h1>
            <p class="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Preview UI — credentials are prefilled. Click sign in to open the dashboard.
            </p>
          </div>

          <form class="mt-8 space-y-5" (ngSubmit)="onSubmit()">
            <div>
              <label for="admin-username" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Username</label
              >
              <div class="relative">
                <span class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                  <app-icon name="user" [size]="16" />
                </span>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  [(ngModel)]="username"
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label for="admin-password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Password</label
              >
              <div class="relative">
                <span class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                  <app-icon name="lock" [size]="16" />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  autocomplete="current-password"
                  [(ngModel)]="password"
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white py-2 pr-11 pl-10 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  class="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                  (click)="showPassword.set(!showPassword())"
                >
                  <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="16" />
                </button>
              </div>
            </div>

            @if (error()) {
              <p class="text-sm text-error-500">{{ error() }}</p>
            }

            <button
              type="submit"
              class="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-60"
              [disabled]="submitting()"
            >
              {{ submitting() ? 'Signing in…' : 'Sign in to dashboard' }}
            </button>
          </form>

          <p class="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            UI preview only — no real authentication.
          </p>
        </div>
      </div>

      <aside
        class="relative hidden min-h-dvh flex-col items-center justify-center overflow-hidden bg-brand-950 px-8 py-12 text-center sm:px-10 lg:flex"
      >
        <div class="pointer-events-none absolute inset-0">
          <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/35 blur-3xl"></div>
          <div class="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl"></div>
        </div>
        <div class="relative z-10 w-full max-w-md">
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg shadow-brand-500/25 sm:h-16 sm:w-16 sm:text-2xl"
          >
            {{ brand.letter }}
          </div>
          <h2 class="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {{ brand.name }}
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-brand-100/90 sm:text-base">
            {{ brand.loginDescription }}
          </p>
          <ul class="mt-8 space-y-3 text-left text-sm text-brand-100/85">
            @for (item of brand.loginFeatures; track item) {
              <li class="flex items-center gap-3">
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-200"
                  >✓</span
                >
                {{ item }}
              </li>
            }
          </ul>
        </div>
      </aside>
    </div>
  `,
})
export class LoginPageComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  readonly brand = adminConfig.brand;
  readonly siteUrl = this.brand.siteUrl || '/';
  readonly externalSite = isExternalUrl(this.siteUrl);

  username = DEMO_USERNAME;
  password = DEMO_PASSWORD;
  readonly showPassword = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    this.error.set(null);
    this.submitting.set(true);
    try {
      if (this.password !== DEMO_PASSWORD) {
        this.error.set('Invalid credentials. Use admin / admin for the preview.');
        return;
      }
      await this.auth.login(this.username.trim() || DEMO_USERNAME);
      await this.router.navigateByUrl('/admin', { replaceUrl: true });
    } finally {
      this.submitting.set(false);
    }
  }
}
