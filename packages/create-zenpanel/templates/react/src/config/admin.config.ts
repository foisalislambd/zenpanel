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

export type AdminNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  section?: string;
};

export const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, section: "Overview" },
  {
    name: "Projects",
    section: "Work",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Portfolio projects and case studies",
  },
  {
    name: "Services",
    section: "Work",
    href: "/admin/services",
    icon: Briefcase,
    description: "Service offerings and pricing",
  },
  {
    name: "Service orders",
    section: "Work",
    href: "/admin/service-orders",
    icon: ShoppingCart,
    description: "Customer service purchases",
  },
  {
    name: "Transactions",
    section: "Finance",
    href: "/admin/transactions",
    icon: Receipt,
    description: "Wallet and ledger activity",
  },
  {
    name: "Payments",
    section: "Finance",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Deposits and payment providers",
  },
  { name: "Blog", href: "/admin/blog", icon: Newspaper, section: "Content" },
  { name: "Products", href: "/admin/products", icon: Package, section: "Content" },
  { name: "Categories", href: "/admin/categories", icon: FolderTree, section: "Content" },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle, section: "Inbox" },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail, section: "Inbox" },
  { name: "Users", href: "/admin/users", icon: Users, section: "Account" },
  { name: "Settings", href: "/admin/settings", icon: Settings, section: "Account" },
];
