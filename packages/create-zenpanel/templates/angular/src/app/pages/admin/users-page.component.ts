import { Component, OnInit, signal } from '@angular/core';
import { previewFetchUsers, type PortalUserRow } from '@/app/lib/admin-api';
import { AdminBreadcrumbsComponent } from '@/app/admin/ui/admin-breadcrumbs.component';
import { AdminLoadingComponent } from '@/app/admin/ui/admin-loading.component';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { RecentUsersTableComponent } from '@/app/admin/dashboard/recent-users-table.component';

@Component({
  selector: 'app-users-page',
  imports: [
    AdminBreadcrumbsComponent,
    AdminPageHeaderComponent,
    AdminLoadingComponent,
    RecentUsersTableComponent,
  ],
  template: `
    @if (loading()) {
      <app-admin-loading message="Loading users…" />
    } @else if (error()) {
      <div class="admin-content">
        <div class="admin-card admin-card-body text-sm text-error-500">{{ error() }}</div>
      </div>
    } @else {
      <div class="admin-content space-y-6">
        <app-admin-breadcrumbs />
        <app-admin-page-header title="Users" />
        <app-recent-users-table [users]="users()" [href]="null" />
      </div>
    }
  `,
})
export class UsersPageComponent implements OnInit {
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly users = signal<PortalUserRow[]>([]);

  ngOnInit(): void {
    previewFetchUsers()
      .then((res) => this.users.set(res.users))
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load users');
      })
      .finally(() => this.loading.set(false));
  }
}
