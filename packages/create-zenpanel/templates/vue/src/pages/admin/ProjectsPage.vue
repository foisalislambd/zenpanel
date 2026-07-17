<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminProjects } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage title="Projects" resource-label="project" :items="adminProjects" />
</template>
