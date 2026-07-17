<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAdminChatPanel } from "@/composables/use-admin-chat-panel";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";

const route = useRoute();
const chat = useAdminChatPanel();

const stop = watch(
  () => route.path,
  (pathValue) => {
    const path = normalizePathname(pathValue);

    if (path === "/admin") {
      return;
    }

    const nav = matchAdminNavItem(path);

    chat.setPageContext({
      pageId: path,
      title: nav?.name ?? "Admin",
      description:
        nav?.description ??
        `Ask me anything about ${nav?.name ?? "this page"} — analyze data, get suggestions, or plan your next steps.`,
      route: path,
      getSnapshot: () => ({ route: path }),
    });
  },
  { immediate: true },
);

onUnmounted(() => {
  stop();
  chat.setPageContext(null);
});
</script>

<template />
