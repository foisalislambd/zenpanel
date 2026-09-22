<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-vue-next";
import { adminConfig, adminNavItems } from "@/config/admin.config";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/composables/use-admin-sidebar";
import { isAdminNavActive, isExternalUrl } from "@/lib/admin-nav";

const sidebar = useAdminSidebar();
const route = useRoute();

watch(
  () => route.path,
  () => {
    sidebar.closeMobileSidebar();
  },
);

const showLabels = computed(
  () => !sidebar.isDesktop || sidebar.isExpanded || sidebar.isMobileOpen,
);
const desktopWidth = computed(() =>
  sidebar.isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
);
const mobileClosed = computed(() => !sidebar.isDesktop && !sidebar.isMobileOpen);

const { brand } = adminConfig;
const siteUrl = brand.siteUrl || "/";

const navGroups = computed(() => {
  const groups: { section: string; items: typeof adminNavItems }[] = [];
  for (const item of adminNavItems) {
    const section = item.section || "Menu";
    const last = groups[groups.length - 1];
    if (last?.section === section) last.items.push(item);
    else groups.push({ section, items: [item] });
  }
  return groups;
});
</script>

<template>
  <aside
    :style="{
      width: sidebar.isDesktop
        ? `${desktopWidth}px`
        : `${Math.min(320, SIDEBAR_WIDTH_EXPANDED)}px`,
    }"
    :class="[
      'fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900',
      sidebar.isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
    aria-label="Admin navigation"
    :aria-hidden="mobileClosed || undefined"
    :inert="mobileClosed || undefined"
  >
    <div class="admin-topbar flex items-center gap-2 px-3">
      <RouterLink
        to="/admin"
        :class="[
          'flex min-w-0 flex-1 items-center gap-2',
          !showLabels ? 'justify-center' : '',
        ]"
        @click="sidebar.closeMobileSidebar()"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white"
        >
          {{ brand.letter }}
        </span>
        <div v-if="showLabels" class="min-w-0">
          <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {{ brand.name }}
          </p>
        </div>
      </RouterLink>
      <button
        v-if="!sidebar.isDesktop"
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="Close menu"
        @click="sidebar.closeMobileSidebar()"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <nav class="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto px-2.5 py-3">
      <div v-for="(group, index) in navGroups" :key="group.section" class="flex flex-col gap-1">
        <p
          v-if="showLabels"
          class="px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500"
        >
          {{ group.section }}
        </p>
        <div
          v-else-if="index > 0"
          class="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
      <RouterLink
        v-for="item in group.items"
        :key="item.href"
        :to="item.href"
        :title="!showLabels ? item.name : undefined"
        :aria-current="isAdminNavActive(route.path, item.href) ? 'page' : undefined"
        :class="[
          'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
          isAdminNavActive(route.path, item.href)
            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8',
          !showLabels ? 'justify-center px-0' : '',
        ]"
        @click="sidebar.closeMobileSidebar()"
      >
        <component
          :is="item.icon"
          :class="[
            'h-[18px] w-[18px] shrink-0',
            isAdminNavActive(route.path, item.href)
              ? 'text-white'
              : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400',
          ]"
        />
        <span v-if="showLabels" class="truncate">{{ item.name }}</span>
      </RouterLink>
      </div>
    </nav>

    <div class="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
      <a
        v-if="isExternalUrl(siteUrl)"
        :href="siteUrl"
        target="_blank"
        rel="noreferrer"
        :class="[
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8',
          !showLabels ? 'justify-center' : '',
        ]"
        :title="!showLabels ? 'View site' : undefined"
      >
        <ExternalLink class="h-5 w-5 shrink-0" />
        <span v-if="showLabels">View site</span>
      </a>
      <RouterLink
        v-else
        :to="siteUrl"
        :class="[
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8',
          !showLabels ? 'justify-center' : '',
        ]"
        :title="!showLabels ? 'View site' : undefined"
      >
        <ExternalLink class="h-5 w-5 shrink-0" />
        <span v-if="showLabels">View site</span>
      </RouterLink>

      <button
        v-if="sidebar.isDesktop"
        type="button"
        :class="[
          'mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5',
          !showLabels ? 'justify-center' : '',
        ]"
        :aria-label="sidebar.isExpanded ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="sidebar.toggleSidebar()"
      >
        <template v-if="sidebar.isExpanded">
          <ChevronLeft class="h-5 w-5 shrink-0" />
          <span>Collapse</span>
        </template>
        <ChevronRight v-else class="h-5 w-5 shrink-0" />
      </button>
    </div>
  </aside>
</template>
