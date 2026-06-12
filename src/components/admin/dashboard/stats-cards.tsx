"use client";

import type { DashboardStats } from "@/lib/admin-api";
import { Shield, TrendingUp, UserPlus, Users } from "lucide-react";

type Props = {
  stats: DashboardStats;
};

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="admin-card admin-card-body">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </p>
          {hint && (
            <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {hint}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-12 sm:w-12">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ stats }: Props) {
  const providerHint =
    stats.totalUsers > 0
      ? `Email ${stats.usersByProvider.email} · Google ${stats.usersByProvider.google} · Apple ${stats.usersByProvider.apple} · Discord ${stats.usersByProvider.discord}`
      : undefined;

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      <StatCard
        label="Users"
        value={stats.totalUsers.toLocaleString()}
        icon={<Users className="h-5 w-5 text-brand-600 dark:text-brand-400 sm:h-6 sm:w-6" />}
        hint={providerHint}
      />
      <StatCard
        label="New users (7d)"
        value={stats.newUsersLast7Days.toLocaleString()}
        icon={<UserPlus className="h-5 w-5 text-gray-700 dark:text-white/90 sm:h-6 sm:w-6" />}
      />
      <StatCard
        label="Active admins"
        value={stats.totalAdmins.toLocaleString()}
        icon={<Shield className="h-5 w-5 text-gray-700 dark:text-white/90 sm:h-6 sm:w-6" />}
      />
      <StatCard
        label="Weekly growth"
        value={
          stats.totalUsers > 0
            ? `${Math.round((stats.newUsersLast7Days / stats.totalUsers) * 100)}%`
            : "0%"
        }
        icon={
          <TrendingUp className="h-5 w-5 text-success-600 dark:text-success-500 sm:h-6 sm:w-6" />
        }
        hint="7-day signups vs total users"
      />
    </div>
  );
}
