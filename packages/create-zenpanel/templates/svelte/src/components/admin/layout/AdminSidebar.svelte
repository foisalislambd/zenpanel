<script lang="ts">
  import { adminConfig, adminNavItems } from "@/config/admin.config";
  import {
    SIDEBAR_WIDTH_COLLAPSED,
    SIDEBAR_WIDTH_EXPANDED,
    useAdminSidebar,
  } from "@/context/admin-sidebar-context.svelte";
  import { isAdminNavActive, isExternalUrl } from "@/lib/admin-nav";
  import { usePathname } from "@/lib/router.svelte";
  import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  const sidebar = useAdminSidebar();
  const pathname = usePathname();

  $effect(() => {
    pathname.current;
    sidebar.closeMobileSidebar();
  });

  const showLabels = $derived(!sidebar.isDesktop || sidebar.isExpanded || sidebar.isMobileOpen);
  const desktopWidth = $derived(sidebar.isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED);
  const mobileClosed = $derived(!sidebar.isDesktop && !sidebar.isMobileOpen);
  const { brand } = adminConfig;
  const siteUrl = brand.siteUrl || "/";
</script>

<aside
  style:width={sidebar.isDesktop ? `${desktopWidth}px` : `${Math.min(320, SIDEBAR_WIDTH_EXPANDED)}px`}
  class="fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 {sidebar.isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
  aria-label="Admin navigation"
  aria-hidden={mobileClosed || undefined}
  inert={mobileClosed || undefined}
>
  <div class="admin-topbar flex items-center gap-3 px-4">
    <RouterLink
      href="/admin"
      onclick={() => sidebar.closeMobileSidebar()}
      class="flex min-w-0 flex-1 items-center gap-3 {!showLabels ? 'justify-center' : ''}"
    >
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white">
        {brand.letter}
      </span>
      {#if showLabels}
        <div class="min-w-0">
          <p class="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
            {brand.name}
          </p>
          <p class="truncate text-xs text-gray-500">{brand.tagline}</p>
        </div>
      {/if}
    </RouterLink>
    {#if !sidebar.isDesktop}
      <button
        type="button"
        onclick={() => sidebar.closeMobileSidebar()}
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="Close menu"
      >
        <X class="h-5 w-5" />
      </button>
    {/if}
  </div>

  <nav class="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
    {#if showLabels}
      <p class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
        Menu
      </p>
    {/if}
    {#each adminNavItems as item (item.href)}
      {@const active = isAdminNavActive(pathname.current, item.href)}
      {@const Icon = item.icon}
      <RouterLink
        href={item.href}
        onclick={() => sidebar.closeMobileSidebar()}
        title={!showLabels ? item.name : undefined}
        aria-current={active ? "page" : undefined}
        class="group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 {active ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8'} {!showLabels ? 'justify-center px-0' : ''}"
      >
        <Icon
          class="h-[22px] w-[22px] shrink-0 {active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400'}"
        />
        {#if showLabels}
          <span class="truncate">{item.name}</span>
        {/if}
      </RouterLink>
    {/each}
  </nav>

  <div class="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
    {#if isExternalUrl(siteUrl)}
      <a
        href={siteUrl}
        target="_blank"
        rel="noreferrer"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 {!showLabels ? 'justify-center' : ''}"
        title={!showLabels ? "View site" : undefined}
      >
        <ExternalLink class="h-5 w-5 shrink-0" />
        {#if showLabels}
          <span>View site</span>
        {/if}
      </a>
    {:else}
      <RouterLink
        href={siteUrl}
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 {!showLabels ? 'justify-center' : ''}"
        title={!showLabels ? "View site" : undefined}
      >
        <ExternalLink class="h-5 w-5 shrink-0" />
        {#if showLabels}
          <span>View site</span>
        {/if}
      </RouterLink>
    {/if}

    {#if sidebar.isDesktop}
      <button
        type="button"
        onclick={() => sidebar.toggleSidebar()}
        class="mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5 {!showLabels ? 'justify-center' : ''}"
        aria-label={sidebar.isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {#if sidebar.isExpanded}
          <ChevronLeft class="h-5 w-5 shrink-0" />
          <span>Collapse</span>
        {:else}
          <ChevronRight class="h-5 w-5 shrink-0" />
        {/if}
      </button>
    {/if}
  </div>
</aside>
