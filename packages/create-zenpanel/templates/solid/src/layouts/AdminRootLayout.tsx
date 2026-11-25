import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminToastHost } from "@/components/admin/ui/admin-toast-host";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import type { RouteSectionProps } from "@solidjs/router";

export function AdminRootLayout(props: RouteSectionProps) {
  return (
    <div class="admin-shell min-h-dvh w-full">
      <AdminAuthProvider>
        <AdminSidebarProvider>
          <AdminChatPanelProvider>{props.children}</AdminChatPanelProvider>
          <AdminToastHost />
        </AdminSidebarProvider>
      </AdminAuthProvider>
    </div>
  );
}
