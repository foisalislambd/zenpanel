"use client";

import { DashboardSectionHeader } from "@/components/admin/dashboard/dashboard-section-header";
import {
  Briefcase,
  ChevronRight,
  FolderKanban,
  MessageCircle,
  Newspaper,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { name: "Add project", href: "/admin/projects", icon: FolderKanban },
  { name: "Manage services", href: "/admin/services", icon: Briefcase },
  { name: "View messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Write blog post", href: "/admin/blog", icon: Newspaper },
  { name: "Add product", href: "/admin/products", icon: Package },
  { name: "Manage users", href: "/admin/users", icon: Users },
];

type Props = {
  usersByProvider: {
    email: number;
    google: number;
    apple: number;
    discord: number;
  };
  totalUsers: number;
};

const providerColors: Record<string, string> = {
  email: "bg-brand-500",
  google: "bg-orange-500",
  apple: "bg-gray-600 dark:bg-gray-400",
  discord: "bg-indigo-500",
};

export function DashboardSidebar({ usersByProvider, totalUsers }: Props) {
  const providers = Object.entries(usersByProvider) as [string, number][];

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-card overflow-hidden">
        <DashboardSectionHeader title="Quick actions" />
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="min-w-0 flex-1">{link.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="admin-card overflow-hidden">
        <DashboardSectionHeader title="Users by provider" />
        <div className="space-y-3.5 px-5 py-4">
          {providers.map(([provider, count]) => {
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            return (
              <div key={provider}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{provider}</span>
                  <span className="font-medium tabular-nums text-gray-900 dark:text-white">
                    {count.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-gray-400">{pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full ${providerColors[provider] ?? "bg-gray-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
