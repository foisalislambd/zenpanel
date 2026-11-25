<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminProducts } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Products"
    resource-label="product"
    :items="adminProducts"
    search-placeholder="Search title, price..."
    meta-label="Price"
    :status-labels="{ published: 'Active' }"
  />
</template>
