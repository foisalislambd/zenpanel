import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/app/core/admin.config';
import { AdminChatPanelService } from '@/app/core/admin-chat-panel.service';
import { SidebarService } from '@/app/core/sidebar.service';
import { normalizePathname } from '@/app/core/admin-nav';
import { AdminChatPanelComponent } from '@/app/admin/chat/admin-chat-panel.component';
import { AdminChatRouteBridgeComponent } from '@/app/admin/chat/admin-chat-route-bridge.component';
import { AdminBackdropComponent } from './admin-backdrop.component';
import { AdminHeaderComponent } from './admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  selector: 'app-admin-shell',
  imports: [
    RouterOutlet,
    AdminChatRouteBridgeComponent,
    AdminSidebarComponent,
    AdminBackdropComponent,
    AdminHeaderComponent,
    AdminChatPanelComponent,
  ],
  template: `
    <app-admin-chat-route-bridge />
    <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
      <div
        class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
        [style.width.px]="sidebarWidth()"
        aria-hidden="true"
      ></div>

      <app-admin-sidebar />
      <app-admin-backdrop />

      <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <app-admin-header />
          <main
            class="admin-scrollbar min-h-0 flex-1"
            [class.overflow-hidden]="isFullBleedPage()"
            [class.overflow-y-auto]="!isFullBleedPage()"
            [class.overflow-x-hidden]="!isFullBleedPage()"
          >
            <div
              class="w-full"
              [class.flex]="isFullBleedPage()"
              [class.h-full]="isFullBleedPage()"
              [class.min-h-0]="isFullBleedPage()"
              [class.flex-col]="isFullBleedPage()"
              [class.px-0]="isFullBleedPage()"
              [class.px-4]="!isFullBleedPage()"
              [class.py-5]="!isFullBleedPage()"
              [class.sm:px-6]="!isFullBleedPage()"
              [class.sm:py-6]="!isFullBleedPage()"
              [class.lg:px-8]="!isFullBleedPage()"
            >
              <div class="w-full" [class.min-h-0]="isFullBleedPage()" [class.flex-1]="isFullBleedPage()">
                <router-outlet />
              </div>
            </div>
          </main>
        </div>

        @if (chatPushLayout()) {
          <app-admin-chat-panel [overlay]="false" />
        }
      </div>

      @if (chatOverlay()) {
        <app-admin-chat-panel [overlay]="true" />
      }
    </div>
  `,
})
export class AdminShellComponent {
  readonly sidebar = inject(SidebarService);
  readonly chat = inject(AdminChatPanelService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly currentPath = signal(normalizePathname(this.router.url.split('?')[0] ?? '/'));

  readonly isFullBleedPage = computed(() => this.currentPath() === '/admin/messages');

  readonly sidebarWidth = computed(() =>
    this.sidebar.isDesktop()
      ? this.sidebar.isExpanded()
        ? SIDEBAR_WIDTH_EXPANDED
        : SIDEBAR_WIDTH_COLLAPSED
      : 0,
  );

  readonly chatPushLayout = computed(
    () => this.chat.isOpen() && this.chat.isDesktop() && !this.isFullBleedPage(),
  );
  readonly chatOverlay = computed(
    () => this.chat.isOpen() && (this.isFullBleedPage() || !this.chat.isDesktop()),
  );

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.currentPath.set(normalizePathname(e.urlAfterRedirects.split('?')[0] ?? '/'));
      });
  }
}
