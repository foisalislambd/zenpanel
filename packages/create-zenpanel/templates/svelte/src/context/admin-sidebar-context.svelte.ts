import { getContext, setContext } from "svelte";
import { createIsDesktop } from "@/hooks/use-is-desktop.svelte";

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 80;

export const ADMIN_SIDEBAR_KEY = Symbol("admin-sidebar");

export type AdminSidebarContext = ReturnType<typeof createAdminSidebar>;

export function createAdminSidebar() {
  const isDesktop = createIsDesktop();
  let isExpanded = $state(true);
  let isMobileOpen = $state(false);

  const effectiveExpanded = $derived(isDesktop.current ? isExpanded : true);
  const effectiveMobileOpen = $derived(isDesktop.current ? false : isMobileOpen);

  $effect(() => {
    document.body.style.overflow = effectiveMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  });

  const ctx = {
    get isExpanded() {
      return effectiveExpanded;
    },
    get isMobileOpen() {
      return effectiveMobileOpen;
    },
    get isDesktop() {
      return isDesktop.current;
    },
    toggleSidebar() {
      isExpanded = !isExpanded;
    },
    toggleMobileSidebar() {
      isMobileOpen = !isMobileOpen;
    },
    closeMobileSidebar() {
      isMobileOpen = false;
    },
    setExpanded(value: boolean) {
      isExpanded = value;
    },
  };

  setContext(ADMIN_SIDEBAR_KEY, ctx);
  return ctx;
}

export function useAdminSidebar() {
  const ctx = getContext<AdminSidebarContext>(ADMIN_SIDEBAR_KEY);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}
