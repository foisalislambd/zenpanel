<script lang="ts">
  import { Menu, Search, Sparkles, X } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";
  import AdminCommandPalette from "@/components/admin/layout/AdminCommandPalette.svelte";
  import AdminUserMenu from "@/components/admin/layout/AdminUserMenu.svelte";
  import AdminThemeToggle from "@/components/admin/ui/AdminThemeToggle.svelte";
  import { adminConfig } from "@/config/admin.config";
  import { useAdminChatPanel } from "@/context/admin-chat-panel-context.svelte";
  import { useAdminSidebar } from "@/context/admin-sidebar-context.svelte";
  import { isMacPlatform } from "@/lib/command-palette";
  import { cn } from "@/lib/cn";

  const sidebar = useAdminSidebar();
  const chat = useAdminChatPanel();
  let paletteOpen = $state(false);

  function onKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<header class="admin-topbar sticky top-0 z-30 w-full bg-white dark:bg-gray-900">
  <div class="flex h-full items-center gap-3 px-3 sm:gap-4 sm:px-4">
    <button
      type="button"
      onclick={() => sidebar.toggleMobileSidebar()}
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 {sidebar.isDesktop
        ? 'lg:hidden'
        : ''}"
      aria-label={!sidebar.isDesktop && sidebar.isMobileOpen ? "Close menu" : "Open menu"}
      aria-expanded={!sidebar.isDesktop ? sidebar.isMobileOpen : undefined}
    >
      {#if !sidebar.isDesktop && sidebar.isMobileOpen}
        <X class="h-5 w-5" aria-hidden={true} />
      {:else}
        <Menu class="h-5 w-5" aria-hidden={true} />
      {/if}
    </button>

    <RouterLink href="/admin" class="flex items-center gap-2 lg:hidden">
      <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
        {adminConfig.brand.letter}
      </span>
      <span class="text-base font-semibold text-gray-900 dark:text-white">{adminConfig.brand.name}</span>
    </RouterLink>

    <div class="hidden flex-1 lg:block lg:max-w-lg">
      <button
        type="button"
        class="flex h-9 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 pr-2 pl-3 text-sm text-gray-500 transition hover:border-gray-300 hover:bg-white dark:border-gray-800 dark:bg-white/5 dark:text-gray-400 dark:hover:border-gray-700"
        aria-label="Search pages and actions"
        aria-keyshortcuts="Control+K Meta+K"
        onclick={() => (paletteOpen = true)}
      >
        <Search class="h-4 w-4 shrink-0 text-gray-400" aria-hidden={true} />
        <span class="flex-1 text-left">Search pages and actions…</span>
        <kbd
          class="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {isMacPlatform ? "⌘" : "Ctrl"} K
        </kbd>
      </button>
    </div>

    <div class="ml-auto flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
        aria-label="Search pages and actions"
        onclick={() => (paletteOpen = true)}
      >
        <Search class="h-4 w-4" aria-hidden={true} />
      </button>
      <button
        type="button"
        onclick={() => chat.togglePanel()}
        class={cn(
          "flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
          chat.isOpen
            ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300"
            : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5",
        )}
        aria-label={chat.isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={chat.isOpen}
      >
        <Sparkles class="h-4 w-4" aria-hidden={true} />
        <span class="hidden sm:inline">AI</span>
      </button>
      <AdminThemeToggle />
      <AdminUserMenu />
    </div>
  </div>
  {#if paletteOpen}
    <AdminCommandPalette onClose={() => (paletteOpen = false)} />
  {/if}
</header>
