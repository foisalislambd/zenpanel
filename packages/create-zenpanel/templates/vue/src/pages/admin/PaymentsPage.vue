<script setup lang="ts">
import ResourcePage from "@/components/admin/shared/ResourcePage.vue";
import { adminPayments } from "@/lib/admin-data/resources";
</script>

<template>
  <ResourcePage title="Payments" resource-label="payment" :items="adminPayments" />
</template>
