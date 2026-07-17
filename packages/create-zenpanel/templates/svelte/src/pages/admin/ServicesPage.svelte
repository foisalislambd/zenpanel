<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminServices } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Services" resourceLabel="service" items={adminServices} />
