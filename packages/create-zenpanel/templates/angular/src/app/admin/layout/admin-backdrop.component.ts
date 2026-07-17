import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { SidebarService } from '@/app/core/sidebar.service';

@Component({
  selector: 'app-admin-backdrop',
  template: `
    @if (visible()) {
      <button
        type="button"
        class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden"
        (click)="sidebar.closeMobileSidebar()"
        aria-label="Close navigation"
      ></button>
    }
  `,
})
export class AdminBackdropComponent implements OnInit {
  readonly sidebar = inject(SidebarService);
  private readonly destroyRef = inject(DestroyRef);

  readonly visible = computed(() => this.sidebar.isMobileOpen() && !this.sidebar.isDesktop());

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.visible()) {
      this.sidebar.closeMobileSidebar();
    }
  };

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
    this.destroyRef.onDestroy(() => document.removeEventListener('keydown', this.onKeyDown));
  }
}
