import { Component, input } from '@angular/core';
import type { AdminResourceStatus } from '@/app/lib/admin-data/resources';
import { resourceStatusStyles } from '@/app/lib/admin-resources';

@Component({
  selector: 'app-resource-status-badge',
  template: `<span
    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
    [class]="styles[status()]"
    >{{ label() }}</span
  >`,
})
export class ResourceStatusBadgeComponent {
  readonly status = input.required<AdminResourceStatus>();
  readonly label = input.required<string>();
  readonly styles = resourceStatusStyles;
}
