"use client";

import { previewLogin, type PublicAdmin } from "@/lib/admin-api";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "zenpanel-preview-admin";

type AdminAuthContextValue = {
  admin: PublicAdmin | null;
  loading: boolean;
  login: (username?: string) => Promise<void>;
  logout: () => void;
  /** Preview: update the signed-in admin's profile fields. */
  updateProfile: (patch: Partial<Pick<PublicAdmin, "username" | "email">>) => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

/* Session-scoped preview auth store (sessionStorage + in-memory fallback). */
let current: PublicAdmin | null | undefined;
const listeners = new Set<() => void>();

function readAdmin(): PublicAdmin | null {
  if (current === undefined) {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      current = raw ? (JSON.parse(raw) as PublicAdmin) : null;
    } catch {
      current = null;
    }
  }
  return current;
}

function writeAdmin(next: PublicAdmin | null) {
  current = next;
  try {
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore quota / private-mode failures - in-memory auth still works.
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const noopSubscribe = () => () => {};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const admin = useSyncExternalStore(subscribe, readAdmin, () => null);
  // `false` during SSR / hydration, `true` once the client store is readable.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const login = useCallback(async (username?: string) => {
    const res = await previewLogin(username);
    writeAdmin(res.admin);
  }, []);

  const logout = useCallback(() => writeAdmin(null), []);

  const updateProfile = useCallback((patch: Partial<Pick<PublicAdmin, "username" | "email">>) => {
    const prev = readAdmin();
    if (prev) writeAdmin({ ...prev, ...patch });
  }, []);

  const value = useMemo(
    () => ({ admin, loading: !hydrated, login, logout, updateProfile }),
    [admin, hydrated, login, logout, updateProfile],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
