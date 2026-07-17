import { getContext, setContext } from "svelte";
import { previewLogin, type PublicAdmin } from "@/lib/admin-api";

const STORAGE_KEY = "zenpanel-preview-admin";

export const ADMIN_AUTH_KEY = Symbol("admin-auth");

export type AdminAuthContext = ReturnType<typeof createAdminAuth>;

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

export function createAdminAuth() {
  let admin = $state<PublicAdmin | null>(readStoredAdmin());

  async function login(username?: string) {
    const res = await previewLogin(username);
    admin = res.admin;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.admin));
    } catch {
      // Ignore quota / private-mode failures — in-memory auth still works.
    }
  }

  function logout() {
    admin = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const ctx = {
    get admin() {
      return admin;
    },
    loading: false,
    login,
    logout,
  };

  setContext(ADMIN_AUTH_KEY, ctx);
  return ctx;
}

export function useAdminAuth() {
  const ctx = getContext<AdminAuthContext>(ADMIN_AUTH_KEY);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
