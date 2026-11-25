import { Component, inject, signal } from '@angular/core';
import { ThemeService, type ThemePreference } from '@/app/core/theme.service';
import { ToastService } from '@/app/core/toast.service';
import { NOTIFICATIONS, readNotificationPrefs, writeNotificationPrefs, type NotificationId } from '@/app/lib/preferences';
import { IconComponent } from '@/app/shared/icon.component';
import { SettingsCardComponent } from './settings-card.component';

const themes: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
];

/** Theme picker and email notification switches (stored on this device). */
@Component({
  selector: 'app-preferences-settings',
  host: { class: 'block space-y-6' },
  imports: [SettingsCardComponent, IconComponent],
  template: `
    <div app-settings-card title="Appearance" description="Choose how the admin panel looks on this device.">
      <div role="radiogroup" aria-label="Theme" class="grid grid-cols-3 gap-3 sm:max-w-md">
        @for (t of themes; track t.value) {
          <button
            type="button"
            role="radio"
            [attr.aria-checked]="themeService.preference() === t.value"
            class="flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition-colors"
            [class]="
              themeService.preference() === t.value
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5'
            "
            (click)="themeService.setTheme(t.value)"
          >
            <app-icon [name]="t.icon" [size]="20" />
            {{ t.label }}
          </button>
        }
      </div>
    </div>

    <div app-settings-card title="Notifications" description="Pick which emails you want to receive.">
      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        @for (n of notifications; track n.id) {
          <li class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div class="min-w-0">
              <p [id]="'notify-' + n.id" class="text-sm font-medium text-gray-900 dark:text-white">{{ n.label }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ n.description }}</p>
            </div>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="prefs()[n.id]"
              [attr.aria-labelledby]="'notify-' + n.id"
              class="admin-switch"
              (click)="toggle(n.id)"
            ></button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class PreferencesSettingsComponent {
  readonly themeService = inject(ThemeService);
  private readonly toaster = inject(ToastService);
  readonly themes = themes;
  readonly notifications = NOTIFICATIONS;
  readonly prefs = signal(readNotificationPrefs());

  toggle(id: NotificationId): void {
    const next = { ...this.prefs(), [id]: !this.prefs()[id] };
    this.prefs.set(next);
    writeNotificationPrefs(next);
    const item = NOTIFICATIONS.find((n) => n.id === id)!;
    this.toaster.toast({ variant: 'info', title: `${item.label} ${next[id] ? 'on' : 'off'}`, duration: 2500 });
  }
}
