/**
 * Shared admin route mapping — mirrors Solid's admin-routes.tsx.
 * Used by App.svelte for route-to-page resolution.
 */
import type { AdminRouteId } from "@/lib/router.svelte";

export const adminRouteIds: AdminRouteId[] = [
  "admin-login",
  "admin-dashboard",
  "admin-projects",
  "admin-services",
  "admin-service-orders",
  "admin-transactions",
  "admin-payments",
  "admin-blog",
  "admin-products",
  "admin-categories",
  "admin-messages",
  "admin-newsletter",
  "admin-users",
  "admin-settings",
];
