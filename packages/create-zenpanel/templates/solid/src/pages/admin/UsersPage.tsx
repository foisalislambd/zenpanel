import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";
import { createResource, Show } from "solid-js";

export default function AdminUsersPage() {
  const [users] = createResource<PortalUserRow[]>(async () => {
    const res = await previewFetchUsers();
    return res.users;
  });

  return (
    <Show when={!users.loading} fallback={<AdminLoading message="Loading users…" />}>
      <Show
        when={!users.error}
        fallback={
          <div class="admin-content">
            <div class="admin-card admin-card-body text-sm text-error-500">
              {users.error instanceof Error ? users.error.message : "Failed to load users"}
            </div>
          </div>
        }
      >
        <div class="admin-content space-y-6">
          <AdminBreadcrumbs />
          <AdminPageHeader title="Users" />
          <RecentUsersTable users={users() ?? []} href={null} />
        </div>
      </Show>
    </Show>
  );
}
