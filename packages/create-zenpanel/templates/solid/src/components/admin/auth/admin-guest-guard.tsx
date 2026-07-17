import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useNavigate } from "@solidjs/router";
import { createEffect, Show, type JSX } from "solid-js";

/** Redirects authenticated admins away from login (and other guest-only routes). */
export function AdminGuestGuard(props: { children: JSX.Element }) {
  const { admin, loading } = useAdminAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!loading && admin()) {
      navigate("/admin", { replace: true });
    }
  });

  return (
    <Show
      when={!loading && !admin()}
      fallback={<AdminLoading message={loading ? "Loading…" : "Redirecting to dashboard…"} fullHeight />}
    >
      {props.children}
    </Show>
  );
}
