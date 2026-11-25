import { Component, computed, inject, input } from '@angular/core';
import { Location, NgTemplateOutlet } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '@/app/shared/icon.component';

/** 404 page - `variant: 'admin'` (route data) renders inside the dashboard shell. */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, NgTemplateOutlet, IconComponent],
  template: `
    <ng-template #body>
      <div class="mx-auto flex max-w-md flex-col items-center text-center">
        <span
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400"
        >
          <app-icon name="compass" [size]="28" />
        </span>
        <p class="mt-6 text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">Page not found</h1>
        <p class="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          We couldn’t find
          <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs break-all text-gray-700 dark:bg-white/10 dark:text-gray-200">{{
            path()
          }}</code
          >. It may have been moved, or the link is incorrect.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" class="admin-btn admin-btn-secondary" (click)="location.back()">
            <app-icon name="arrow-left" [size]="16" />
            Go back
          </button>
          <a [routerLink]="inAdmin() ? '/admin' : '/'" class="admin-btn admin-btn-primary">
            <app-icon name="layout-dashboard" [size]="16" />
            {{ inAdmin() ? 'Back to dashboard' : 'Back to home' }}
          </a>
        </div>
      </div>
    </ng-template>
    @if (inAdmin()) {
      <div class="admin-content admin-card px-6 py-16 sm:py-24"><ng-container [ngTemplateOutlet]="body" /></div>
    } @else {
      <main class="admin-shell flex min-h-dvh items-center justify-center px-6 py-16 dark:bg-gray-950">
        <ng-container [ngTemplateOutlet]="body" />
      </main>
    }
  `,
})
export class NotFoundPageComponent {
  /** Bound from route data via `withComponentInputBinding()`. */
  readonly variant = input<'admin' | 'page'>('page');
  readonly location = inject(Location);
  private readonly router = inject(Router);
  readonly inAdmin = computed(() => this.variant() === 'admin');
  readonly path = computed(() => this.router.url.split(/[?#]/)[0]);
}
