<script lang="ts">
  import type { Snippet } from "svelte";
  import AdminGuard from "@/components/admin/auth/AdminGuard.svelte";
  import AdminChatPanel from "@/components/admin/chat/AdminChatPanel.svelte";
  import AdminChatRouteBridge from "@/components/admin/chat/AdminChatRouteBridge.svelte";
  import AdminBackdrop from "@/components/admin/layout/AdminBackdrop.svelte";
  import AdminHeader from "@/components/admin/layout/AdminHeader.svelte";
  import AdminSidebar from "@/components/admin/layout/AdminSidebar.svelte";
  import { useAdminChatPanel } from "@/context/admin-chat-panel-context.svelte";
  import {
    SIDEBAR_WIDTH_COLLAPSED,
    SIDEBAR_WIDTH_EXPANDED,
    useAdminSidebar,
  } from "@/context/admin-sidebar-context.svelte";
  import { cn } from "@/lib/cn";
  import { normalizePathname } from "@/lib/admin-nav";
  import { usePathname } from "@/lib/router.svelte";

  type Props = { children?: Snippet };
  let { children }: Props = $props();

  const pathname = usePathname();
  const path = $derived(normalizePathname(pathname.current));
  const isFullBleedPage = $derived(path === "/admin/messages");
  const sidebar = useAdminSidebar();
  const chat = useAdminChatPanel();

  const sidebarWidth = $derived(
    sidebar.isDesktop ? (sidebar.isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED) : 0,
  );
  const chatPushLayout = $derived(chat.isOpen && chat.isDesktop && !isFullBleedPage);
  const chatOverlay = $derived(chat.isOpen && (isFullBleedPage || !chat.isDesktop));
</script>

<AdminGuard>
  <AdminChatRouteBridge />
  <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
    <div
      class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
      style:width="{sidebarWidth}px"
      aria-hidden="true"
    ></div>

    <AdminSidebar />
    <AdminBackdrop />

    <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main
          class={cn(
            "admin-scrollbar min-h-0 flex-1",
            isFullBleedPage ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden",
          )}
        >
          <div
            class={cn(
              "w-full",
              isFullBleedPage ? "flex h-full min-h-0 flex-col px-0" : "px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
            )}
          >
            <div class={cn("w-full", isFullBleedPage && "min-h-0 flex-1")}>
              {@render children?.()}
            </div>
          </div>
        </main>
      </div>

      {#if chatPushLayout}
        <AdminChatPanel overlay={false} />
      {/if}
    </div>

    {#if chatOverlay}
      <AdminChatPanel overlay />
    {/if}
  </div>
</AdminGuard>
