<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAdminChatPanel } from "@/composables/use-admin-chat-panel";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";

const route = useRoute();
const chat = useAdminChatPanel();

let ownedPath: string | null = null;

const stop = watch(
  () => route.path,
  (pathValue) => {
    const path = normalizePathname(pathValue);

    if (path === "/admin") {
      ownedPath = null;
      return;
    }

    const nav = matchAdminNavItem(path);

    ownedPath = path;
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
  if (ownedPath && chat.pageContext?.pageId === ownedPath) {
    chat.setPageContext(null);
  }
});
</script>

<template />
