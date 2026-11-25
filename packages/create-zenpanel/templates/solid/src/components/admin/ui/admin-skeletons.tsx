import { For } from "solid-js";

/** Skeleton for list pages (header, toolbar, table rows). */
export function AdminTableSkeleton(props: { rows?: number; label?: string }) {
  return (
    <div class="admin-content space-y-6" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">{props.label ?? "Loading…"}</span>
      <div class="flex items-center justify-between">
        <div class="admin-skeleton h-8 w-40 rounded-md" aria-hidden="true" />
        <div class="admin-skeleton h-9 w-28 rounded-lg" aria-hidden="true" />
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="admin-skeleton h-10 w-full max-w-md rounded-xl" aria-hidden="true" />
        <div class="admin-skeleton h-10 w-48 rounded-lg" aria-hidden="true" />
      </div>
      <div class="admin-card overflow-hidden">
        <div class="border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
          <div class="admin-skeleton h-3 w-1/3 rounded-md" aria-hidden="true" />
        </div>
        <For each={Array.from({ length: props.rows ?? 5 })}>
          {() => (
            <div class="flex items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-0 dark:border-gray-800">
              <div class="admin-skeleton h-9 w-9 rounded-full" aria-hidden="true" />
              <div class="flex-1 space-y-2">
                <div class="admin-skeleton h-3.5 w-1/3 rounded-md" aria-hidden="true" />
                <div class="admin-skeleton h-3 w-1/2 rounded-md" aria-hidden="true" />
              </div>
              <div class="admin-skeleton hidden h-5 w-16 rounded-full sm:block" aria-hidden="true" />
              <div class="admin-skeleton h-8 w-20 rounded-lg" aria-hidden="true" />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

/** Skeleton matching the dashboard layout (hero, stat cards, chart, side panel). */
export function AdminDashboardSkeleton() {
  const six = [1, 2, 3, 4, 5, 6];
  return (
    <div class="admin-content space-y-5" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">Loading dashboard…</span>
      <div class="admin-skeleton h-[136px] w-full rounded-2xl" aria-hidden="true" />
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        <For each={six}>
          {() => (
            <div class="admin-card flex items-center justify-between p-4">
              <div class="space-y-2">
                <div class="admin-skeleton h-3 w-16 rounded-md" aria-hidden="true" />
                <div class="admin-skeleton h-6 w-20 rounded-md" aria-hidden="true" />
              </div>
              <div class="admin-skeleton h-10 w-10 rounded-lg" aria-hidden="true" />
            </div>
          )}
        </For>
      </div>
      <div class="grid gap-5 xl:grid-cols-3">
        <div class="admin-card space-y-4 p-5 xl:col-span-2">
          <div class="admin-skeleton h-4 w-24 rounded-md" aria-hidden="true" />
          <div class="admin-skeleton h-56 w-full rounded-md" aria-hidden="true" />
        </div>
        <div class="admin-card space-y-3 p-5">
          <div class="admin-skeleton h-4 w-28 rounded-md" aria-hidden="true" />
          <For each={six}>{() => <div class="admin-skeleton h-7 w-full rounded-md" aria-hidden="true" />}</For>
        </div>
      </div>
    </div>
  );
}
