<script lang="ts">
  import ResourcePage from "@/components/admin/shared/ResourcePage.svelte";
  import { adminTransactions } from "@/lib/admin-data/resources";
</script>

<ResourcePage title="Transactions" resourceLabel="transaction" items={adminTransactions} />
