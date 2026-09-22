/** ZenPanel HTML config — branding + navigation (matches Next.js admin.config) */
export const adminConfig = {
  brand: {
    name: "ZenPanel",
    tagline: "Control panel",
    letter: "Z",
    siteUrl: "/",
    loginDescription:
      "Professional control panel for your platform — monitor users, review activity, and manage everything securely.",
    loginFeatures: [
      "Portal analytics overview",
      "Secure admin-only access",
      "Works on desktop and mobile",
    ],
  },
};

/**
 * Paths are extensionless for `serve` cleanUrls
 * (e.g. /admin/login → admin/login.html).
 */
export const adminNavItems = [
  { name: "Dashboard", section: "Overview", href: "/admin", icon: "layout-dashboard" },
  {
    name: "Projects", section: "Work",
    href: "/admin/projects",
    icon: "folder-kanban",
    description: "Portfolio projects and case studies",
  },
  {
    name: "Services", section: "Work",
    href: "/admin/services",
    icon: "briefcase",
    description: "Service offerings and pricing",
  },
  {
    name: "Service orders", section: "Work",
    href: "/admin/service-orders",
    icon: "shopping-cart",
    description: "Customer service purchases",
  },
  {
    name: "Transactions", section: "Finance",
    href: "/admin/transactions",
    icon: "receipt",
    description: "Wallet and ledger activity",
  },
  {
    name: "Payments", section: "Finance",
    href: "/admin/payments",
    icon: "credit-card",
    description: "Deposits and payment providers",
  },
  { name: "Blog", section: "Content", href: "/admin/blog", icon: "newspaper" },
  { name: "Products", section: "Content", href: "/admin/products", icon: "package" },
  { name: "Categories", section: "Content", href: "/admin/categories", icon: "folder-tree" },
  { name: "Messages", section: "Inbox", href: "/admin/messages", icon: "message-circle" },
  { name: "Newsletter", section: "Inbox", href: "/admin/newsletter", icon: "mail" },
  { name: "Users", section: "Account", href: "/admin/users", icon: "users" },
  { name: "Settings", section: "Account", href: "/admin/settings", icon: "settings" },
];

export const DEMO_USERNAME = "admin";
export const DEMO_PASSWORD = "admin";
