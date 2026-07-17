import { computed, inject, onUnmounted, provide, ref, watch, type InjectionKey } from "vue";
import { useIsDesktop } from "@/composables/use-is-desktop";

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 80;

export type AdminSidebarContext = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setExpanded: (value: boolean) => void;
};

export const AdminSidebarKey: InjectionKey<AdminSidebarContext> = Symbol("admin-sidebar");

export function provideAdminSidebar() {
  const isDesktop = useIsDesktop();
  const isExpanded = ref(true);
  const isMobileOpen = ref(false);

  const effectiveExpanded = computed(() => (isDesktop.value ? isExpanded.value : true));
  const effectiveMobileOpen = computed(() => (isDesktop.value ? false : isMobileOpen.value));

  watch(effectiveMobileOpen, (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  });

  onUnmounted(() => {
    document.body.style.overflow = "";
  });

  const ctx: AdminSidebarContext = {
    get isExpanded() {
      return effectiveExpanded.value;
    },
    get isMobileOpen() {
      return effectiveMobileOpen.value;
    },
    get isDesktop() {
      return isDesktop.value;
    },
    toggleSidebar() {
      isExpanded.value = !isExpanded.value;
    },
    toggleMobileSidebar() {
      isMobileOpen.value = !isMobileOpen.value;
    },
    closeMobileSidebar() {
      isMobileOpen.value = false;
    },
    setExpanded(value: boolean) {
      isExpanded.value = value;
    },
  };

  provide(AdminSidebarKey, ctx);
  return ctx;
}

export function useAdminSidebar() {
  const ctx = inject(AdminSidebarKey);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}
