import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { matchAdminNavItem, normalizePathname } from '@/app/core/admin-nav';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-breadcrumbs',
  imports: [RouterLink, IconComponent],
  template: `
    @if (pageTitle()) {
      <nav aria-label="Breadcrumb" class="mb-4">
        <ol class="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <a
              routerLink="/admin"
              class="inline-flex items-center gap-1 rounded-md transition hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:text-gray-200"
            >
              <app-icon name="home" [size]="14" />
              <span class="sr-only">Dashboard</span>
            </a>
          </li>
          <li aria-hidden="true">
            <app-icon name="chevron-right" [size]="14" class="text-gray-300 dark:text-gray-600" />
          </li>
          <li>
            <span class="font-medium text-gray-700 dark:text-gray-300" aria-current="page">
              {{ pageTitle() }}
            </span>
          </li>
        </ol>
      </nav>
    }
  `,
})
export class AdminBreadcrumbsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageTitle = signal<string | null>(null);

  ngOnInit(): void {
    this.apply(this.router.url);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.apply(e.urlAfterRedirects));
  }

  private apply(url: string): void {
    const path = normalizePathname(url.split('?')[0] ?? '/');
    this.pageTitle.set(path === '/admin' ? null : matchAdminNavItem(path)?.name ?? null);
  }
}
