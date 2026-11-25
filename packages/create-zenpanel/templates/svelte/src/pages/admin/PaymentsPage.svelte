<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminPayments } from "@/lib/admin-data/resources";
</script>

<ResourcePage
  title="Payments"
  resourceLabel="payment"
  items={adminPayments}
  searchPlaceholder="Search title, provider, amount..."
  metaLabel="Amount"
  statusLabels={{ published: "Completed", draft: "Pending", archived: "Closed" }}
/>
