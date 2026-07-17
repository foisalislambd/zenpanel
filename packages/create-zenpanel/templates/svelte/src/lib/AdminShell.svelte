<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { Snippet } from "svelte";
  import { adminConfig, adminNavItems } from "./config";
  import { getAdmin, logout, type AdminSession } from "./auth";
  import { getTheme, initTheme, toggleTheme } from "./theme";
  import { navigate, normalizePath } from "./router";
  import { refreshIcons } from "./icons";

  let {
    pageTitle,
    children,
  }: {
    pageTitle: string;
    children: Snippet;
  } = $props();

  const SIDEBAR_KEY = "zenpanel-sidebar-expanded";
  const { brand } = adminConfig;

  let admin = $state<AdminSession | null>(null);
  let expanded = $state(true);
  let mobileOpen = $state(false);
  let themeDark = $state(false);
  let desktop = $state(false);

  function isDesktop() {
    return window.matchMedia("(min-width: 1024px)").matches;
  }

  function isActive(href: string) {
    const path = normalizePath(window.location.pathname);
    if (href === "/admin") return path === "/admin";
    return path === href;
  }

  function sidebarWidth() {
    if (!desktop) return 0;
    return expanded ? 260 : 80;
  }

  function showLabels() {
    return !desktop || expanded || mobileOpen;
  }

  function sidebarVisible() {
    return mobileOpen || desktop;
  }

  function go(path: string) {
    return (e: MouseEvent) => {
      e.preventDefault();
      mobileOpen = false;
      navigate(path);
    };
  }

  async function onToggleTheme() {
    toggleTheme();
    themeDark = getTheme() === "dark";
    await tick();
    refreshIcons();
  }

  function onToggleSidebar() {
    expanded = !expanded;
    try {
      localStorage.setItem(SIDEBAR_KEY, expanded ? "1" : "0");
    } catch {
      // ignore
    }
  }

  function onLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  onMount(() => {
    initTheme();
    const session = getAdmin();
    if (!session) {
      navigate("/admin/login", { replace: true });
      return;
    }
    admin = session;
    themeDark = getTheme() === "dark";
    desktop = isDesktop();

    try {
      expanded = localStorage.getItem(SIDEBAR_KEY) !== "0";
    } catch {
      expanded = true;
    }

    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      desktop = mq.matches;
      mobileOpen = false;
    };
    mq.addEventListener("change", onChange);

    tick().then(() => refreshIcons());

    return () => mq.removeEventListener("change", onChange);
  });

  $effect(() => {
    // Re-run icons when chrome state changes
    void expanded;
    void mobileOpen;
    void themeDark;
    void pageTitle;
    tick().then(() => refreshIcons());
  });
</script>

{#if admin}
  <div class="admin-main">
    <div class="admin-sidebar-spacer" style="width:{sidebarWidth()}px" aria-hidden="true"></div>
    <aside
      class="admin-sidebar"
      class:collapsed={!expanded}
      class:mobile-closed={!sidebarVisible()}
      aria-label="Admin navigation"
      aria-hidden={sidebarVisible() ? "false" : "true"}
      inert={!sidebarVisible() ? true : undefined}
    >
      <div class="admin-topbar">
        <a
          href="/admin"
          style="display:flex;align-items:center;gap:0.75rem;min-width:0;flex:1;{showLabels()
            ? ''
            : 'justify-content:center'}"
          onclick={go("/admin")}
        >
          <span class="brand-mark">{brand.letter}</span>
          {#if showLabels()}
            <div class="brand-text" style="min-width:0">
              <div style="font-weight:600;font-size:15px">{brand.name}</div>
              <div class="muted" style="font-size:12px">{brand.tagline}</div>
            </div>
          {/if}
        </a>
        {#if !desktop}
          <button
            type="button"
            class="icon-btn"
            aria-label="Close menu"
            onclick={() => (mobileOpen = false)}
          >
            <i data-lucide="x" style="width:22px;height:22px;flex-shrink:0"></i>
          </button>
        {/if}
      </div>
      <nav class="nav-list">
        {#if showLabels()}
          <p class="nav-label">Menu</p>
        {/if}
        {#each adminNavItems as item}
          <a
            class="nav-link"
            class:active={isActive(item.href)}
            href={item.href}
            title={item.name}
            onclick={go(item.href)}
          >
            <i data-lucide={item.icon} style="width:22px;height:22px;flex-shrink:0"></i>
            {#if showLabels()}
              <span class="nav-text">{item.name}</span>
            {/if}
          </a>
        {/each}
      </nav>
      <div class="sidebar-footer">
        <a class="nav-link" href={brand.siteUrl || "/"} onclick={go(brand.siteUrl || "/")}>
          <i data-lucide="external-link" style="width:22px;height:22px;flex-shrink:0"></i>
          {#if showLabels()}
            <span class="nav-text">View site</span>
          {/if}
        </a>
        {#if desktop}
          <button
            type="button"
            class="btn btn-ghost"
            style="width:100%;justify-content:{showLabels()
              ? 'flex-start'
              : 'center'};gap:0.75rem"
            onclick={onToggleSidebar}
          >
            {#if expanded}
              <i data-lucide="chevron-left" style="width:22px;height:22px;flex-shrink:0"></i>
              <span>Collapse</span>
            {:else}
              <i data-lucide="chevron-right" style="width:22px;height:22px;flex-shrink:0"></i>
            {/if}
          </button>
        {/if}
      </div>
    </aside>
    <button
      type="button"
      class="backdrop"
      aria-label="Close menu"
      hidden={!(mobileOpen && !desktop)}
      onclick={() => (mobileOpen = false)}
    ></button>
    <div class="admin-content-wrap">
      <header class="admin-header">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <button
            type="button"
            class="icon-btn hidden-desktop"
            aria-label="Open menu"
            onclick={() => (mobileOpen = true)}
          >
            <i data-lucide="menu" style="width:22px;height:22px;flex-shrink:0"></i>
          </button>
          <strong style="font-size:0.95rem">{pageTitle}</strong>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <button
            type="button"
            class="icon-btn"
            aria-label={themeDark ? "Switch to light mode" : "Switch to dark mode"}
            onclick={onToggleTheme}
          >
            <i
              data-lucide={themeDark ? "sun" : "moon"}
              style="width:22px;height:22px;flex-shrink:0"
            ></i>
          </button>
          <div class="user-chip">
            <span class="user-avatar">{(admin.username || "A").charAt(0).toUpperCase()}</span>
            <div
              class="only-desktop"
              style="flex-direction:column;align-items:flex-start;line-height:1.2"
            >
              <span style="font-size:0.875rem;font-weight:500">{admin.username}</span>
              <span class="muted" style="font-size:0.75rem">{admin.email}</span>
            </div>
            <button
              type="button"
              class="btn btn-ghost"
              style="height:2rem;padding:0 0.75rem"
              onclick={onLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main class="admin-main-scroll">
        {@render children()}
      </main>
    </div>
  </div>
{/if}
