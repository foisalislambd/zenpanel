"use client";

import type { DashboardStats } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  FolderKanban,
  Mail,
  MessageCircle,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

type Props = {
  stats: DashboardStats;
};

function StatCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  hint,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  /** Percent change vs previous period. */
  trend?: number;
  hint?: string;
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
          {(typeof trend === "number" || hint) && (
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
              {typeof trend === "number" && (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    trend >= 0 ? "text-success-600 dark:text-success-500" : "text-error-500"
                  }`}
                >
                  {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden />}
                  {trend >= 0 ? "+" : ""}
                  {trend}%
                </span>
              )}
              {hint}
            </p>
          )}
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
        trend={stats.revenueChangePercent}
        hint="vs last month"
        icon={<DollarSign className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
        iconBg="bg-brand-50 dark:bg-brand-500/15"
      />
      <StatCard
        label="Users"
        value={stats.totalUsers.toLocaleString()}
        hint={`+${stats.newUsersLast7Days.toLocaleString()} this week`}
        icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-50 dark:bg-blue-500/15"
      />
      <StatCard
        label="Orders (7d)"
        value={stats.newOrdersLast7Days.toLocaleString()}
        trend={stats.ordersChangePercent}
        hint="vs prior week"
        icon={<ShoppingCart className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
        iconBg="bg-violet-50 dark:bg-violet-500/15"
      />
      <StatCard
        label="Messages"
        value={stats.unreadMessages.toLocaleString()}
        hint="unread"
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
