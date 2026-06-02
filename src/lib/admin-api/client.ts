import { adminConfig } from "@/config/admin.config";
import type { DashboardStats, PortalUserRow, PublicAdmin } from "./types";
import { AdminApiError } from "./types";

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = adminConfig.api.baseUrl.replace(/\/$/, "");
  if (!base) {
    throw new AdminApiError(
      "NEXT_PUBLIC_ADMIN_API_URL is not set. Remove it to use demo mode, or set a valid API URL.",
      0,
    );
  }
  let res: Response;

  try {
    res = await fetch(`${base}${adminConfig.api.prefix}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new AdminApiError(
      "Cannot reach the API server. Check NEXT_PUBLIC_ADMIN_API_URL.",
      0,
    );
  }

  const text = await res.text();
  let data: unknown = {};

  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new AdminApiError("Invalid response from server", res.status);
    }
  }

  if (!res.ok) {
    const err = data as { message?: string };
    throw new AdminApiError(err.message ?? "Request failed", res.status);
  }

  return data as T;
}

export async function apiLogin(username: string, password: string) {
  return adminFetch<{ success: true; admin: PublicAdmin }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function apiLogout() {
  return adminFetch<{ success: true }>("/auth/logout", { method: "POST" });
}

export async function apiFetchCurrentAdmin(): Promise<PublicAdmin | null> {
  const data = await adminFetch<{ success: true; admin: PublicAdmin | null }>(
    "/auth/me",
  );
  return data.admin ?? null;
}

export async function apiFetchStats() {
  return adminFetch<{ success: true; stats: DashboardStats }>("/stats");
}

export async function apiFetchUsers() {
  return adminFetch<{ success: true; users: PortalUserRow[] }>("/users");
}
