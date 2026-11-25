<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminPayments } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Payments"
    resource-label="payment"
    :items="adminPayments"
    search-placeholder="Search title, provider, amount..."
    meta-label="Amount"
    :status-labels="{ published: 'Completed', draft: 'Pending', archived: 'Closed' }"
  />
</template>
