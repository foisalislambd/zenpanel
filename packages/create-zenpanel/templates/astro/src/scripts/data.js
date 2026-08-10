function daysAgo(days, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Dashboard preview sample data — matches Next.js preview.ts */
export const demoStats = {
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

export const demoUsers = [
  {
    id: "u-1",
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    authProvider: "google",
    createdAt: daysAgo(0, 9),
    country: "United States",
    phone: "+1 415 555 0182",
    status: "active",
    emailVerified: true,
    lastIp: "104.28.41.12",
  },
  {
    id: "u-2",
    name: "James Chen",
    email: "james.chen@example.com",
    authProvider: "email",
    createdAt: daysAgo(1, 14),
    country: "Singapore",
    phone: "+65 8123 4567",
    status: "active",
    emailVerified: false,
    lastIp: "103.25.88.41",
  },
  {
    id: "u-3",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    authProvider: "discord",
    createdAt: daysAgo(2, 11),
    country: "Spain",
    phone: null,
    status: "active",
    emailVerified: true,
    lastIp: "88.12.203.55",
  },
  {
    id: "u-4",
    name: "Michael O'Brien",
    email: "michael.ob@example.com",
    authProvider: "apple",
    createdAt: daysAgo(3, 16),
    country: "Ireland",
    phone: "+353 87 123 4567",
    status: "banned",
    emailVerified: true,
    lastIp: "78.153.201.9",
  },
  {
    id: "u-5",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    authProvider: "email",
    createdAt: daysAgo(4, 10),
    country: "India",
    phone: "+91 98765 43210",
    status: "active",
    emailVerified: true,
    lastIp: "49.36.112.88",
  },
  {
    id: "u-6",
    name: "foisal",
    email: "ifoisal463@gmail.com",
    authProvider: "email",
    createdAt: "2026-07-20T10:00:00.000Z",
    country: null,
    phone: null,
    status: "active",
    emailVerified: false,
    lastIp: "103.112.45.19",
  },
];

export const demoChart = [
  { label: "Mon", revenue: 4200, orders: 4 },
  { label: "Tue", revenue: 5800, orders: 6 },
  { label: "Wed", revenue: 3900, orders: 3 },
  { label: "Thu", revenue: 7200, orders: 8 },
  { label: "Fri", revenue: 6100, orders: 5 },
  { label: "Sat", revenue: 8400, orders: 9 },
  { label: "Sun", revenue: 7650, orders: 7 },
];

export const demoActivity = [
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

export const demoOrders = [
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

function resourceDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

export const adminProjects = [
  {
    id: "prj-1",
    title: "Acme website redesign",
    status: "published",
    updatedAt: resourceDaysAgo(1),
    meta: "Web · Featured",
  },
  {
    id: "prj-2",
    title: "Nova mobile app",
    status: "draft",
    updatedAt: resourceDaysAgo(3),
    meta: "iOS / Android",
  },
  {
    id: "prj-3",
    title: "GreenLeaf brand kit",
    status: "published",
    updatedAt: resourceDaysAgo(8),
    meta: "Branding",
  },
  {
    id: "prj-4",
    title: "Legacy portal archive",
    status: "archived",
    updatedAt: resourceDaysAgo(40),
    meta: "Internal",
  },
];

export const adminServices = [
  {
    id: "svc-1",
    title: "Website redesign",
    status: "published",
    updatedAt: resourceDaysAgo(2),
    meta: "$2,400 · 4 weeks",
  },
  {
    id: "svc-2",
    title: "SEO audit",
    status: "published",
    updatedAt: resourceDaysAgo(5),
    meta: "$450 · 1 week",
  },
  {
    id: "svc-3",
    title: "Brand identity",
    status: "draft",
    updatedAt: resourceDaysAgo(6),
    meta: "$1,800 · 3 weeks",
  },
  {
    id: "svc-4",
    title: "Legacy support plan",
    status: "archived",
    updatedAt: resourceDaysAgo(60),
    meta: "Retired",
  },
];

export const adminBlogPosts = [
  {
    id: "post-1",
    title: "How we ship admin panels faster",
    status: "published",
    updatedAt: resourceDaysAgo(2),
    meta: "Product · 6 min read",
  },
  {
    id: "post-2",
    title: "Designing searchable data tables",
    status: "draft",
    updatedAt: resourceDaysAgo(4),
    meta: "Design · Draft",
  },
  {
    id: "post-3",
    title: "Q2 product changelog",
    status: "published",
    updatedAt: resourceDaysAgo(12),
    meta: "Changelog",
  },
];

export const adminProducts = [
  {
    id: "prod-1",
    title: "Starter license",
    status: "published",
    updatedAt: resourceDaysAgo(1),
    meta: "$49 · Digital",
  },
  {
    id: "prod-2",
    title: "Pro license",
    status: "published",
    updatedAt: resourceDaysAgo(1),
    meta: "$149 · Digital",
  },
  {
    id: "prod-3",
    title: "Agency bundle",
    status: "draft",
    updatedAt: resourceDaysAgo(7),
    meta: "$399 · Bundle",
  },
  {
    id: "prod-4",
    title: "Legacy addon",
    status: "archived",
    updatedAt: resourceDaysAgo(90),
    meta: "Discontinued",
  },
];

export const adminCategories = [
  {
    id: "cat-1",
    title: "Web development",
    status: "published",
    updatedAt: resourceDaysAgo(3),
    meta: "12 items",
  },
  {
    id: "cat-2",
    title: "Design",
    status: "published",
    updatedAt: resourceDaysAgo(5),
    meta: "8 items",
  },
  {
    id: "cat-3",
    title: "Marketing",
    status: "draft",
    updatedAt: resourceDaysAgo(9),
    meta: "3 items",
  },
];

export const adminTransactions = [
  {
    id: "txn-1",
    title: "Wallet top-up",
    status: "published",
    updatedAt: resourceDaysAgo(0),
    meta: "+$250 · Stripe",
  },
  {
    id: "txn-2",
    title: "Service payment",
    status: "published",
    updatedAt: resourceDaysAgo(1),
    meta: "-$450 · ORD-1047",
  },
  {
    id: "txn-3",
    title: "Refund pending",
    status: "draft",
    updatedAt: resourceDaysAgo(2),
    meta: "+$85 · Review",
  },
  {
    id: "txn-4",
    title: "Failed payout",
    status: "archived",
    updatedAt: resourceDaysAgo(10),
    meta: "-$120 · Bank",
  },
];

export const adminPayments = [
  {
    id: "pay-1",
    title: "Stripe deposit",
    status: "published",
    updatedAt: resourceDaysAgo(0),
    meta: "$850 · Completed",
  },
  {
    id: "pay-2",
    title: "Invoice #1042",
    status: "published",
    updatedAt: resourceDaysAgo(2),
    meta: "$1,800 · Settled",
  },
  {
    id: "pay-3",
    title: "PayPal deposit",
    status: "draft",
    updatedAt: resourceDaysAgo(3),
    meta: "$320 · Pending",
  },
  {
    id: "pay-4",
    title: "Chargeback case",
    status: "archived",
    updatedAt: resourceDaysAgo(18),
    meta: "$99 · Closed",
  },
];

/** Empty until you connect your API — not tagged in the shared list UI demo. */
export const adminServiceOrders = [];
export const adminNewsletter = [];
