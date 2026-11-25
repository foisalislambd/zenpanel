import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { matchAdminNavItem } from '@/app/core/admin-nav';
import { IconComponent } from '@/app/shared/icon.component';

/** Page title with breadcrumbs (Dashboard › Section › Page). Project actions with `[actions]`. */
@Component({
  selector: 'app-admin-page-header',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" class="mb-1.5">
          <ol class="flex flex-wrap items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <li>
              <a routerLink="/admin" class="rounded hover:text-gray-900 dark:hover:text-white">Dashboard</a>
            </li>
            @if (section() && section() !== 'Overview') {
              <app-icon name="chevron-right" [size]="14" class="opacity-60" />
              <li>{{ section() }}</li>
            }
            <app-icon name="chevron-right" [size]="14" class="opacity-60" />
            <li aria-current="page" class="text-gray-700 dark:text-gray-200">{{ title() }}</li>
          </ol>
        </nav>
        <h1 class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {{ title() }}
        </h1>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-2 empty:hidden"><ng-content select="[actions]" /></div>
    </div>
  `,
})
export class AdminPageHeaderComponent {
  readonly title = input.required<string>();
  private readonly router = inject(Router);
  readonly section = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.currentSection()),
    ),
    { initialValue: this.currentSection() },
  );

  private currentSection(): string | undefined {
    return matchAdminNavItem(this.router.url.split('?')[0] ?? '/')?.section;
  }
}
