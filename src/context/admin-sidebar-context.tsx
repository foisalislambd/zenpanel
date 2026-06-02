"use client";

import { adminConfig } from "@/config/admin.config";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 80;

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

const DESKTOP_BREAKPOINT = 1024;
const STORAGE_KEY = adminConfig.storageKeys.sidebarExpanded;

function subscribeDesktop(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getDesktopSnapshot() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function getServerDesktopSnapshot() {
  return false;
}

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setIsExpanded(stored === "true");
    });

    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setIsMobileOpen(false);
      } else {
        setIsExpanded(true);
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem(STORAGE_KEY, String(isExpanded));
    }
  }, [isExpanded, isDesktop]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen && !isDesktop ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, isDesktop]);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((v) => !v);
  }, []);

  const toggleMobileSidebar = useCallback(() => setIsMobileOpen((v) => !v), []);
  const closeMobileSidebar = useCallback(() => setIsMobileOpen(false), []);

  const value = useMemo(
    () => ({
      isExpanded,
      isMobileOpen,
      isDesktop,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      setExpanded: setIsExpanded,
    }),
    [isExpanded, isMobileOpen, isDesktop, toggleSidebar, toggleMobileSidebar, closeMobileSidebar],
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
