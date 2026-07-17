<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ChevronRight, Home } from "lucide-vue-next";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";

const route = useRoute();

const pageTitle = computed(() => {
  const path = normalizePathname(route.path);
  return path === "/admin" ? null : (matchAdminNavItem(path)?.name ?? null);
});
</script>

<template>
  <nav v-if="pageTitle" aria-label="Breadcrumb" class="mb-4">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <li>
        <RouterLink
          to="/admin"
          class="inline-flex items-center gap-1 rounded-md transition hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:text-gray-200"
        >
          <Home class="h-3.5 w-3.5" aria-hidden="true" />
          <span class="sr-only">Dashboard</span>
        </RouterLink>
      </li>
      <li aria-hidden="true">
        <ChevronRight class="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
      </li>
      <li>
        <span class="font-medium text-gray-700 dark:text-gray-300" aria-current="page">
          {{ pageTitle }}
        </span>
      </li>
    </ol>
  </nav>
</template>
