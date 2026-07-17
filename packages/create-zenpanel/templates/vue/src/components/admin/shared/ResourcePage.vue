<script setup lang="ts">
import ResourceList from "@/components/admin/shared/ResourceList.vue";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.vue";
import type { AdminResource } from "@/lib/admin-data/resources";

defineProps<{
  title: string;
  resourceLabel: string;
  items: AdminResource[];
}>();
</script>

<template>
  <div class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader :title="title" />
    <ResourceList :items="items" :resource-label="resourceLabel" />
  </div>
</template>
