import AdminNotFoundPage from "@/components/admin/pages/not-found-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function Page() {
  return <AdminNotFoundPage />;
}
