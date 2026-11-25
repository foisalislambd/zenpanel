import AdminLoginPage from "@/components/admin/pages/login-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <AdminLoginPage />;
}
