<script lang="ts">
  import DashboardSectionHeader from "@/components/admin/dashboard/DashboardSectionHeader.svelte";
  import {
    Briefcase,
    ChevronRight,
    FolderKanban,
    MessageCircle,
    Newspaper,
    Package,
    Users,
  } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  const quickLinks = [
    { name: "Manage projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Manage services", href: "/admin/services", icon: Briefcase },
    { name: "View messages", href: "/admin/messages", icon: MessageCircle },
    { name: "Write blog post", href: "/admin/blog", icon: Newspaper },
    { name: "Add product", href: "/admin/products", icon: Package },
    { name: "Manage users", href: "/admin/users", icon: Users },
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

  let { usersByProvider, totalUsers }: Props = $props();

  const providers = $derived(Object.entries(usersByProvider) as [string, number][]);

  const providerColors: Record<string, string> = {
    email: "bg-brand-500",
    google: "bg-orange-500",
    apple: "bg-gray-600 dark:bg-gray-400",
    discord: "bg-indigo-500",
  };
</script>

<div class="flex flex-col gap-4">
  <div class="admin-card overflow-hidden">
    <DashboardSectionHeader title="Quick actions" />
    <ul class="divide-y divide-gray-100 dark:divide-gray-800">
      {#each quickLinks as link (link.href)}
        {@const Icon = link.icon}
        <li>
          <RouterLink
            href={link.href}
            class="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
          >
            <Icon class="h-4 w-4 shrink-0 text-gray-400" />
            <span class="min-w-0 flex-1">{link.name}</span>
            <ChevronRight class="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
          </RouterLink>
        </li>
      {/each}
    </ul>
  </div>

  <div class="admin-card overflow-hidden">
    <DashboardSectionHeader title="Users by provider" />
    <div class="space-y-3.5 px-5 py-4">
      {#each providers as [provider, count] (provider)}
        {@const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0}
        <div>
          <div class="mb-1 flex items-center justify-between text-sm">
            <span class="capitalize text-gray-600 dark:text-gray-400">{provider}</span>
            <span class="font-medium tabular-nums text-gray-900 dark:text-white">
              {count.toLocaleString()}
              <span class="ml-1 text-xs font-normal text-gray-400">{pct}%</span>
            </span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              class="h-full rounded-full {providerColors[provider] ?? 'bg-gray-400'}"
              style:width="{pct}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
