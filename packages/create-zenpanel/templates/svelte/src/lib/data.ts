export const previewStats = {
  totalUsers: 1284,
  totalRevenue: 48250,
  newOrdersLast7Days: 37,
  unreadMessages: 12,
};

export const previewUsers = [
  { name: "Ava Chen", email: "ava@example.com", provider: "google", joined: "2026-07-01" },
  { name: "Ben Ortiz", email: "ben@example.com", provider: "email", joined: "2026-07-03" },
  { name: "Cara Miles", email: "cara@example.com", provider: "apple", joined: "2026-07-08" },
  { name: "Devon Park", email: "devon@example.com", provider: "discord", joined: "2026-07-12" },
];

export const previewOrders = [
  { id: "SO-1042", customer: "Ava Chen", amount: "$120", status: "Paid" },
  { id: "SO-1041", customer: "Ben Ortiz", amount: "$80", status: "Pending" },
  { id: "SO-1040", customer: "Cara Miles", amount: "$240", status: "Paid" },
];

export const resourceSamples: Record<string, string[]> = {
  projects: ["Launch site redesign", "Mobile app MVP", "Brand guidelines"],
  services: ["Consulting", "Design system", "Retainer support"],
  "service-orders": ["SO-1042", "SO-1041", "SO-1040"],
  transactions: ["TX-8821", "TX-8820", "TX-8819"],
  payments: ["Stripe deposit", "PayPal payout", "Bank transfer"],
  blog: ["Shipping the admin shell", "Dark mode tips", "Preview auth notes"],
  products: ["Starter kit", "Pro license", "Team seat"],
  categories: ["Marketing", "Engineering", "Operations"],
  messages: [],
  newsletter: ["weekly@example.com", "news@example.com"],
  users: previewUsers.map((u) => u.email),
};
