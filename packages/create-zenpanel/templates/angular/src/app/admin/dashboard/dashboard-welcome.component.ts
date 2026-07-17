import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/auth.service';
import { adminConfig } from '@/app/core/admin.config';
import { IconComponent } from '@/app/shared/icon.component';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

@Component({
  selector: 'app-dashboard-welcome',
  host: { class: 'block w-full' },
  imports: [RouterLink, IconComponent],
  template: `
    <div
      class="relative overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-5 sm:p-6 lg:p-8 dark:border-brand-500/20"
    >
      <div
        class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-300/20 blur-2xl"
        aria-hidden="true"
      ></div>

      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <p class="text-sm font-medium text-brand-100">{{ greeting }}, {{ auth.admin()?.username ?? brand.name }}</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard overview
          </h1>
          <p class="mt-2 flex items-center gap-2 text-sm text-brand-100/90">
            <app-icon name="calendar-days" [size]="16" class="shrink-0" />
            {{ today }}
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap gap-2">
          <a
            routerLink="/admin/projects"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <app-icon name="folder-kanban" [size]="16" class="shrink-0 text-brand-600" />
            <span class="text-brand-600">Manage projects</span>
          </a>
          <a
            routerLink="/admin/settings"
            class="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <app-icon name="settings" [size]="16" />
            Settings
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardWelcomeComponent {
  readonly auth = inject(AuthService);
  readonly brand = adminConfig.brand;
  readonly greeting = getGreeting();
  readonly today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
