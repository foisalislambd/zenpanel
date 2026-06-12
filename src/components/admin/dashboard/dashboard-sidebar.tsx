"use client";

import { adminNavItems } from "@/config/admin.config";
import {
  Briefcase,
  FolderKanban,
  MessageCircle,
  Newspaper,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    name: "Add project",
    href: "/admin/projects",
    icon: FolderKanban,
    color: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/15",
  },
  {
    name: "Manage services",
    href: "/admin/services",
    icon: Briefcase,
    color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/15",
  },
  {
    name: "View messages",
    href: "/admin/messages",
    icon: MessageCircle,
    color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/15",
  },
  {
    name: "Write blog post",
    href: "/admin/blog",
    icon: Newspaper,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/15",
  },
  {
    name: "Add product",
    href: "/admin/products",
    icon: Package,
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/15",
  },
  {
    name: "Manage users",
    href: "/admin/users",
    icon: Users,
    color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/15",
  },
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
        <div className="border-b border-gray-200 px-4 py-4 sm:px-5 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Quick actions
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Jump to common tasks
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3 sm:p-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-3 text-center transition hover:border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-white/[0.03]"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.color}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-5 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Users by provider
          </h3>
        </div>
        <div className="admin-card-body space-y-4">
          {providers.map(([provider, count]) => {
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            return (
              <div key={provider}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-400">{provider}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {count.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-gray-400">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${providerColors[provider] ?? "bg-gray-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="admin-card-body">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {adminNavItems.length} admin modules
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Connect your API to replace preview data
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
