"use client";

import type { DashboardStats } from "@/lib/admin-api";
import {
  DollarSign,
  FolderKanban,
  Mail,
  MessageCircle,
  ShoppingCart,
  Users,
} from "lucide-react";

type Props = {
  stats: DashboardStats;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        label="Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
        iconBg="bg-brand-50 dark:bg-brand-500/15"
      />
      <StatCard
        label="Users"
        value={stats.totalUsers.toLocaleString()}
        icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-50 dark:bg-blue-500/15"
      />
      <StatCard
        label="Orders"
        value={stats.newOrdersLast7Days.toLocaleString()}
        icon={<ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
        iconBg="bg-violet-50 dark:bg-violet-500/15"
      />
      <StatCard
        label="Messages"
        value={stats.unreadMessages.toLocaleString()}
        icon={<MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-50 dark:bg-amber-500/15"
      />
      <StatCard
        label="Projects"
        value={stats.totalProjects.toLocaleString()}
        icon={<FolderKanban className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/15"
      />
      <StatCard
        label="Subscribers"
        value={stats.newsletterSubscribers.toLocaleString()}
        icon={<Mail className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
        iconBg="bg-rose-50 dark:bg-rose-500/15"
      />
    </div>
  );
}
