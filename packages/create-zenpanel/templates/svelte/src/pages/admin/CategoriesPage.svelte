<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminCategories } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Categories" resourceLabel="category" items={adminCategories} />
