/**
 * Client-side admin session (localStorage) until a real API is wired.
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
