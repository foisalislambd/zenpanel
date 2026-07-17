import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/** Redirects authenticated admins away from login (and other guest-only routes). */
export function AdminGuestGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && admin) {
      navigate("/admin", { replace: true });
    }
  }, [admin, loading, navigate]);

  if (loading) {
    return <AdminLoading message="Loading…" fullHeight />;
  }

  if (admin) {
    return <AdminLoading message="Redirecting to dashboard…" fullHeight />;
  }

  return <>{children}</>;
}
