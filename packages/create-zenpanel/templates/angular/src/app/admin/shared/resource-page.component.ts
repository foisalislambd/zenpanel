import { Component, Input } from '@angular/core';
import type { AdminResource } from '@/app/lib/admin-data/resources';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { ResourceListComponent } from './resource-list.component';

@Component({
  selector: 'app-resource-page',
  imports: [AdminBreadcrumbsComponent, AdminPageHeaderComponent, ResourceListComponent],
  template: `
    <div class="admin-content space-y-6">
      <app-admin-breadcrumbs />
      <app-admin-page-header [title]="title" />
      <app-resource-list [items]="items" [resourceLabel]="resourceLabel" />
    </div>
  `,
})
export class ResourcePageComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) resourceLabel!: string;
  @Input() items: AdminResource[] = [];
}
