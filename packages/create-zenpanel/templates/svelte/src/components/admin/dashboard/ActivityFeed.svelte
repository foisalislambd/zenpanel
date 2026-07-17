<script lang="ts">
  import DashboardSectionHeader from "@/components/admin/dashboard/DashboardSectionHeader.svelte";
  import type { ActivityItem, ActivityType } from "@/lib/admin-api";
  import {
    Activity,
    CreditCard,
    Mail,
    Newspaper,
    ShoppingCart,
    UserPlus,
  } from "lucide-svelte";
  import type { LucideIcon } from "@/lib/icon-types";

  type Props = { items: ActivityItem[] };
  let { items }: Props = $props();

  const activityConfig: Record<
    ActivityType,
    { icon: LucideIcon; color: string; bg: string }
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

  const fallbackConfig = {
    icon: Activity,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
  };

  function formatRelativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(iso).toLocaleDateString();
  }

  function getConfig(type: ActivityType) {
    return activityConfig[type] ?? fallbackConfig;
  }
</script>

<div class="admin-card overflow-hidden">
  <DashboardSectionHeader title="Activity" />

  {#if items.length > 0}
    <ul class="admin-scrollbar max-h-[380px] divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
      {#each items as item (item.id)}
        {@const config = getConfig(item.type)}
        {@const Icon = config.icon}
        <li class="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
          <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {config.bg}">
            <Icon class="h-3.5 w-3.5 {config.color}" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-gray-900 dark:text-white">{item.title}</p>
            {#if item.description}
              <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            {/if}
          </div>
          {#if item.meta}
            <span class="shrink-0 text-sm font-medium text-gray-900 dark:text-white">
              {item.meta}
            </span>
          {/if}
          <span class="shrink-0 text-xs tabular-nums text-gray-400">
            {formatRelativeTime(item.timestamp)}
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
      No recent activity
    </div>
  {/if}
</div>
