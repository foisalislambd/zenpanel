import { adminConfig } from "@/config/admin.config";
import type {
  ActivityItem,
  ChartDataPoint,
  DashboardStats,
  PortalUserRow,
  PublicAdmin,
  RecentOrder,
} from "./types";

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

function daysAgo(days: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const demoStats: DashboardStats = {
  totalUsers: 2847,
  usersByProvider: { email: 1420, google: 890, apple: 312, discord: 225 },
  newUsersLast7Days: 186,
  totalAdmins: 4,
  totalRevenue: 48250,
  revenueChangePercent: 12.4,
  newOrdersLast7Days: 42,
  ordersChangePercent: 8.2,
  unreadMessages: 7,
  totalProjects: 18,
  newsletterSubscribers: 1204,
  publishedPosts: 42,
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
    type: "message",
    title: "New contact message",
    description: "Inquiry about enterprise pricing from TechFlow Ltd",
    timestamp: daysAgo(1, 15),
  },
  {
    id: "a-5",
    type: "blog",
    title: "Blog post published",
    description: "“10 Tips for Better UX” is now live",
    timestamp: daysAgo(1, 10),
  },
  {
    id: "a-6",
    type: "newsletter",
    title: "Newsletter subscriber",
    description: "alex.k@startup.io joined the mailing list",
    timestamp: daysAgo(2, 13),
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

function getCredentials() {
  const username = process.env.NEXT_PUBLIC_ADMIN_USER?.trim() ?? "";
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() ?? "";
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
  return { username, email, password };
}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function previewLogin(username: string, password: string) {
  await delay();
  const { username: user, email, password: pass } = getCredentials();

  if (!user || !pass) {
    throw new Error(
      "Admin login is not configured. Set NEXT_PUBLIC_ADMIN_USER and NEXT_PUBLIC_ADMIN_PASSWORD.",
    );
  }

  const normalized = username.trim().toLowerCase();
  const valid =
    normalized === user.toLowerCase() ||
    (email.length > 0 && normalized === email.toLowerCase());

  if (!valid || password !== pass) {
    throw new Error("Invalid username or password");
  }

  const admin: PublicAdmin = {
    id: "admin-1",
    username: user,
    email: email || `${user}@localhost`,
    role: "admin",
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  writeSession(admin);
  return { success: true as const, admin };
}

export async function previewLogout() {
  await delay(80);
  writeSession(null);
  return { success: true as const };
}

export async function previewFetchCurrentAdmin(): Promise<PublicAdmin | null> {
  await delay(80);
  return readSession();
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
