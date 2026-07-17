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
  { name: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: "folder-kanban",
    description: "Portfolio projects and case studies",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: "briefcase",
    description: "Service offerings and pricing",
  },
  {
    name: "Service orders",
    href: "/admin/service-orders",
    icon: "shopping-cart",
    description: "Customer service purchases",
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: "receipt",
    description: "Wallet and ledger activity",
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: "credit-card",
    description: "Deposits and payment providers",
  },
  { name: "Blog", href: "/admin/blog", icon: "newspaper" },
  { name: "Products", href: "/admin/products", icon: "package" },
  { name: "Categories", href: "/admin/categories", icon: "folder-tree" },
  { name: "Messages", href: "/admin/messages", icon: "message-circle" },
  { name: "Newsletter", href: "/admin/newsletter", icon: "mail" },
  { name: "Users", href: "/admin/users", icon: "users" },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export const DEMO_USERNAME = "admin";
export const DEMO_PASSWORD = "admin";
