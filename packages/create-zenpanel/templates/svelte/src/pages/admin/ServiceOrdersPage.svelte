<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminServiceOrders } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Service orders" resourceLabel="order" items={adminServiceOrders} />
