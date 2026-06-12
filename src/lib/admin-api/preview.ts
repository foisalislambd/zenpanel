import { adminConfig } from "@/config/admin.config";
import type { DashboardStats, PortalUserRow, PublicAdmin } from "./types";

const SESSION_KEY = adminConfig.storageKeys.session;

function readSession(): PublicAdmin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublicAdmin;
  } catch {
    return null;
  }
}

function writeSession(admin: PublicAdmin | null) {
  if (typeof window === "undefined") return;
  if (admin) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

const emptyStats: DashboardStats = {
  totalUsers: 0,
  usersByProvider: { email: 0, google: 0, apple: 0, discord: 0 },
  newUsersLast7Days: 0,
  totalAdmins: 0,
};

function getCredentials() {
  const username = process.env.NEXT_PUBLIC_ADMIN_USER?.trim() ?? "";
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() ?? "";
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
  return { username, email, password };
}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function previewLogin(username: string, password: string) {
  await delay();
  const { username: user, email, password: pass } = getCredentials();

  if (!user || !pass) {
    throw new Error(
      "Admin login is not configured. Set NEXT_PUBLIC_ADMIN_USER and NEXT_PUBLIC_ADMIN_PASSWORD.",
    );
  }

  const normalized = username.trim().toLowerCase();
  const valid =
    normalized === user.toLowerCase() ||
    (email.length > 0 && normalized === email.toLowerCase());

  if (!valid || password !== pass) {
    throw new Error("Invalid username or password");
  }

  const admin: PublicAdmin = {
    id: "admin-1",
    username: user,
    email: email || `${user}@localhost`,
    role: "admin",
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  writeSession(admin);
  return { success: true as const, admin };
}

export async function previewLogout() {
  await delay(80);
  writeSession(null);
  return { success: true as const };
}

export async function previewFetchCurrentAdmin(): Promise<PublicAdmin | null> {
  await delay(80);
  return readSession();
}

export async function previewFetchStats() {
  await delay();
  return { success: true as const, stats: emptyStats };
}

export async function previewFetchUsers() {
  await delay();
  return { success: true as const, users: [] as PortalUserRow[] };
}
