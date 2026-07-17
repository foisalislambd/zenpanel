import { previewLogin, type PublicAdmin } from "@/lib/admin-api";
import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";

const STORAGE_KEY = "zenpanel-preview-admin";

type AdminAuthContextValue = {
  admin: Accessor<PublicAdmin | null>;
  loading: boolean;
  login: (username?: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue>();

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

export function AdminAuthProvider(props: { children: JSX.Element }) {
  const [admin, setAdmin] = createSignal<PublicAdmin | null>(readStoredAdmin());

  async function login(username?: string) {
    const res = await previewLogin(username);
    setAdmin(res.admin);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.admin));
    } catch {
      // Ignore quota / private-mode failures — in-memory auth still works.
    }
  }

  function logout() {
    setAdmin(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const value: AdminAuthContextValue = { admin, loading: false, login, logout };

  return <AdminAuthContext.Provider value={value}>{props.children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
