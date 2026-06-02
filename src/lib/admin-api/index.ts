/**
 * Browser-only mock auth & dashboard data for UI preview.
 * Replace with real fetch logic in your product repo when backend exists.
 */
export type {
  DashboardStats,
  PortalUserRow,
  PublicAdmin,
} from "./types";

export {
  previewLogin,
  previewLogout,
  previewFetchCurrentAdmin,
  previewFetchStats,
  previewFetchUsers,
} from "./preview";
