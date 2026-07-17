<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminBlogPosts } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage title="Blog" resource-label="post" :items="adminBlogPosts" />
</template>
