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

  if (loading || !admin) {
    return (
      <>
        <AdminLoading
          message={loading ? "Loading…" : "Redirecting to sign in…"}
          fullHeight
        />
        {/* Keep the page segment mounted so Cache Components can validate it. */}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
