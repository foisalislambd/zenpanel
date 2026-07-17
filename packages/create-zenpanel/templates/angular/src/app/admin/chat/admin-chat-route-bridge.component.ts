import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdminChatPanelService } from '@/app/core/admin-chat-panel.service';
import { matchAdminNavItem, normalizePathname } from '@/app/core/admin-nav';

/**
 * Sets a default page label for the AI panel based on the current route.
 * Page-specific components (e.g. dashboard) own `/admin` and override this.
 */
@Component({
  selector: 'app-admin-chat-route-bridge',
  template: '',
})
export class AdminChatRouteBridgeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly chat = inject(AdminChatPanelService);
  private readonly destroyRef = inject(DestroyRef);
  private ownedPath: string | null = null;

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

    // Dashboard registers rich context via its own component — do not overwrite it.
    if (path === '/admin') {
      this.ownedPath = null;
      return;
    }

    const nav = matchAdminNavItem(path);

    this.ownedPath = path;
    this.chat.setPageContext({
      pageId: path,
      title: nav?.name ?? 'Admin',
      description:
        nav?.description ??
        `Ask me anything about ${nav?.name ?? 'this page'} — analyze data, get suggestions, or plan your next steps.`,
      route: path,
      getSnapshot: () => ({ route: path }),
    });
  }
}
