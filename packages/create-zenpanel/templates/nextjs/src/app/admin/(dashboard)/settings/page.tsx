import AdminSettingsPage from "@/components/admin/pages/settings-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <AdminSettingsPage />;
}
