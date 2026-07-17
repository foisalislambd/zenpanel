<script lang="ts">
  import { useAdminAuth } from "@/context/admin-auth-context.svelte";
  import { adminConfig } from "@/config/admin.config";
  import { CalendarDays, FolderKanban, Settings } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function formatToday() {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const auth = useAdminAuth();
  const name = $derived(auth.admin?.username ?? adminConfig.brand.name);
</script>

<div class="relative overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-5 sm:p-6 lg:p-8 dark:border-brand-500/20">
  <div class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
  <div class="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-300/20 blur-2xl" aria-hidden="true"></div>

  <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0">
      <p class="text-sm font-medium text-brand-100">
        {getGreeting()}, {name}
      </p>
      <h1 class="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Dashboard overview
      </h1>
      <p class="mt-2 flex items-center gap-2 text-sm text-brand-100/90">
        <CalendarDays class="h-4 w-4 shrink-0" />
        {formatToday()}
      </p>
    </div>

    <div class="flex shrink-0 flex-wrap gap-2">
      <RouterLink
        href="/admin/projects"
        class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <FolderKanban class="h-4 w-4 shrink-0 text-brand-600" aria-hidden={true} />
        <span class="text-brand-600">Manage projects</span>
      </RouterLink>
      <RouterLink
        href="/admin/settings"
        class="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <Settings class="h-4 w-4" />
        Settings
      </RouterLink>
    </div>
  </div>
</div>
