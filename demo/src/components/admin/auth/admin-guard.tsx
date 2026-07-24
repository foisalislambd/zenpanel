import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) {
      navigate("/admin/login", { replace: true });
    }
  }, [admin, loading, navigate]);

  if (loading) {
    return <AdminLoading message="Loading…" fullHeight />;
  }

  if (!admin) {
    return <AdminLoading message="Redirecting to sign in…" fullHeight />;
  }

  return <>{children}</>;
}
