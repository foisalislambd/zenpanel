<script lang="ts">
  import { useAdminAuth } from "@/context/admin-auth-context.svelte";
  import { navigate } from "@/lib/router.svelte";
  import { ChevronDown, LogOut, Settings } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  const auth = useAdminAuth();
  let open = $state(false);
  let containerRef = $state<HTMLDivElement | null>(null);
  let triggerRef = $state<HTMLButtonElement | null>(null);
  const menuId = `admin-user-menu-${Math.random().toString(36).slice(2)}`;

  $effect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef && !containerRef.contains(e.target as Node)) {
        open = false;
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        open = false;
        triggerRef?.focus();
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleLogout() {
    open = false;
    auth.logout();
    navigate("/admin/login", { replace: true });
  }
</script>

<div class="relative" bind:this={containerRef}>
  <button
    bind:this={triggerRef}
    type="button"
    onclick={() => (open = !open)}
    class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white py-1.5 pr-2 pl-1.5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
    aria-expanded={open}
    aria-haspopup="menu"
    aria-controls={menuId}
  >
    <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white">
      {auth.admin?.username?.charAt(0)?.toUpperCase() ?? "A"}
    </span>
    <span class="hidden min-w-0 text-left md:block">
      <span class="block truncate text-sm font-medium text-gray-800 dark:text-white/90">
        {auth.admin?.username ?? "admin"}
      </span>
      <span class="block max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
        {auth.admin?.email}
      </span>
    </span>
    <ChevronDown
      class="hidden h-4 w-4 shrink-0 text-gray-500 transition md:block {open ? 'rotate-180' : ''}"
      aria-hidden={true}
    />
  </button>

  {#if open}
    <div
      id={menuId}
      role="menu"
      class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
        <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">
          {auth.admin?.username}
        </p>
        <p class="truncate text-xs text-gray-500">{auth.admin?.email}</p>
      </div>
      <RouterLink
        href="/admin/settings"
        role="menuitem"
        onclick={() => (open = false)}
        class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
      >
        <Settings class="h-4 w-4" aria-hidden={true} />
        Settings
      </RouterLink>
      <button
        type="button"
        role="menuitem"
        onclick={handleLogout}
        class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10"
      >
        <LogOut class="h-4 w-4" aria-hidden={true} />
        Sign out
      </button>
    </div>
  {/if}
</div>
