/**
 * In-memory preview helpers for the admin UI shell.
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
} from './types';

export {
  previewLogin,
  previewFetchStats,
  previewFetchUsers,
  previewFetchChartData,
  previewFetchActivity,
  previewFetchRecentOrders,
} from './preview';
