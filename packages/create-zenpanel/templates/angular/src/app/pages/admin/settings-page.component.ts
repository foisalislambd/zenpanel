import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { adminConfig } from '@/app/core/admin.config';
import { AuthService } from '@/app/core/auth.service';

@Component({
  selector: 'app-settings-page',
  imports: [DatePipe],
  template: `
    <div class="space-y-5">
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Settings</h1>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium"
          [class.bg-brand-500]="tab() === 'account'"
          [class.text-white]="tab() === 'account'"
          [class.text-gray-600]="tab() !== 'account'"
          (click)="tab.set('account')"
        >
          Account
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium"
          [class.bg-brand-500]="tab() === 'branding'"
          [class.text-white]="tab() === 'branding'"
          [class.text-gray-600]="tab() !== 'branding'"
          (click)="tab.set('branding')"
        >
          Branding
        </button>
      </div>

      @if (tab() === 'account') {
        <div class="admin-card admin-card-body space-y-4">
          <div>
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Account</h2>
            <p class="text-sm text-gray-500">Signed-in administrator</p>
          </div>
          <dl class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Username</dt>
              <dd class="mt-1 font-medium">{{ auth.admin()?.username }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Email</dt>
              <dd class="mt-1 font-medium">{{ auth.admin()?.email }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
              <dd class="mt-1 font-medium capitalize">{{ auth.admin()?.role }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
              <dd class="mt-1 font-medium">
                {{ auth.admin()?.lastLoginAt | date: 'medium' }}
              </dd>
            </div>
          </dl>
        </div>
      } @else {
        <div class="admin-card admin-card-body space-y-3">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Branding</h2>
          <p class="text-sm text-gray-500">
            Edit
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10"
              >src/app/core/admin.config.ts</code
            >
            to customize the panel name, logo letter, sidebar links, and login page copy.
          </p>
          <p class="text-sm">
            <span class="font-medium">{{ brand.name }}</span> — {{ brand.tagline }}
          </p>
        </div>
      }
    </div>
  `,
})
export class SettingsPageComponent {
  readonly auth = inject(AuthService);
  readonly brand = adminConfig.brand;
  readonly tab = signal<'account' | 'branding'>('account');
}
