import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@/app/core/auth.service';

@Component({
  selector: 'app-account-settings',
  imports: [DatePipe],
  template: `
    <div class="admin-card admin-card-body space-y-6">
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Account</h3>
        <p class="mt-1 text-sm text-gray-500">Signed-in administrator</p>
      </div>

      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Username</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {{ auth.admin()?.username ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Email</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {{ auth.admin()?.email ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
          <dd class="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
            {{ auth.admin()?.role ?? '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {{ auth.admin()?.lastLoginAt ? (auth.admin()!.lastLoginAt | date: 'medium') : '—' }}
          </dd>
        </div>
      </dl>
    </div>
  `,
})
export class AccountSettingsComponent {
  readonly auth = inject(AuthService);
}
