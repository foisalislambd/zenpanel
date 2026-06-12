/**
 * Client-side admin session (localStorage) until a real API is wired.
 */
export type {
  ActivityItem,
  ActivityType,
  ChartDataPoint,
  DashboardStats,
  OrderStatus,
  PortalUserRow,
  PublicAdmin,
  RecentOrder,
} from "./types";

export {
  previewLogin,
  previewLogout,
  previewFetchCurrentAdmin,
  previewFetchStats,
  previewFetchUsers,
  previewFetchChartData,
  previewFetchActivity,
  previewFetchRecentOrders,
} from "./preview";
