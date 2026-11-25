import { Component, input } from '@angular/core';

/**
 * Two-column settings section. Use on a `<form>` or `<div>`:
 * `<form app-settings-card title="…" description="…">`. Project footer buttons with `settingsFooter`.
 */
@Component({
  selector: 'form[app-settings-card], div[app-settings-card]',
  host: { class: 'admin-card block overflow-hidden' },
  template: `
    <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
      <div>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ title() }}</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ description() }}</p>
      </div>
      <div class="min-w-0 space-y-4"><ng-content /></div>
    </div>
    <div
      class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 empty:hidden md:px-6 dark:border-gray-800 dark:bg-white/[0.02]"
    ><ng-content select="[settingsFooter]" /></div>
  `,
})
export class SettingsCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
