"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useStoredValue } from "@/hooks/use-stored-value";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 80;
const SIDEBAR_STORAGE_KEY = "zenpanel-sidebar";

type SidebarContextValue = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setExpanded: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const [stored, setStored] = useStoredValue(SIDEBAR_STORAGE_KEY, "expanded");
  const isExpanded = stored !== "collapsed";
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const effectiveExpanded = isDesktop ? isExpanded : true;
  const effectiveMobileOpen = isDesktop ? false : isMobileOpen;

  useEffect(() => {
    document.body.style.overflow = effectiveMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [effectiveMobileOpen]);

  const toggleSidebar = useCallback(() => {
    setStored(isExpanded ? "collapsed" : "expanded");
  }, [isExpanded, setStored]);

  const toggleMobileSidebar = useCallback(() => setIsMobileOpen((v) => !v), []);
  const closeMobileSidebar = useCallback(() => setIsMobileOpen(false), []);
  const setExpanded = useCallback(
    (value: boolean) => setStored(value ? "expanded" : "collapsed"),
    [setStored],
  );

  const value = useMemo(
    () => ({
      isExpanded: effectiveExpanded,
      isMobileOpen: effectiveMobileOpen,
      isDesktop,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      setExpanded,
    }),
    [
      effectiveExpanded,
      effectiveMobileOpen,
      isDesktop,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      setExpanded,
    ],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useAdminSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return ctx;
}
