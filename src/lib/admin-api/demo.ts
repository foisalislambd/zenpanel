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

const demoAdmin: PublicAdmin = {
  id: "demo-admin-1",
  username: adminConfig.demo.credentials.username,
  email: adminConfig.demo.credentials.email,
  role: "superadmin",
  lastLoginAt: new Date().toISOString(),
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const demoStats: DashboardStats = {
  totalUsers: 1284,
  usersByProvider: { email: 620, google: 410, apple: 154, discord: 100 },
  newUsersLast7Days: 87,
  totalAdmins: 3,
};

export const demoUsers: PortalUserRow[] = [
  {
    id: "u1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    authProvider: "google",
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "u2",
    name: "James Wilson",
    email: "james@example.com",
    authProvider: "email",
    createdAt: "2026-05-27T14:30:00.000Z",
  },
  {
    id: "u3",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    authProvider: "discord",
    createdAt: "2026-05-26T09:15:00.000Z",
  },
  {
    id: "u4",
    name: "Alex Kim",
    email: "alex.kim@example.com",
    authProvider: "apple",
    createdAt: "2026-05-25T16:45:00.000Z",
  },
  {
    id: "u5",
    name: "Emma Brown",
    email: "emma@example.com",
    authProvider: "email",
    createdAt: "2026-05-24T11:20:00.000Z",
  },
  {
    id: "u6",
    name: "David Lee",
    email: "david.lee@example.com",
    authProvider: "google",
    createdAt: "2026-05-23T08:00:00.000Z",
  },
  {
    id: "u7",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    authProvider: "email",
    createdAt: "2026-05-22T13:30:00.000Z",
  },
  {
    id: "u8",
    name: "Tom Harris",
    email: "tom@example.com",
    authProvider: "google",
    createdAt: "2026-05-21T17:00:00.000Z",
  },
];

function delay(ms = 280) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function demoLogin(username: string, password: string) {
  await delay();
  const { username: demoUser, email, password: demoPass } = adminConfig.demo.credentials;
  const normalized = username.trim().toLowerCase();
  const validUser =
    normalized === demoUser.toLowerCase() ||
    normalized === email.trim().toLowerCase();
  if (!validUser || password !== demoPass) {
    throw new Error("Invalid username or password");
  }
  const admin = { ...demoAdmin, lastLoginAt: new Date().toISOString() };
  writeSession(admin);
  return { success: true as const, admin };
}

export async function demoLogout() {
  await delay(120);
  writeSession(null);
  return { success: true as const };
}

export async function demoFetchCurrentAdmin(): Promise<PublicAdmin | null> {
  await delay(150);
  return readSession();
}

export async function demoFetchStats() {
  await delay();
  return { success: true as const, stats: demoStats };
}

export async function demoFetchUsers() {
  await delay();
  return { success: true as const, users: demoUsers };
}
