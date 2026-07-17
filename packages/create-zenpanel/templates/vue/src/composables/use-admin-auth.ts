import { inject, provide, ref, type InjectionKey } from "vue";
import { previewLogin, type PublicAdmin } from "@/lib/admin-api";

const STORAGE_KEY = "zenpanel-preview-admin";

export type AdminAuthContext = {
  admin: PublicAdmin | null;
  loading: boolean;
  login: (username?: string) => Promise<void>;
  logout: () => void;
};

export const AdminAuthKey: InjectionKey<AdminAuthContext> = Symbol("admin-auth");

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

export function provideAdminAuth() {
  const admin = ref<PublicAdmin | null>(readStoredAdmin());

  async function login(username?: string) {
    const res = await previewLogin(username);
    admin.value = res.admin;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.admin));
    } catch {
      // Ignore quota / private-mode failures — in-memory auth still works.
    }
  }

  function logout() {
    admin.value = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const ctx: AdminAuthContext = {
    get admin() {
      return admin.value;
    },
    loading: false,
    login,
    logout,
  };

  provide(AdminAuthKey, ctx);
  return ctx;
}

export function useAdminAuth() {
  const ctx = inject(AdminAuthKey);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
