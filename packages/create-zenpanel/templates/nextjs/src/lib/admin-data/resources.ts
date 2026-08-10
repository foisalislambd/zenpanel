export type AdminResourceStatus = "published" | "draft" | "archived";

export type AdminResource = {
  id: string;
  title: string;
  status: AdminResourceStatus;
  updatedAt: string;
  meta?: string;
};

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

export const adminProjects: AdminResource[] = [
  {
    id: "prj-1",
    title: "Acme website redesign",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "Web · Featured",
  },
  {
    id: "prj-2",
    title: "Nova mobile app",
    status: "draft",
    updatedAt: daysAgo(3),
    meta: "iOS / Android",
  },
  {
    id: "prj-3",
    title: "GreenLeaf brand kit",
    status: "published",
    updatedAt: daysAgo(8),
    meta: "Branding",
  },
  {
    id: "prj-4",
    title: "Legacy portal archive",
    status: "archived",
    updatedAt: daysAgo(40),
    meta: "Internal",
  },
];

export const adminServices: AdminResource[] = [
  {
    id: "svc-1",
    title: "Website redesign",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "$2,400 · 4 weeks",
  },
  {
    id: "svc-2",
    title: "SEO audit",
    status: "published",
    updatedAt: daysAgo(5),
    meta: "$450 · 1 week",
  },
  {
    id: "svc-3",
    title: "Brand identity",
    status: "draft",
    updatedAt: daysAgo(6),
    meta: "$1,800 · 3 weeks",
  },
  {
    id: "svc-4",
    title: "Legacy support plan",
    status: "archived",
    updatedAt: daysAgo(60),
    meta: "Retired",
  },
];

export const adminBlogPosts: AdminResource[] = [
  {
    id: "post-1",
    title: "How we ship admin panels faster",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "Product · 6 min read",
  },
  {
    id: "post-2",
    title: "Designing searchable data tables",
    status: "draft",
    updatedAt: daysAgo(4),
    meta: "Design · Draft",
  },
  {
    id: "post-3",
    title: "Q2 product changelog",
    status: "published",
    updatedAt: daysAgo(12),
    meta: "Changelog",
  },
];

export const adminProducts: AdminResource[] = [
  {
    id: "prod-1",
    title: "Starter license",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "$49 · Digital",
  },
  {
    id: "prod-2",
    title: "Pro license",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "$149 · Digital",
  },
  {
    id: "prod-3",
    title: "Agency bundle",
    status: "draft",
    updatedAt: daysAgo(7),
    meta: "$399 · Bundle",
  },
  {
    id: "prod-4",
    title: "Legacy addon",
    status: "archived",
    updatedAt: daysAgo(90),
    meta: "Discontinued",
  },
];

export const adminCategories: AdminResource[] = [
  {
    id: "cat-1",
    title: "Web development",
    status: "published",
    updatedAt: daysAgo(3),
    meta: "12 items",
  },
  {
    id: "cat-2",
    title: "Design",
    status: "published",
    updatedAt: daysAgo(5),
    meta: "8 items",
  },
  {
    id: "cat-3",
    title: "Marketing",
    status: "draft",
    updatedAt: daysAgo(9),
    meta: "3 items",
  },
];

export const adminTransactions: AdminResource[] = [
  {
    id: "txn-1",
    title: "Wallet top-up",
    status: "published",
    updatedAt: daysAgo(0),
    meta: "+$250 · Stripe",
  },
  {
    id: "txn-2",
    title: "Service payment",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "-$450 · ORD-1047",
  },
  {
    id: "txn-3",
    title: "Refund pending",
    status: "draft",
    updatedAt: daysAgo(2),
    meta: "+$85 · Review",
  },
  {
    id: "txn-4",
    title: "Failed payout",
    status: "archived",
    updatedAt: daysAgo(10),
    meta: "-$120 · Bank",
  },
];

export const adminPayments: AdminResource[] = [
  {
    id: "pay-1",
    title: "Stripe deposit",
    status: "published",
    updatedAt: daysAgo(0),
    meta: "$850 · Completed",
  },
  {
    id: "pay-2",
    title: "Invoice #1042",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "$1,800 · Settled",
  },
  {
    id: "pay-3",
    title: "PayPal deposit",
    status: "draft",
    updatedAt: daysAgo(3),
    meta: "$320 · Pending",
  },
  {
    id: "pay-4",
    title: "Chargeback case",
    status: "archived",
    updatedAt: daysAgo(18),
    meta: "$99 · Closed",
  },
];

/** Empty until you connect your API — not tagged in the shared list UI demo. */
export const adminServiceOrders: AdminResource[] = [];
export const adminNewsletter: AdminResource[] = [];
