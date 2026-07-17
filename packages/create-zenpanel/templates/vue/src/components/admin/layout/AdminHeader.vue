<script setup lang="ts">
import { adminConfig } from "@/config/admin.config";
import AdminUserMenu from "@/components/admin/layout/AdminUserMenu.vue";
import AdminThemeToggle from "@/components/admin/ui/AdminThemeToggle.vue";
import { useAdminChatPanel } from "@/composables/use-admin-chat-panel";
import { useAdminSidebar } from "@/composables/use-admin-sidebar";
import { cn } from "@/lib/cn";
import { Menu, PanelRightOpen, Search, X } from "lucide-vue-next";

const sidebar = useAdminSidebar();
const chat = useAdminChatPanel();
</script>

<template>
  <header
    class="admin-topbar sticky top-0 z-30 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80"
  >
    <div class="flex h-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
      <button
        type="button"
        :class="[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5',
          sidebar.isDesktop ? 'lg:hidden' : '',
        ]"
        :aria-label="!sidebar.isDesktop && sidebar.isMobileOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="!sidebar.isDesktop ? sidebar.isMobileOpen : undefined"
        @click="sidebar.toggleMobileSidebar()"
      >
        <X v-if="!sidebar.isDesktop && sidebar.isMobileOpen" class="h-5 w-5" />
        <Menu v-else class="h-5 w-5" />
      </button>

      <RouterLink to="/admin" class="flex items-center gap-2 lg:hidden">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white"
        >
          {{ adminConfig.brand.letter }}
        </span>
        <span class="text-base font-semibold text-gray-900 dark:text-white">
          {{ adminConfig.brand.name }}
        </span>
      </RouterLink>

      <div class="hidden flex-1 lg:block lg:max-w-lg">
        <label class="relative block">
          <Search
            class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            disabled
            placeholder="Search — connect API to enable"
            class="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-500 placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/5 dark:text-gray-500"
            aria-label="Search"
            aria-describedby="admin-search-hint"
          />
          <span id="admin-search-hint" class="sr-only">
            Global search will be available after you connect your backend API.
          </span>
        </label>
      </div>

      <div class="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          :class="
            cn(
              'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
              chat.isOpen
                ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5',
            )
          "
          aria-label="Toggle AI assistant"
          :aria-expanded="chat.isOpen"
          @click="chat.togglePanel()"
        >
          <PanelRightOpen class="h-4 w-4" aria-hidden="true" />
          <span class="hidden sm:inline">AI</span>
        </button>
        <AdminThemeToggle />
        <AdminUserMenu />
      </div>
    </div>
  </header>
</template>
