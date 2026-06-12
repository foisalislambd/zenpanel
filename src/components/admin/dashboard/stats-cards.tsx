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
  hint,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  hint?: string;
}) {
  return (
    <div className="admin-card group relative overflow-hidden transition-shadow hover:shadow-md dark:hover:shadow-none">
      <div className="admin-card-body">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
              {value}
            </p>
            {hint && (
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {hint}
              </p>
            )}
          </div>
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:h-12 sm:w-12 ${iconBg}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ stats }: Props) {
  const growthPercent =
    stats.totalUsers > 0
      ? Math.round((stats.newUsersLast7Days / stats.totalUsers) * 100)
      : 0;

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        label="Total revenue"
        value={formatCurrency(stats.totalRevenue)}
        hint="All-time earnings"
        icon={<DollarSign className="h-5 w-5 text-brand-600 dark:text-brand-400 sm:h-6 sm:w-6" />}
        iconBg="bg-brand-50 dark:bg-brand-500/15"
      />
      <StatCard
        label="Total users"
        value={stats.totalUsers.toLocaleString()}
        hint={`+${stats.newUsersLast7Days} this week · ${growthPercent}% growth`}
        icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />}
        iconBg="bg-blue-50 dark:bg-blue-500/15"
      />
      <StatCard
        label="New orders"
        value={stats.newOrdersLast7Days.toLocaleString()}
        hint="Last 7 days"
        icon={
          <ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400 sm:h-6 sm:w-6" />
        }
        iconBg="bg-violet-50 dark:bg-violet-500/15"
      />
      <StatCard
        label="Unread messages"
        value={stats.unreadMessages.toLocaleString()}
        hint="Needs your attention"
        icon={
          <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 sm:h-6 sm:w-6" />
        }
        iconBg="bg-amber-50 dark:bg-amber-500/15"
      />
      <StatCard
        label="Active projects"
        value={stats.totalProjects.toLocaleString()}
        hint={`${stats.publishedPosts} blog posts published`}
        icon={
          <FolderKanban className="h-5 w-5 text-emerald-600 dark:text-emerald-400 sm:h-6 sm:w-6" />
        }
        iconBg="bg-emerald-50 dark:bg-emerald-500/15"
      />
      <StatCard
        label="Newsletter"
        value={stats.newsletterSubscribers.toLocaleString()}
        hint="Active subscribers"
        icon={<Mail className="h-5 w-5 text-rose-600 dark:text-rose-400 sm:h-6 sm:w-6" />}
        iconBg="bg-rose-50 dark:bg-rose-500/15"
      />
    </div>
  );
}
