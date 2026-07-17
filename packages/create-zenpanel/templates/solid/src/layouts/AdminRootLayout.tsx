import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import type { RouteSectionProps } from "@solidjs/router";

export function AdminRootLayout(props: RouteSectionProps) {
  return (
    <div class="admin-shell min-h-dvh w-full">
      <AdminAuthProvider>
        <AdminSidebarProvider>
          <AdminChatPanelProvider>{props.children}</AdminChatPanelProvider>
        </AdminSidebarProvider>
      </AdminAuthProvider>
    </div>
  );
}
