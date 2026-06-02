import { adminConfig } from "@/config/admin.config";
import * as api from "./client";
import * as demo from "./demo";

export type {
  DashboardStats,
  PortalUserRow,
  PublicAdmin,
} from "./types";
export { AdminApiError } from "./types";

const isDemo = adminConfig.demo.enabled;

export async function adminLogin(username: string, password: string) {
  if (isDemo) return demo.demoLogin(username, password);
  return api.apiLogin(username, password);
}

export async function adminLogout() {
  if (isDemo) return demo.demoLogout();
  return api.apiLogout();
}

export async function fetchCurrentAdmin() {
  if (isDemo) return demo.demoFetchCurrentAdmin();
  return api.apiFetchCurrentAdmin();
}

export async function fetchAdminStats() {
  if (isDemo) return demo.demoFetchStats();
  return api.apiFetchStats();
}

export async function fetchPortalUsers() {
  if (isDemo) return demo.demoFetchUsers();
  return api.apiFetchUsers();
}

export function isDemoMode() {
  return isDemo;
}
