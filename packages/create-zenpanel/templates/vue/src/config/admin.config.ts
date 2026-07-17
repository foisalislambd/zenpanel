import type { Component } from "vue";
import {
  Briefcase,
  CreditCard,
  FolderKanban,
  FolderTree,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Newspaper,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-vue-next";

/**
 * Admin shell — layout, navigation, branding.
 * Login is a UI preview only (no env credentials required).
 */
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

export type LucideIcon = Component;

export type AdminNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Portfolio projects and case studies",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Briefcase,
    description: "Service offerings and pricing",
  },
  {
    name: "Service orders",
    href: "/admin/service-orders",
    icon: ShoppingCart,
    description: "Customer service purchases",
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: Receipt,
    description: "Wallet and ledger activity",
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Deposits and payment providers",
  },
  { name: "Blog", href: "/admin/blog", icon: Newspaper },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];
