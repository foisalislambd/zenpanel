import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AccountSettingsComponent } from '@/app/admin/settings/account-settings.component';
import { PreferencesSettingsComponent } from '@/app/admin/settings/preferences-settings.component';
import { SecuritySettingsComponent } from '@/app/admin/settings/security-settings.component';
import { SettingsCardComponent } from '@/app/admin/settings/settings-card.component';
import { nextTabIndex } from '@/app/lib/dialog';
import { SETTINGS_TABS, parseSettingsTab, type SettingsTabId } from '@/app/lib/preferences';

/** Settings with URL-synced tabs (`?tab=security`) and arrow-key navigation. */
@Component({
  selector: 'app-settings-page',
  imports: [
    AdminPageHeaderComponent,
    AccountSettingsComponent,
    SecuritySettingsComponent,
    PreferencesSettingsComponent,
    SettingsCardComponent,
  ],
  template: `
    <div class="admin-content space-y-6">
      <app-admin-page-header title="Settings" />

      <div
        role="tablist"
        aria-label="Settings sections"
        class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800"
        (keydown)="onKeyDown($event)"
      >
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            role="tab"
            [id]="'settings-tab-' + tab.id"
            [attr.aria-selected]="activeTab() === tab.id"
            [attr.aria-controls]="'settings-panel-' + tab.id"
            [attr.tabindex]="activeTab() === tab.id ? 0 : -1"
            class="-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
            [class]="
              activeTab() === tab.id
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            "
            (click)="select(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @for (tab of tabs; track tab.id) {
        <div
          role="tabpanel"
          [id]="'settings-panel-' + tab.id"
          [attr.aria-labelledby]="'settings-tab-' + tab.id"
          [hidden]="activeTab() !== tab.id"
          tabindex="0"
          class="focus:outline-none"
        >
          @if (activeTab() === tab.id) {
            @switch (tab.id) {
              @case ('account') {
                <app-account-settings />
              }
              @case ('security') {
                <app-security-settings />
              }
              @case ('preferences') {
                <app-preferences-settings />
              }
              @default {
                <div app-settings-card title="Branding & navigation" description="Panel name, logo letter, sidebar links and login copy.">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Edit
                    <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/app/core/admin.config.ts</code>
                    to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in
                    <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/styles.css</code>
                    (<code class="text-xs">--color-brand-*</code>).
                  </p>
                </div>
              }
            }
          }
        </div>
      }
    </div>
  `,
})
export class SettingsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly tabs = SETTINGS_TABS;

  private readonly tabParam = toSignal(this.route.queryParamMap.pipe(map((q) => q.get('tab'))), {
    initialValue: this.route.snapshot.queryParamMap.get('tab'),
  });
  readonly activeTab = computed(() => parseSettingsTab(this.tabParam()));

  select(id: SettingsTabId, focus = false): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: id === 'account' ? null : id },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    if (focus) setTimeout(() => document.getElementById(`settings-tab-${id}`)?.focus());
  }

  onKeyDown(e: KeyboardEvent): void {
    const index = SETTINGS_TABS.findIndex((t) => t.id === this.activeTab());
    const next = nextTabIndex(e.key, index, SETTINGS_TABS.length);
    if (next >= 0) {
      e.preventDefault();
      this.select(SETTINGS_TABS[next].id, true);
    }
  }
}
