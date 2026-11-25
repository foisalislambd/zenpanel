<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminServiceOrders } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Service orders"
    resource-label="order"
    :items="adminServiceOrders"
    search-placeholder="Search customer, service, order ID..."
    title-label="Order"
    meta-label="Amount"
    :status-labels="{ published: 'Completed', draft: 'Pending', archived: 'Refunded' }"
  />
</template>
