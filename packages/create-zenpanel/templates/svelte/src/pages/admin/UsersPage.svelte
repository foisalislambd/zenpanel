<script lang="ts">
  import AdminUsersPage from "@/components/admin/users/AdminUsersPage.svelte";
  import AdminLoading from "@/components/admin/ui/AdminLoading.svelte";
  import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

  let users = $state<PortalUserRow[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    loading = true;
    error = null;
    previewFetchUsers()
      .then((res) => {
        users = res.users;
      })
      .catch((err) => {
        error = err instanceof Error ? err.message : "Failed to load users";
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
      {error}
    </div>
  </div>
{:else}
  <AdminUsersPage {users} />
{/if}
