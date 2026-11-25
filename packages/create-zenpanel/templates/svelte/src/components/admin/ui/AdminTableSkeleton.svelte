<script lang="ts">
  /** Skeleton for list pages (header, toolbar, table rows). */
  type Props = { rows?: number; label?: string };
  let { rows = 5, label = "Loading…" }: Props = $props();
</script>

<div class="admin-content space-y-6" role="status" aria-live="polite" aria-busy="true">
  <span class="sr-only">{label}</span>
  <div class="flex items-center justify-between">
    <div class="admin-skeleton h-8 w-40 rounded-md" aria-hidden="true"></div>
    <div class="admin-skeleton h-9 w-28 rounded-lg" aria-hidden="true"></div>
  </div>
  <div class="flex flex-wrap gap-3">
    <div class="admin-skeleton h-10 w-full max-w-md rounded-xl" aria-hidden="true"></div>
    <div class="admin-skeleton h-10 w-48 rounded-lg" aria-hidden="true"></div>
  </div>
  <div class="admin-card overflow-hidden">
    <div class="border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
      <div class="admin-skeleton h-3 w-1/3 rounded-md" aria-hidden="true"></div>
    </div>
    {#each Array.from({ length: rows }, (_, i) => i) as i (i)}
      <div class="flex items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-0 dark:border-gray-800">
        <div class="admin-skeleton h-9 w-9 rounded-full" aria-hidden="true"></div>
        <div class="flex-1 space-y-2">
          <div class="admin-skeleton h-3.5 w-1/3 rounded-md" aria-hidden="true"></div>
          <div class="admin-skeleton h-3 w-1/2 rounded-md" aria-hidden="true"></div>
        </div>
        <div class="admin-skeleton hidden h-5 w-16 rounded-full sm:block" aria-hidden="true"></div>
        <div class="admin-skeleton h-8 w-20 rounded-lg" aria-hidden="true"></div>
      </div>
    {/each}
  </div>
</div>
