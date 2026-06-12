"use client";

import type { ActivityItem, ActivityType } from "@/lib/admin-api";
import {
  CreditCard,
  Mail,
  Newspaper,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

type Props = {
  items: ActivityItem[];
};

const activityConfig: Record<
  ActivityType,
  { icon: typeof UserPlus; color: string; bg: string }
> = {
  user: {
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/15",
  },
  order: {
    icon: ShoppingCart,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
  },
  payment: {
    icon: CreditCard,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
  },
  message: {
    icon: Mail,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/15",
  },
  blog: {
    icon: Newspaper,
    color: "text-brand-600 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-500/15",
  },
  newsletter: {
    icon: Mail,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/15",
  },
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ActivityFeed({ items }: Props) {
  return (
    <div className="admin-card flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            Recent activity
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Latest events across your site
          </p>
        </div>
        <Link
          href="/admin/transactions"
          className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-card-body flex flex-1 items-center justify-center py-12 text-sm text-gray-500">
          No recent activity
        </div>
      ) : (
        <ul className="admin-scrollbar max-h-[420px] flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
          {items.map((item) => {
            const config = activityConfig[item.type];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <li
                key={item.id}
                className="flex gap-4 px-4 py-4 transition-colors hover:bg-gray-50/80 sm:px-6 dark:hover:bg-white/[0.02]"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    {item.meta && (
                      <span className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.meta}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-400">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
