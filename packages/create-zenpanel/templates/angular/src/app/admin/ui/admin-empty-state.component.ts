import { Component, Input } from '@angular/core';
import { IconComponent } from '@/app/shared/icon.component';

@Component({
  selector: 'app-admin-empty-state',
  imports: [IconComponent],
  template: `
    <div class="flex flex-col items-center px-6 py-16 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
        <app-icon [name]="icon" [size]="28" class="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
      <ng-content select="[action]" />
    </div>
  `,
})
export class AdminEmptyStateComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
