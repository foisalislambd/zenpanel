<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminNewsletter } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Newsletter" resourceLabel="subscriber" items={adminNewsletter} />
