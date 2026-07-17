"use client";

import { previewLogin, type PublicAdmin } from "@/lib/admin-api";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AdminAuthContextValue = {
  admin: PublicAdmin | null;
  loading: boolean;
  login: (username?: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<PublicAdmin | null>(null);

  const login = useCallback(async (username?: string) => {
    const res = await previewLogin(username);
    setAdmin(res.admin);
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, loading: false, login, logout }),
    [admin, login, logout],
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
