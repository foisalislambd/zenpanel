import { Component, inject, Input } from '@angular/core';
import { ThemeService } from '@/app/core/theme.service';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-theme-toggle',
  imports: [IconComponent],
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
      [class]="extraClass"
      [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="20" />
    </button>
  `,
})
export class AdminThemeToggleComponent {
  readonly theme = inject(ThemeService);
  @Input() extraClass = '';
}
