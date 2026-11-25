import { previewLogin, type PublicAdmin } from "@/lib/admin-api";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
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

function readStoredAdmin(): PublicAdmin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublicAdmin;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<PublicAdmin | null>(() => readStoredAdmin());

  const login = useCallback(async (username?: string) => {
    const res = await previewLogin(username);
    setAdmin(res.admin);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.admin));
    } catch {
      // Ignore quota / private-mode failures - in-memory auth still works.
    }
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<PublicAdmin, "username" | "email">>) => {
    setAdmin((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ admin, loading: false, login, logout, updateProfile }),
    [admin, login, logout, updateProfile],
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
