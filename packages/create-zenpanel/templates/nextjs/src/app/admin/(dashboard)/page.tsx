import AdminDashboardPage from "@/components/admin/pages/dashboard-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <AdminDashboardPage />;
}
