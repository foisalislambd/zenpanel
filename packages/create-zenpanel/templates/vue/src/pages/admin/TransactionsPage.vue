<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminTransactions } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Transactions"
    resource-label="transaction"
    :items="adminTransactions"
    search-placeholder="Search title, amount, reference..."
    meta-label="Amount"
    :status-labels="{ published: 'Settled', draft: 'Pending', archived: 'Reversed' }"
  />
</template>
