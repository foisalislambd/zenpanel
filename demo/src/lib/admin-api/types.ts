export type PublicAdmin = {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export type DashboardStats = {
  totalUsers: number;
  usersByProvider: {
    email: number;
    google: number;
    apple: number;
    discord: number;
  };
  newUsersLast7Days: number;
  totalAdmins: number;
  totalRevenue: number;
  revenueChangePercent: number;
  newOrdersLast7Days: number;
  ordersChangePercent: number;
  unreadMessages: number;
  totalProjects: number;
  newsletterSubscribers: number;
  publishedPosts: number;
};

export type PortalUserRow = {
  id: string;
  name: string;
  email: string;
  authProvider: string;
  createdAt: string;
};

export type ChartDataPoint = {
  label: string;
  revenue: number;
  orders: number;
};

export type ActivityType =
  | "user"
  | "order"
  | "payment"
  | "message"
  | "blog"
  | "newsletter";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  meta?: string;
};

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type RecentOrder = {
  id: string;
  customer: string;
  service: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
};
