<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminProjects } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Projects" resourceLabel="project" items={adminProjects} />
