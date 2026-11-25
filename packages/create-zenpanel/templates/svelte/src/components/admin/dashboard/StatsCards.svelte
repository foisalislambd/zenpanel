<script lang="ts">
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
  } from "lucide-svelte";
  import type { LucideIcon } from "@/lib/icon-types";

  type Props = { stats: DashboardStats };
  let { stats }: Props = $props();

  type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconBg: string;
    iconClass: string;
    /** Percent change vs previous period. */
    trend?: number;
    hint?: string;
  };
</script>

{#snippet statCard({ label, value, icon: Icon, iconBg, iconClass, trend, hint }: StatCardProps)}
  <div class="admin-card overflow-hidden">
    <div class="flex items-center justify-between gap-3 p-4">
      <div class="min-w-0">
        <p class="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {value}
        </p>
        {#if typeof trend === "number" || hint}
          <p class="mt-1 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {#if typeof trend === "number"}
              <span
                class="inline-flex items-center gap-0.5 font-semibold {trend >= 0
                  ? 'text-success-600 dark:text-success-500'
                  : 'text-error-500'}"
              >
                {#if trend >= 0}
                  <TrendingUp class="h-3.5 w-3.5" aria-hidden={true} />
                {:else}
                  <TrendingDown class="h-3.5 w-3.5" aria-hidden={true} />
                {/if}
                {trend >= 0 ? "+" : ""}{trend}%
              </span>
            {/if}
            {hint ?? ""}
          </p>
        {/if}
      </div>
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {iconBg}">
        <Icon class="h-5 w-5 {iconClass}" aria-hidden={true} />
      </div>
    </div>
  </div>
{/snippet}

<div class="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
  {@render statCard({
    label: "Revenue",
    value: formatCurrency(stats.totalRevenue),
    trend: stats.revenueChangePercent,
    hint: "vs last month",
    icon: DollarSign,
    iconBg: "bg-brand-50 dark:bg-brand-500/15",
    iconClass: "text-brand-600 dark:text-brand-400",
  })}
  {@render statCard({
    label: "Users",
    value: stats.totalUsers.toLocaleString(),
    hint: `+${stats.newUsersLast7Days.toLocaleString()} this week`,
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-500/15",
    iconClass: "text-blue-600 dark:text-blue-400",
  })}
  {@render statCard({
    label: "Orders (7d)",
    value: stats.newOrdersLast7Days.toLocaleString(),
    trend: stats.ordersChangePercent,
    hint: "vs prior week",
    icon: ShoppingCart,
    iconBg: "bg-violet-50 dark:bg-violet-500/15",
    iconClass: "text-violet-600 dark:text-violet-400",
  })}
  {@render statCard({
    label: "Messages",
    value: stats.unreadMessages.toLocaleString(),
    hint: "unread",
    icon: MessageCircle,
    iconBg: "bg-amber-50 dark:bg-amber-500/15",
    iconClass: "text-amber-600 dark:text-amber-400",
  })}
  {@render statCard({
    label: "Projects",
    value: stats.totalProjects.toLocaleString(),
    icon: FolderKanban,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  })}
  {@render statCard({
    label: "Subscribers",
    value: stats.newsletterSubscribers.toLocaleString(),
    icon: Mail,
    iconBg: "bg-rose-50 dark:bg-rose-500/15",
    iconClass: "text-rose-600 dark:text-rose-400",
  })}
</div>
