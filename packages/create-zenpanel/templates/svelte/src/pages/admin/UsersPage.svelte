<script lang="ts">
  import AdminUsersPage from "@/components/admin/users/AdminUsersPage.svelte";
  import AdminErrorState from "@/components/admin/ui/AdminErrorState.svelte";
  import AdminTableSkeleton from "@/components/admin/ui/AdminTableSkeleton.svelte";
  import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

  let users = $state<PortalUserRow[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let attempt = $state(0);

  $effect(() => {
    void attempt;
    let cancelled = false;
    loading = true;
    error = null;
    previewFetchUsers()
      .then((res) => {
        if (!cancelled) users = res.users;
      })
      .catch((err) => {
        if (!cancelled) error = err instanceof Error ? err.message : "Failed to load users";
      })
      .finally(() => {
        if (!cancelled) loading = false;
      });
    return () => {
      cancelled = true;
    };
  });
</script>

{#if loading}
  <AdminTableSkeleton label="Loading users…" />
{:else if error}
  <div class="admin-content">
    <AdminErrorState title="Couldn't load users" message={error} onRetry={() => attempt++} />
  </div>
{:else}
  <AdminUsersPage {users} />
{/if}
