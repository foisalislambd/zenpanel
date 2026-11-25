<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminNewsletter } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage
    title="Newsletter"
    resource-label="subscriber"
    :items="adminNewsletter"
    search-placeholder="Search email, source..."
    title-label="Email"
    meta-label="Preferences"
    title-is-email
    :status-labels="{ published: 'Subscribed', draft: 'Pending', archived: 'Unsubscribed' }"
  />
</template>
