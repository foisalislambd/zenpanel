"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return <AdminLoading message="Loading…" fullHeight />;
  }

  if (!admin) {
    return <AdminLoading message="Redirecting to sign in…" fullHeight />;
  }

  return <>{children}</>;
}
