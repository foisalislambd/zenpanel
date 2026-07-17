<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminGuard from "@/components/admin/auth/AdminGuard.vue";
import AdminChatPanel from "@/components/admin/chat/AdminChatPanel.vue";
import AdminChatRouteBridge from "@/components/admin/chat/AdminChatRouteBridge.vue";
import AdminBackdrop from "@/components/admin/layout/AdminBackdrop.vue";
import AdminHeader from "@/components/admin/layout/AdminHeader.vue";
import AdminSidebar from "@/components/admin/layout/AdminSidebar.vue";
import { useAdminChatPanel } from "@/composables/use-admin-chat-panel";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/composables/use-admin-sidebar";
import { cn } from "@/lib/cn";
import { normalizePathname } from "@/lib/admin-nav";

const route = useRoute();
const sidebar = useAdminSidebar();
const chat = useAdminChatPanel();

const path = computed(() => normalizePathname(route.path));
const isFullBleedPage = computed(() => path.value === "/admin/messages");

const sidebarWidth = computed(() =>
  sidebar.isDesktop
    ? sidebar.isExpanded
      ? SIDEBAR_WIDTH_EXPANDED
      : SIDEBAR_WIDTH_COLLAPSED
    : 0,
);

const chatPushLayout = computed(
  () => chat.isOpen && chat.isDesktop && !isFullBleedPage.value,
);
const chatOverlay = computed(
  () => chat.isOpen && (isFullBleedPage.value || !chat.isDesktop),
);
</script>

<template>
  <AdminGuard>
    <AdminChatRouteBridge />
    <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
      <div
        class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
        :style="{ width: `${sidebarWidth}px` }"
        aria-hidden="true"
      />

      <AdminSidebar />
      <AdminBackdrop />

      <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main
            :class="
              cn(
                'admin-scrollbar min-h-0 flex-1',
                isFullBleedPage ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden',
              )
            "
          >
            <div
              :class="
                cn(
                  'w-full',
                  isFullBleedPage
                    ? 'flex h-full min-h-0 flex-col px-0'
                    : 'px-4 py-5 sm:px-6 sm:py-6 lg:px-8',
                )
              "
            >
              <div :class="cn('w-full', isFullBleedPage && 'min-h-0 flex-1')">
                <RouterView />
              </div>
            </div>
          </main>
        </div>

        <AdminChatPanel v-if="chatPushLayout" :overlay="false" />
      </div>

      <AdminChatPanel v-if="chatOverlay" overlay />
    </div>
  </AdminGuard>
</template>
