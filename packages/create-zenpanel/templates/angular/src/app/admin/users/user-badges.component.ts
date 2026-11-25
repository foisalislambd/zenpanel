import { Component, input } from '@angular/core';
import type { PortalUserRow } from '@/app/lib/admin-api';
import { providerStyles } from '@/app/lib/admin-resources';

/** Provider + account status + verification badges for a user row. */
@Component({
  selector: 'app-user-badges',
  host: { class: 'contents' },
  template: `
    @if (provider()) {
      <span
        class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
        [class]="styles[user().authProvider] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800'"
        >{{ user().authProvider }}</span
      >
    }
    @if (status()) {
      @if (user().status === 'active') {
        <span
          class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
          >Active</span
        >
      } @else {
        <span
          class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]"
          >Banned</span
        >
      }
      @if (!user().emailVerified) {
        <span
          class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
          >Unverified</span
        >
      }
    }
  `,
})
export class UserBadgesComponent {
  readonly user = input.required<PortalUserRow>();
  readonly provider = input(true);
  readonly status = input(true);
  readonly styles = providerStyles;
}
