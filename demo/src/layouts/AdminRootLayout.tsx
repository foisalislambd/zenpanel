import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminToastProvider } from "@/components/admin/ui/admin-toast-provider";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import { Outlet } from "react-router-dom";

export function AdminRootLayout() {
  return (
    <div className="admin-shell min-h-dvh w-full">
      <AdminAuthProvider>
        <AdminToastProvider>
          <AdminSidebarProvider>
            <AdminChatPanelProvider>
              <Outlet />
            </AdminChatPanelProvider>
          </AdminSidebarProvider>
        </AdminToastProvider>
      </AdminAuthProvider>
    </div>
  );
}
