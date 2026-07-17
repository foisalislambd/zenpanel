import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import { Outlet } from "react-router-dom";

export function AdminRootLayout() {
  return (
    <div className="admin-shell min-h-dvh w-full">
      <AdminAuthProvider>
        <AdminSidebarProvider>
          <AdminChatPanelProvider>
            <Outlet />
          </AdminChatPanelProvider>
        </AdminSidebarProvider>
      </AdminAuthProvider>
    </div>
  );
}
