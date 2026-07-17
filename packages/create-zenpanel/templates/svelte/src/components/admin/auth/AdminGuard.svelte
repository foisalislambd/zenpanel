<script lang="ts">
  import type { Snippet } from "svelte";
  import { useAdminAuth } from "@/context/admin-auth-context.svelte";
  import { navigate } from "@/lib/router.svelte";
  import AdminLoading from "@/components/admin/ui/AdminLoading.svelte";

  type Props = { children?: Snippet };
  let { children }: Props = $props();

  const auth = useAdminAuth();

  $effect(() => {
    if (!auth.loading && !auth.admin) {
      navigate("/admin/login", { replace: true });
    }
  });
</script>

{#if !auth.loading && auth.admin}
  {@render children?.()}
{:else}
  <AdminLoading message={auth.loading ? "Loading…" : "Redirecting to sign in…"} fullHeight />
{/if}
