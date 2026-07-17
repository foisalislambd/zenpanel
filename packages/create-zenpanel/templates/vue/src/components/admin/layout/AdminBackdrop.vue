<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useAdminSidebar } from "@/composables/use-admin-sidebar";

const sidebar = useAdminSidebar();

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    sidebar.closeMobileSidebar();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <button
    v-if="sidebar.isMobileOpen && !sidebar.isDesktop"
    type="button"
    class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden"
    aria-label="Close navigation"
    @click="sidebar.closeMobileSidebar()"
  />
</template>
