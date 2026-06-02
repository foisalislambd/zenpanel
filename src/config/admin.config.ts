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

/**
 * ZenPanel — UI/UX only (no backend in this repo).
 *
 * Mock login + sample tables live in the browser for preview.
 * When you build a real product: copy these components into that project
 * and wire your own pages + API there (separate codebase).
 */
export const adminConfig = {
  brand: {
    name: "ZenPanel",
    tagline: "Admin UI kit",
    letter: "Z",
    siteUrl: "/",
  },

  /** Fake login for previewing the admin shell */
  previewLogin: {
    username: "admin",
    email: "admin@zenpanel.dev",
    password: "demo1234",
  },

  storageKeys: {
    session: "zenpanel-admin-session",
    sidebarExpanded: "zenpanel-sidebar-expanded",
  },
};

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
