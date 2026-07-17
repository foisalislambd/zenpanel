<script setup lang="ts">
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
  </div>
</template>
