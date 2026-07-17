import { Component, signal } from '@angular/core';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AccountSettingsComponent } from '@/app/admin/settings/account-settings.component';

type TabId = 'account' | 'site';

const tabs: { id: TabId; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'site', label: 'Branding' },
];

@Component({
  selector: 'app-settings-page',
  imports: [AdminBreadcrumbsComponent, AdminPageHeaderComponent, AccountSettingsComponent],
  template: `
    <div class="admin-content space-y-6">
      <app-admin-breadcrumbs />
      <app-admin-page-header title="Settings" />

      <div
        role="tablist"
        aria-label="Settings sections"
        class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800"
      >
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            role="tab"
            [id]="'settings-tab-' + tab.id"
            [attr.aria-selected]="activeTab() === tab.id"
            [attr.aria-controls]="'settings-panel-' + tab.id"
            [attr.tabindex]="activeTab() === tab.id ? 0 : -1"
            (click)="activeTab.set(tab.id)"
            class="rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            [class]="
              activeTab() === tab.id
                ? 'bg-brand-500 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8'
            "
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <div
        role="tabpanel"
        id="settings-panel-account"
        aria-labelledby="settings-tab-account"
        [hidden]="activeTab() !== 'account'"
      >
        <app-account-settings />
      </div>

      <div
        role="tabpanel"
        id="settings-panel-site"
        aria-labelledby="settings-tab-site"
        [hidden]="activeTab() !== 'site'"
        class="admin-card admin-card-body space-y-3"
      >
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Branding & navigation</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Edit
          <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10"
            >src/app/core/admin.config.ts</code
          >
          to customize the panel name, logo letter, sidebar links, and login page copy.
        </p>
      </div>
    </div>
  `,
})
export class SettingsPageComponent {
  readonly tabs = tabs;
  readonly activeTab = signal<TabId>('account');
}
