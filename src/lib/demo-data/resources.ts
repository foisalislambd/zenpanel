export type DemoResource = {
  id: string;
  title: string;
  status: "published" | "draft" | "archived";
  updatedAt: string;
  meta?: string;
};

export const demoProjects: DemoResource[] = [
  {
    id: "p1",
    title: "E-commerce Platform",
    status: "published",
    updatedAt: "2026-05-20",
    meta: "Next.js · Stripe",
  },
  {
    id: "p2",
    title: "SaaS Dashboard",
    status: "published",
    updatedAt: "2026-05-15",
    meta: "React · Tailwind",
  },
  {
    id: "p3",
    title: "Mobile Banking App",
    status: "draft",
    updatedAt: "2026-05-10",
    meta: "React Native",
  },
];

export const demoServices: DemoResource[] = [
  {
    id: "s1",
    title: "Web Development",
    status: "published",
    updatedAt: "2026-05-18",
    meta: "$2,500+",
  },
  {
    id: "s2",
    title: "UI/UX Design",
    status: "published",
    updatedAt: "2026-05-12",
    meta: "$1,200+",
  },
  {
    id: "s3",
    title: "Consulting",
    status: "draft",
    updatedAt: "2026-05-08",
    meta: "$150/hr",
  },
];

export const demoBlogPosts: DemoResource[] = [
  {
    id: "b1",
    title: "Building Scalable APIs",
    status: "published",
    updatedAt: "2026-05-22",
    meta: "12 min read",
  },
  {
    id: "b2",
    title: "Next.js 16 Features",
    status: "published",
    updatedAt: "2026-05-19",
    meta: "8 min read",
  },
  {
    id: "b3",
    title: "TypeScript Best Practices",
    status: "draft",
    updatedAt: "2026-05-14",
    meta: "15 min read",
  },
];

export const demoProducts: DemoResource[] = [
  {
    id: "pr1",
    title: "Premium UI Kit",
    status: "published",
    updatedAt: "2026-05-21",
    meta: "$49",
  },
  {
    id: "pr2",
    title: "Admin Template",
    status: "published",
    updatedAt: "2026-05-17",
    meta: "$79",
  },
  {
    id: "pr3",
    title: "Icon Pack",
    status: "archived",
    updatedAt: "2026-04-30",
    meta: "$19",
  },
];

export const demoServiceOrders: DemoResource[] = [
  {
    id: "so1",
    title: "Order #1042 — Web Development",
    status: "published",
    updatedAt: "2026-05-28",
    meta: "In progress · $2,500",
  },
  {
    id: "so2",
    title: "Order #1041 — UI/UX Design",
    status: "draft",
    updatedAt: "2026-05-27",
    meta: "Pending · $1,200",
  },
];

export const demoTransactions: DemoResource[] = [
  {
    id: "t1",
    title: "Deposit — USDT",
    status: "published",
    updatedAt: "2026-05-28",
    meta: "+$500.00",
  },
  {
    id: "t2",
    title: "Purchase — Premium UI Kit",
    status: "published",
    updatedAt: "2026-05-27",
    meta: "-$49.00",
  },
  {
    id: "t3",
    title: "Withdrawal",
    status: "draft",
    updatedAt: "2026-05-26",
    meta: "-$200.00",
  },
];

export const demoPayments: DemoResource[] = [
  {
    id: "pay1",
    title: "NOWPayments — BTC",
    status: "published",
    updatedAt: "2026-05-28",
    meta: "Confirmed · $500",
  },
  {
    id: "pay2",
    title: "NOWPayments — ETH",
    status: "draft",
    updatedAt: "2026-05-27",
    meta: "Waiting · $120",
  },
];

export const demoCategories: DemoResource[] = [
  {
    id: "c1",
    title: "Development",
    status: "published",
    updatedAt: "2026-05-20",
    meta: "3 subcategories",
  },
  {
    id: "c2",
    title: "Design",
    status: "published",
    updatedAt: "2026-05-18",
    meta: "2 subcategories",
  },
];

export const demoNewsletter: DemoResource[] = [
  {
    id: "n1",
    title: "sarah.chen@example.com",
    status: "published",
    updatedAt: "2026-05-28",
    meta: "Active",
  },
  {
    id: "n2",
    title: "james@example.com",
    status: "published",
    updatedAt: "2026-05-25",
    meta: "Active",
  },
  {
    id: "n3",
    title: "unsubscribed@example.com",
    status: "archived",
    updatedAt: "2026-05-10",
    meta: "Unsubscribed",
  },
];

export const demoMessages: DemoResource[] = [
  {
    id: "m1",
    title: "Sarah Chen",
    status: "published",
    updatedAt: "2026-05-28",
    meta: "Hi, I'm interested in your services…",
  },
  {
    id: "m2",
    title: "James Wilson",
    status: "draft",
    updatedAt: "2026-05-27",
    meta: "Can you provide a quote for…",
  },
];
