import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import { Outfit } from "next/font/google";
import "./admin.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-admin-sans",
});

export const metadata = {
  title: "Admin",
  description: "Site administration",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${outfit.variable} admin-shell min-h-dvh w-full`}>
      <AdminAuthProvider>
        <AdminSidebarProvider>
          <AdminChatPanelProvider>{children}</AdminChatPanelProvider>
        </AdminSidebarProvider>
      </AdminAuthProvider>
    </div>
  );
}
