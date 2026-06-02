"use client";

import {
  previewFetchCurrentAdmin,
  previewLogin,
  previewLogout,
  type PublicAdmin,
} from "@/lib/admin-api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AdminAuthContextValue = {
  admin: PublicAdmin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<PublicAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = await previewFetchCurrentAdmin();
    setAdmin(current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      try {
        const current = await previewFetchCurrentAdmin();
        if (!cancelled) setAdmin(current);
      } catch {
        if (!cancelled) setAdmin(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await previewLogin(username, password);
    setAdmin(res.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await previewLogout();
    } finally {
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({ admin, loading, login, logout, refresh }),
    [admin, loading, login, logout, refresh],
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
