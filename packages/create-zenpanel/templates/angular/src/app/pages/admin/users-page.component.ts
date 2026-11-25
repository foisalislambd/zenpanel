import { Component, OnInit, signal } from '@angular/core';
import { AdminUsersComponent } from '@/app/admin/users/admin-users.component';
import { AdminErrorStateComponent } from '@/app/admin/ui/admin-error-state.component';
import { AdminTableSkeletonComponent } from '@/app/admin/ui/admin-skeletons.component';
import { previewFetchUsers, type PortalUserRow } from '@/app/lib/admin-api';

/** Loads users, then renders the management UI (skeleton + retry while loading / on error). */
@Component({
  selector: 'app-users-page',
  imports: [AdminUsersComponent, AdminErrorStateComponent, AdminTableSkeletonComponent],
  template: `
    @if (loading()) {
      <app-admin-table-skeleton label="Loading users…" />
    } @else if (error()) {
      <div class="admin-content">
        <app-admin-error-state title="Couldn't load users" [message]="error()!" (retry)="load()" />
      </div>
    } @else {
      <app-admin-users [users]="users()" />
    }
  `,
})
export class UsersPageComponent implements OnInit {
  readonly users = signal<PortalUserRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await previewFetchUsers();
      this.users.set(res.users);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      this.loading.set(false);
    }
  }
}
