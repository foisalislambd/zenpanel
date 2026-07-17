import { AdminGuard } from "@/components/admin/auth/admin-guard";
import { AdminChatPanel } from "@/components/admin/chat/admin-chat-panel";
import { AdminChatRouteBridge } from "@/components/admin/chat/admin-chat-route-bridge";
import { AdminBackdrop } from "@/components/admin/layout/admin-backdrop";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/context/admin-sidebar-context";
import { cn } from "@/lib/cn";
import { normalizePathname } from "@/lib/admin-nav";
import { useLocation, type RouteSectionProps } from "@solidjs/router";
import { createMemo, Show } from "solid-js";

export function AdminDashboardLayout(props: RouteSectionProps) {
  const location = useLocation();
  const path = createMemo(() => normalizePathname(location.pathname));
  const isFullBleedPage = createMemo(() => path() === "/admin/messages");
  const { isExpanded, isDesktop } = useAdminSidebar();
  const { isOpen: isChatOpen, isDesktop: isChatDesktop } = useAdminChatPanel();

  const sidebarWidth = createMemo(() =>
    isDesktop() ? (isExpanded() ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED) : 0,
  );

  const chatPushLayout = createMemo(
    () => isChatOpen() && isChatDesktop() && !isFullBleedPage(),
  );
  const chatOverlay = createMemo(() => isChatOpen() && (isFullBleedPage() || !isChatDesktop()));

  return (
    <AdminGuard>
      <AdminChatRouteBridge />
      <div class="admin-shell admin-main flex h-dvh w-full overflow-hidden">
        <div
          class="hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block"
          style={{ width: `${sidebarWidth()}px` }}
          aria-hidden
        />

        <AdminSidebar />
        <AdminBackdrop />

        <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main
              class={cn(
                "admin-scrollbar min-h-0 flex-1",
                isFullBleedPage() ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden",
              )}
            >
              <div
                class={cn(
                  "w-full",
                  isFullBleedPage() ? "flex h-full min-h-0 flex-col px-0" : "px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
                )}
              >
                <div class={cn("w-full", isFullBleedPage() && "min-h-0 flex-1")}>
                  {props.children}
                </div>
              </div>
            </main>
          </div>

          <Show when={chatPushLayout()}>
            <AdminChatPanel overlay={false} />
          </Show>
        </div>

        <Show when={chatOverlay()}>
          <AdminChatPanel overlay />
        </Show>
      </div>
    </AdminGuard>
  );
}
