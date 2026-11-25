import { AdminAuthProvider } from "@/components/admin/auth/admin-auth-provider";
import { AdminToastProvider } from "@/components/admin/ui/admin-toast-provider";
import { AdminChatPanelProvider } from "@/context/admin-chat-panel-context";
import { AdminSidebarProvider } from "@/context/admin-sidebar-context";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./admin.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-admin-sans",
});

export const metadata: Metadata = {
  title: { default: "Admin · ZenPanel", template: "%s · ZenPanel" },
  description: "Site administration",
};

// Client auth decides whether dashboard pages render, so this shell cannot
// guarantee an instant static segment. Opt out of that validation.
export const instant = false;

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${outfit.variable} admin-shell min-h-dvh w-full`}>
      <AdminAuthProvider>
        <AdminToastProvider>
          <AdminSidebarProvider>
            <AdminChatPanelProvider>{children}</AdminChatPanelProvider>
          </AdminSidebarProvider>
        </AdminToastProvider>
      </AdminAuthProvider>
    </div>
  );
}
