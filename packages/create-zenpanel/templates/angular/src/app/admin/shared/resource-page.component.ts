import { Component, Input } from '@angular/core';
import type { AdminResource } from '@/app/lib/admin-data/resources';

@Component({
  selector: 'app-resource-page',
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      @if (description) {
        <p class="text-sm text-gray-500">{{ description }}</p>
      }
      <div class="admin-card overflow-hidden">
        <div
          class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800"
        >
          {{ title }}
        </div>
        @if (items.length === 0) {
          <p class="px-4 py-10 text-center text-sm text-gray-500">
            No {{ title.toLowerCase() }} yet. Connect your API to populate this list.
          </p>
        } @else {
          <ul class="divide-y divide-gray-100 dark:divide-gray-800">
            @for (item of items; track item.id) {
              <li class="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  @if (item.meta) {
                    <p class="text-xs text-gray-500">{{ item.meta }}</p>
                  }
                </div>
                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize dark:bg-white/10">{{
                  item.status
                }}</span>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
})
export class ResourcePageComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() items: AdminResource[] = [];
}
