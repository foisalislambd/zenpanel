<script lang="ts">
  import type { Snippet } from "svelte";
  import { ChevronRight } from "lucide-svelte";
  import RouterLink from "@/components/RouterLink.svelte";
  import { matchAdminNavItem } from "@/lib/admin-nav";
  import { usePathname } from "@/lib/router.svelte";

  type Props = { title: string; actions?: Snippet };
  let { title, actions }: Props = $props();

  const pathname = usePathname();
  const section = $derived(matchAdminNavItem(pathname.current)?.section);
</script>

<div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
  <div class="min-w-0 flex-1">
    <nav aria-label="Breadcrumb" class="mb-1.5">
      <ol class="flex flex-wrap items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        <li>
          <RouterLink href="/admin" class="rounded hover:text-gray-900 dark:hover:text-white">Dashboard</RouterLink>
        </li>
        {#if section && section !== "Overview"}
          <ChevronRight class="h-3.5 w-3.5 opacity-60" aria-hidden={true} />
          <li>{section}</li>
        {/if}
        <ChevronRight class="h-3.5 w-3.5 opacity-60" aria-hidden={true} />
        <li aria-current="page" class="text-gray-700 dark:text-gray-200">{title}</li>
      </ol>
    </nav>
    <h1 class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">{title}</h1>
  </div>
  {#if actions}
    <div class="flex shrink-0 flex-wrap items-center gap-2">
      {@render actions()}
    </div>
  {/if}
</div>
