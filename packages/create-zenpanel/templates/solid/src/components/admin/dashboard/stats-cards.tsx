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
} from "lucide-solid";
import { Show, type JSX } from "solid-js";

type Props = {
  stats: DashboardStats;
};

function StatCard(props: {
  label: string;
  value: string | number;
  icon: JSX.Element;
  iconBg: string;
  /** Percent change vs previous period. */
  trend?: number;
  hint?: string;
}) {
  return (
    <div class="admin-card overflow-hidden">
      <div class="flex items-center justify-between gap-3 p-4">
        <div class="min-w-0">
          <p class="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {props.label}
          </p>
          <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {props.value}
          </p>
          <Show when={typeof props.trend === "number" || props.hint}>
            <p class="mt-1 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
              <Show when={typeof props.trend === "number"}>
                <span
                  class={`inline-flex items-center gap-0.5 font-semibold ${
                    (props.trend ?? 0) >= 0 ? "text-success-600 dark:text-success-500" : "text-error-500"
                  }`}
                >
                  <Show when={(props.trend ?? 0) >= 0} fallback={<TrendingDown class="h-3.5 w-3.5" aria-hidden />}>
                    <TrendingUp class="h-3.5 w-3.5" aria-hidden />
                  </Show>
                  {(props.trend ?? 0) >= 0 ? "+" : ""}
                  {props.trend}%
                </span>
              </Show>
              {props.hint ?? ""}
            </p>
          </Show>
        </div>
        <div
          class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${props.iconBg}`}
        >
          {props.icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards(props: Props) {
  return (
    <div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        label="Revenue"
        value={formatCurrency(props.stats.totalRevenue)}
        trend={props.stats.revenueChangePercent}
        hint="vs last month"
        icon={<DollarSign class="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />}
        iconBg="bg-brand-50 dark:bg-brand-500/15"
      />
      <StatCard
        label="Users"
        value={props.stats.totalUsers.toLocaleString()}
        hint={`+${props.stats.newUsersLast7Days.toLocaleString()} this week`}
        icon={<Users class="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />}
        iconBg="bg-blue-50 dark:bg-blue-500/15"
      />
      <StatCard
        label="Orders (7d)"
        value={props.stats.newOrdersLast7Days.toLocaleString()}
        trend={props.stats.ordersChangePercent}
        hint="vs prior week"
        icon={<ShoppingCart class="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />}
        iconBg="bg-violet-50 dark:bg-violet-500/15"
      />
      <StatCard
        label="Messages"
        value={props.stats.unreadMessages.toLocaleString()}
        hint="unread"
        icon={<MessageCircle class="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />}
        iconBg="bg-amber-50 dark:bg-amber-500/15"
      />
      <StatCard
        label="Projects"
        value={props.stats.totalProjects.toLocaleString()}
        icon={<FolderKanban class="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/15"
      />
      <StatCard
        label="Subscribers"
        value={props.stats.newsletterSubscribers.toLocaleString()}
        icon={<Mail class="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden />}
        iconBg="bg-rose-50 dark:bg-rose-500/15"
      />
    </div>
  );
}
