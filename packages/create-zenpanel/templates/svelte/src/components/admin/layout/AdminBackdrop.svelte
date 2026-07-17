<script lang="ts">
  import { useAdminSidebar } from "@/context/admin-sidebar-context.svelte";

  const sidebar = useAdminSidebar();

  $effect(() => {
    if (!sidebar.isMobileOpen || sidebar.isDesktop) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        sidebar.closeMobileSidebar();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });
</script>

{#if sidebar.isMobileOpen && !sidebar.isDesktop}
  <button
    type="button"
    class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden"
    onclick={() => sidebar.closeMobileSidebar()}
    aria-label="Close navigation"
  ></button>
{/if}
