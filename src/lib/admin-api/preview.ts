import { delay } from "@/lib/delay";
import type {
  ActivityItem,
  ChartDataPoint,
  DashboardStats,
  PortalUserRow,
  PublicAdmin,
  RecentOrder,
} from "./types";

const ADMIN_ACCOUNT_CREATED_AT = "2024-01-15T10:00:00.000Z";

function daysAgo(days: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/**
 * Dashboard preview sample data.
 * Counts that belong to empty resource pages (messages, projects, newsletter, blog) stay at 0.
 */
const demoStats: DashboardStats = {
  totalUsers: 2847,
  usersByProvider: { email: 1420, google: 890, apple: 312, discord: 225 },
  newUsersLast7Days: 186,
  totalAdmins: 4,
  totalRevenue: 48250,
  revenueChangePercent: 12.4,
  newOrdersLast7Days: 42,
  ordersChangePercent: 8.2,
  unreadMessages: 0,
  totalProjects: 0,
  newsletterSubscribers: 0,
  publishedPosts: 0,
};

const demoUsers: PortalUserRow[] = [
  {
    id: "u-1",
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    authProvider: "google",
    createdAt: daysAgo(0, 9),
  },
  {
    id: "u-2",
    name: "James Chen",
    email: "james.chen@example.com",
    authProvider: "email",
    createdAt: daysAgo(1, 14),
  },
  {
    id: "u-3",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    authProvider: "discord",
    createdAt: daysAgo(2, 11),
  },
  {
    id: "u-4",
    name: "Michael O'Brien",
    email: "michael.ob@example.com",
    authProvider: "apple",
    createdAt: daysAgo(3, 16),
  },
  {
    id: "u-5",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    authProvider: "email",
    createdAt: daysAgo(4, 10),
  },
];

const demoChart: ChartDataPoint[] = [
  { label: "Mon", revenue: 4200, orders: 4 },
  { label: "Tue", revenue: 5800, orders: 6 },
  { label: "Wed", revenue: 3900, orders: 3 },
  { label: "Thu", revenue: 7200, orders: 8 },
  { label: "Fri", revenue: 6100, orders: 5 },
  { label: "Sat", revenue: 8400, orders: 9 },
  { label: "Sun", revenue: 7650, orders: 7 },
];

const demoActivity: ActivityItem[] = [
  {
    id: "a-1",
    type: "order",
    title: "New service order",
    description: "Website redesign package ordered by Acme Corp",
    timestamp: daysAgo(0, 8),
    meta: "$2,400",
  },
  {
    id: "a-2",
    type: "user",
    title: "New user registered",
    description: "Sarah Mitchell signed up via Google",
    timestamp: daysAgo(0, 9),
  },
  {
    id: "a-3",
    type: "payment",
    title: "Payment received",
    description: "Stripe deposit confirmed for order #1042",
    timestamp: daysAgo(0, 11),
    meta: "$850",
  },
  {
    id: "a-4",
    type: "order",
    title: "Order completed",
    description: "SEO Audit for TechFlow Ltd marked complete",
    timestamp: daysAgo(1, 14),
    meta: "$450",
  },
  {
    id: "a-5",
    type: "user",
    title: "New user registered",
    description: "James Chen signed up via email",
    timestamp: daysAgo(1, 14),
  },
  {
    id: "a-6",
    type: "payment",
    title: "Payment received",
    description: "Invoice settled for Brand Identity package",
    timestamp: daysAgo(2, 10),
    meta: "$1,800",
  },
];

const demoOrders: RecentOrder[] = [
  {
    id: "ORD-1048",
    customer: "Acme Corp",
    service: "Website Redesign",
    amount: 2400,
    status: "processing",
    createdAt: daysAgo(0, 8),
  },
  {
    id: "ORD-1047",
    customer: "TechFlow Ltd",
    service: "SEO Audit",
    amount: 450,
    status: "completed",
    createdAt: daysAgo(1, 14),
  },
  {
    id: "ORD-1046",
    customer: "GreenLeaf Studio",
    service: "Brand Identity",
    amount: 1800,
    status: "pending",
    createdAt: daysAgo(1, 9),
  },
  {
    id: "ORD-1045",
    customer: "Nova Digital",
    service: "Mobile App Dev",
    amount: 5200,
    status: "processing",
    createdAt: daysAgo(2, 16),
  },
  {
    id: "ORD-1044",
    customer: "Pixel Works",
    service: "Logo Design",
    amount: 350,
    status: "completed",
    createdAt: daysAgo(3, 11),
  },
];

export async function previewLogin(username = "admin") {
  await delay();

  const name = username.trim() || "admin";
  const admin: PublicAdmin = {
    id: "admin-1",
    username: name,
    email: `${name}@example.com`,
    role: "admin",
    lastLoginAt: new Date().toISOString(),
    createdAt: ADMIN_ACCOUNT_CREATED_AT,
  };

  return { success: true as const, admin };
}

export async function previewFetchStats() {
  await delay();
  return { success: true as const, stats: demoStats };
}

export async function previewFetchUsers() {
  await delay();
  return { success: true as const, users: demoUsers };
}

export async function previewFetchChartData() {
  await delay();
  return { success: true as const, chart: demoChart };
}

export async function previewFetchActivity() {
  await delay();
  return { success: true as const, activity: demoActivity };
}

export async function previewFetchRecentOrders() {
  await delay();
  return { success: true as const, orders: demoOrders };
}
