import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { useNavigate } from "@solidjs/router";
import { createEffect, Show, type JSX } from "solid-js";

export function AdminGuard(props: { children: JSX.Element }) {
  const { admin, loading } = useAdminAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!loading && !admin()) {
      navigate("/admin/login", { replace: true });
    }
  });

  return (
    <Show
      when={!loading && admin()}
      fallback={<AdminLoading message={loading ? "Loading…" : "Redirecting to sign in…"} fullHeight />}
    >
      {props.children}
    </Show>
  );
}
