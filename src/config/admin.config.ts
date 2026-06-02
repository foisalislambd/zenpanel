import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";

/** Central configuration — customize per project when reusing ZenPanel */
export const adminConfig = {
  brand: {
    name: "ZenPanel",
    tagline: "Admin CMS",
    letter: "Z",
    siteUrl: "/",
  },

  /**
   * Demo mode when NEXT_PUBLIC_ADMIN_API_URL is unset.
   * Note: Next.js inlines this at build time — restart dev / rebuild after changing env.
   */
  demo: {
    enabled: !process.env.NEXT_PUBLIC_ADMIN_API_URL?.trim(),
    credentials: {
      username: "admin",
      email: "admin@zenpanel.dev",
      password: "demo1234",
    },
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "",
    prefix: "/api/admin",
  },

  storageKeys: {
    session: "zenpanel-admin-session",
    sidebarExpanded: "zenpanel-sidebar-expanded",
  },
} as const;

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
