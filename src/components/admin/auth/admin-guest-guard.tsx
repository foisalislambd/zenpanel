"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Redirects authenticated admins away from login (and other guest-only routes). */
export function AdminGuestGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && admin) {
      router.replace("/admin");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (admin) return null;

  return <>{children}</>;
}
