<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminProducts } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Products" resourceLabel="product" items={adminProducts} />
