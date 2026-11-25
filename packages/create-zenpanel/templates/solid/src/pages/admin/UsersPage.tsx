import { AdminUsersPage } from "@/components/admin/users/admin-users-page";
import { AdminErrorState } from "@/components/admin/ui/admin-error-state";
import { AdminTableSkeleton } from "@/components/admin/ui/admin-skeletons";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";
import { createResource, Show } from "solid-js";

export default function UsersPage() {
  const [users, { refetch }] = createResource<PortalUserRow[]>(async () => {
    const res = await previewFetchUsers();
    return res.users;
  });

  return (
    <Show when={!users.loading} fallback={<AdminTableSkeleton label="Loading users…" />}>
      <Show
        when={!users.error}
        fallback={
          <div class="admin-content">
            <AdminErrorState
              title="Couldn't load users"
              message={users.error instanceof Error ? users.error.message : "Failed to load users"}
              onRetry={() => void refetch()}
            />
          </div>
        }
      >
        <AdminUsersPage users={users() ?? []} />
      </Show>
    </Show>
  );
}
