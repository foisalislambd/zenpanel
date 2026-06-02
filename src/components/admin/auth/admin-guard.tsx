"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
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
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!admin) return null;

  return <>{children}</>;
}
