import { AdminUsersPage } from "@/components/admin/users/admin-users-page";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";
import { createResource, Show } from "solid-js";

export default function UsersPage() {
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
        <AdminUsersPage users={users() ?? []} />
      </Show>
    </Show>
  );
}
