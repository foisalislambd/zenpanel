// Generated from the shared ZenPanel TypeScript core - edit freely.
function daysAgo(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}
const adminProjects = [
  {
    id: "prj-1",
    title: "Acme website redesign",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "Web \xB7 Featured"
  },
  {
    id: "prj-2",
    title: "Nova mobile app",
    status: "draft",
    updatedAt: daysAgo(3),
    meta: "iOS / Android"
  },
  {
    id: "prj-3",
    title: "GreenLeaf brand kit",
    status: "published",
    updatedAt: daysAgo(8),
    meta: "Branding"
  },
  {
    id: "prj-4",
    title: "Legacy portal archive",
    status: "archived",
    updatedAt: daysAgo(40),
    meta: "Internal"
  }
];
const adminServices = [
  {
    id: "svc-1",
    title: "Website redesign",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "$2,400 \xB7 4 weeks"
  },
  {
    id: "svc-2",
    title: "SEO audit",
    status: "published",
    updatedAt: daysAgo(5),
    meta: "$450 \xB7 1 week"
  },
  {
    id: "svc-3",
    title: "Brand identity",
    status: "draft",
    updatedAt: daysAgo(6),
    meta: "$1,800 \xB7 3 weeks"
  },
  {
    id: "svc-4",
    title: "Legacy support plan",
    status: "archived",
    updatedAt: daysAgo(60),
    meta: "Retired"
  }
];
const adminBlogPosts = [
  {
    id: "post-1",
    title: "How we ship admin panels faster",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "Product \xB7 6 min read"
  },
  {
    id: "post-2",
    title: "Designing searchable data tables",
    status: "draft",
    updatedAt: daysAgo(4),
    meta: "Design \xB7 Draft"
  },
  {
    id: "post-3",
    title: "Q2 product changelog",
    status: "published",
    updatedAt: daysAgo(12),
    meta: "Changelog"
  }
];
const adminProducts = [
  {
    id: "prod-1",
    title: "Starter license",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "$49 \xB7 Digital"
  },
  {
    id: "prod-2",
    title: "Pro license",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "$149 \xB7 Digital"
  },
  {
    id: "prod-3",
    title: "Agency bundle",
    status: "draft",
    updatedAt: daysAgo(7),
    meta: "$399 \xB7 Bundle"
  },
  {
    id: "prod-4",
    title: "Legacy addon",
    status: "archived",
    updatedAt: daysAgo(90),
    meta: "Discontinued"
  }
];
const adminCategories = [
  {
    id: "cat-1",
    title: "Web development",
    status: "published",
    updatedAt: daysAgo(3),
    meta: "12 items"
  },
  {
    id: "cat-2",
    title: "Design",
    status: "published",
    updatedAt: daysAgo(5),
    meta: "8 items"
  },
  {
    id: "cat-3",
    title: "Marketing",
    status: "draft",
    updatedAt: daysAgo(9),
    meta: "3 items"
  }
];
const adminTransactions = [
  {
    id: "txn-1",
    title: "Wallet top-up",
    status: "published",
    updatedAt: daysAgo(0),
    meta: "+$250 \xB7 Stripe"
  },
  {
    id: "txn-2",
    title: "Service payment",
    status: "published",
    updatedAt: daysAgo(1),
    meta: "-$450 \xB7 ORD-1047"
  },
  {
    id: "txn-3",
    title: "Refund pending",
    status: "draft",
    updatedAt: daysAgo(2),
    meta: "+$85 \xB7 Review"
  },
  {
    id: "txn-4",
    title: "Failed payout",
    status: "archived",
    updatedAt: daysAgo(10),
    meta: "-$120 \xB7 Bank"
  }
];
const adminPayments = [
  {
    id: "pay-1",
    title: "Stripe deposit",
    status: "published",
    updatedAt: daysAgo(0),
    meta: "$850 \xB7 Completed"
  },
  {
    id: "pay-2",
    title: "Invoice #1042",
    status: "published",
    updatedAt: daysAgo(2),
    meta: "$1,800 \xB7 Settled"
  },
  {
    id: "pay-3",
    title: "PayPal deposit",
    status: "draft",
    updatedAt: daysAgo(3),
    meta: "$320 \xB7 Pending"
  },
  {
    id: "pay-4",
    title: "Chargeback case",
    status: "archived",
    updatedAt: daysAgo(18),
    meta: "$99 \xB7 Closed"
  }
];
const adminServiceOrders = [
  { id: "ORD-1048", title: "Acme Corp \xB7 Website redesign", status: "published", updatedAt: daysAgo(0), meta: "$2,400 \xB7 Paid" },
  { id: "ORD-1047", title: "TechFlow Ltd \xB7 SEO audit", status: "published", updatedAt: daysAgo(1), meta: "$450 \xB7 Paid" },
  { id: "ORD-1046", title: "GreenLeaf Studio \xB7 Brand identity", status: "draft", updatedAt: daysAgo(2), meta: "$1,800 \xB7 Awaiting payment" },
  { id: "ORD-1045", title: "Nova Digital \xB7 Mobile app dev", status: "published", updatedAt: daysAgo(4), meta: "$5,200 \xB7 Paid" },
  { id: "ORD-1044", title: "Pixel Works \xB7 Logo design", status: "archived", updatedAt: daysAgo(9), meta: "$350 \xB7 Refunded" },
  { id: "ORD-1043", title: "Brightline Co \xB7 Landing page", status: "published", updatedAt: daysAgo(12), meta: "$900 \xB7 Paid" }
];
const adminNewsletter = [
  { id: "sub-1", title: "olivia.park@example.com", status: "published", updatedAt: daysAgo(0), meta: "Weekly digest \xB7 Website" },
  { id: "sub-2", title: "marco.rossi@example.com", status: "published", updatedAt: daysAgo(2), meta: "Product updates \xB7 Checkout" },
  { id: "sub-3", title: "aisha.khan@example.com", status: "draft", updatedAt: daysAgo(3), meta: "Pending confirmation" },
  { id: "sub-4", title: "lena.schmidt@example.com", status: "published", updatedAt: daysAgo(6), meta: "Weekly digest \xB7 Blog" },
  { id: "sub-5", title: "tom.baker@example.com", status: "archived", updatedAt: daysAgo(15), meta: "Unsubscribed" },
  { id: "sub-6", title: "yuki.tanaka@example.com", status: "published", updatedAt: daysAgo(21), meta: "All updates \xB7 Website" }
];
export {
  adminBlogPosts,
  adminCategories,
  adminNewsletter,
  adminPayments,
  adminProducts,
  adminProjects,
  adminServiceOrders,
  adminServices,
  adminTransactions
};
