<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminCategories } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Categories"
    resource-label="category"
    :items="adminCategories"
    search-placeholder="Search title, items..."
    meta-label="Items"
    :status-labels="{ published: 'Visible', draft: 'Hidden' }"
  />
</template>
