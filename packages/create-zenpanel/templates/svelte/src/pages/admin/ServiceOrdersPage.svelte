<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminServiceOrders } from "@/lib/admin-data/resources";
</script>

<ResourcePage
  title="Service orders"
  resourceLabel="order"
  items={adminServiceOrders}
  searchPlaceholder="Search customer, service, order ID..."
  titleLabel="Order"
  metaLabel="Amount"
  statusLabels={{ published: "Completed", draft: "Pending", archived: "Refunded" }}
/>
