import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 80;

type SidebarContextValue = {
  isExpanded: Accessor<boolean>;
  isMobileOpen: Accessor<boolean>;
  isDesktop: Accessor<boolean>;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setExpanded: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue>();
const SIDEBAR_STORAGE_KEY = "zenpanel-sidebar";

function readExpanded() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "collapsed";
  } catch {
    return true;
  }
}

export function AdminSidebarProvider(props: { children: JSX.Element }) {
  const isDesktop = useIsDesktop();
  const [isExpanded, setIsExpanded] = createSignal(readExpanded());
  const [isMobileOpen, setIsMobileOpen] = createSignal(false);

  const effectiveExpanded = createMemo(() => (isDesktop() ? isExpanded() : true));
  const effectiveMobileOpen = createMemo(() => (isDesktop() ? false : isMobileOpen()));

  createEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, isExpanded() ? "expanded" : "collapsed");
    } catch {
      // ignore private-mode storage errors
    }
  });

  createEffect(() => {
    document.body.style.overflow = effectiveMobileOpen() ? "hidden" : "";
  });
  onCleanup(() => {
    document.body.style.overflow = "";
  });

  const toggleSidebar = () => setIsExpanded((v) => !v);
  const toggleMobileSidebar = () => setIsMobileOpen((v) => !v);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const value: SidebarContextValue = {
    isExpanded: effectiveExpanded,
    isMobileOpen: effectiveMobileOpen,
    isDesktop,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setExpanded: setIsExpanded,
  };

  return <SidebarContext.Provider value={value}>{props.children}</SidebarContext.Provider>;
}

export function useAdminSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}
