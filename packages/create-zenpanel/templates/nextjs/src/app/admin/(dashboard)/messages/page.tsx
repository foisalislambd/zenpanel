import AdminMessagesPage from "@/components/admin/pages/messages-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return <AdminMessagesPage />;
}
