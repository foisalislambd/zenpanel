<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminServiceOrders } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage title="Service orders" resource-label="order" :items="adminServiceOrders" />
</template>
