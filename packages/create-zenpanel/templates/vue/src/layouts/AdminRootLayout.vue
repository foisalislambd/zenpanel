<script setup lang="ts">
import AdminToastHost from "@/components/admin/ui/AdminToastHost.vue";
import { provideAdminAuth } from "@/composables/use-admin-auth";
import { provideAdminChatPanel } from "@/composables/use-admin-chat-panel";
import { provideAdminSidebar } from "@/composables/use-admin-sidebar";

provideAdminAuth();
provideAdminSidebar();
provideAdminChatPanel();
</script>

<template>
  <div class="admin-shell min-h-dvh w-full">
    <RouterView />
    <AdminToastHost />
  </div>
</template>
