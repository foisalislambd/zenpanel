"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
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

  if (loading || admin) {
    return (
      <>
        <AdminLoading
          message={loading ? "Loading…" : "Redirecting to dashboard…"}
          fullHeight
        />
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
