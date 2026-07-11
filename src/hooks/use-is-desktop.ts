"use client";

import { useSyncExternalStore } from "react";

export const DESKTOP_BREAKPOINT = 1024;

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

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );
}
