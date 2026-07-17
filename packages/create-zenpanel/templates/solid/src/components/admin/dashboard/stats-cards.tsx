import type { DashboardStats } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  FolderKanban,
  Mail,
  MessageCircle,
  ShoppingCart,
  Users,
} from "lucide-solid";
import { Show, type JSX } from "solid-js";

type Props = {
  stats: DashboardStats;
};

function formatChange(percent: number) {
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

function StatCard(props: {
  label: string;
  sublabel?: string;
  value: string | number;
  icon: JSX.Element;
  iconBg: string;
}) {
  return (
    <div class="admin-card overflow-hidden">
      <div class="flex items-center justify-between gap-3 p-4">
        <div class="min-w-0">
          <p class="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {props.label}
          </p>
          <Show when={props.sublabel}>
            <p class="truncate text-[10px] text-gray-400 dark:text-gray-500">{props.sublabel}</p>
          </Show>
          <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {props.value}
          </p>
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
        sublabel={`All time · ${formatChange(props.stats.revenueChangePercent)}`}
        value={formatCurrency(props.stats.totalRevenue)}
        icon={<DollarSign class="h-5 w-5 text-brand-600 dark:text-brand-400" />}
        iconBg="bg-brand-50 dark:bg-brand-500/15"
      />
      <StatCard
        label="Users"
        sublabel={`+${props.stats.newUsersLast7Days.toLocaleString()} last 7 days`}
        value={props.stats.totalUsers.toLocaleString()}
        icon={<Users class="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-50 dark:bg-blue-500/15"
      />
      <StatCard
        label="Orders"
        sublabel={`Last 7 days · ${formatChange(props.stats.ordersChangePercent)}`}
        value={props.stats.newOrdersLast7Days.toLocaleString()}
        icon={<ShoppingCart class="h-5 w-5 text-violet-600 dark:text-violet-400" />}
        iconBg="bg-violet-50 dark:bg-violet-500/15"
      />
      <StatCard
        label="Messages"
        sublabel="Unread"
        value={props.stats.unreadMessages.toLocaleString()}
        icon={<MessageCircle class="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-50 dark:bg-amber-500/15"
      />
      <StatCard
        label="Projects"
        sublabel="Total"
        value={props.stats.totalProjects.toLocaleString()}
        icon={<FolderKanban class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/15"
      />
      <StatCard
        label="Subscribers"
        sublabel="Newsletter"
        value={props.stats.newsletterSubscribers.toLocaleString()}
        icon={<Mail class="h-5 w-5 text-rose-600 dark:text-rose-400" />}
        iconBg="bg-rose-50 dark:bg-rose-500/15"
      />
    </div>
  );
}
