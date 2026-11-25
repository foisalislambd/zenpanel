<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminServices } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Services"
    resource-label="service"
    :items="adminServices"
    search-placeholder="Search title, pricing..."
    meta-label="Pricing"
    :status-labels="{ published: 'Active' }"
  />
</template>
