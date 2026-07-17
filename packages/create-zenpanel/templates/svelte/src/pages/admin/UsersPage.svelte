<script lang="ts">
  import RecentUsersTable from "@/components/admin/dashboard/RecentUsersTable.svelte";
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.svelte";
  import AdminLoading from "@/components/admin/ui/AdminLoading.svelte";
  import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

  let users = $state<PortalUserRow[] | null>(null);
  let loading = $state(true);
  let error = $state<unknown>(null);

  $effect(() => {
    loading = true;
    error = null;
    previewFetchUsers()
      .then((res) => {
        users = res.users;
      })
      .catch((err) => {
        error = err;
      })
      .finally(() => {
        loading = false;
      });
  });
</script>

{#if loading}
  <AdminLoading message="Loading users…" />
{:else if error}
  <div class="admin-content">
    <div class="admin-card admin-card-body text-sm text-error-500">
      {error instanceof Error ? error.message : "Failed to load users"}
    </div>
  </div>
{:else}
  <div class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader title="Users" />
    <RecentUsersTable users={users ?? []} href={null} />
  </div>
{/if}
