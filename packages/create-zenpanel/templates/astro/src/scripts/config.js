/** ZenPanel HTML config — branding + navigation */
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
 * Admin paths match Astro file routes under src/pages/admin/
 * (e.g. /admin/login → src/pages/admin/login.astro).
 */
export const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { name: "Projects", href: "/admin/projects", icon: "folder-kanban" },
  { name: "Services", href: "/admin/services", icon: "briefcase" },
  { name: "Service orders", href: "/admin/service-orders", icon: "shopping-cart" },
  { name: "Transactions", href: "/admin/transactions", icon: "receipt" },
  { name: "Payments", href: "/admin/payments", icon: "credit-card" },
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
