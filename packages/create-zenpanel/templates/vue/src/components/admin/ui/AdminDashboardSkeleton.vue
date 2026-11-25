<template>
  <!-- Skeleton matching the dashboard layout (hero, stat cards, chart, side panel). -->
  <div class="admin-content space-y-5" role="status" aria-live="polite" aria-busy="true">
    <span class="sr-only">Loading dashboard…</span>
    <div class="admin-skeleton h-[136px] w-full rounded-2xl" aria-hidden="true" />
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
      <div v-for="i in 6" :key="i" class="admin-card flex items-center justify-between p-4">
        <div class="space-y-2">
          <div class="admin-skeleton h-3 w-16 rounded-md" aria-hidden="true" />
          <div class="admin-skeleton h-6 w-20 rounded-md" aria-hidden="true" />
        </div>
        <div class="admin-skeleton h-10 w-10 rounded-lg" aria-hidden="true" />
      </div>
    </div>
    <div class="grid gap-5 xl:grid-cols-3">
      <div class="admin-card space-y-4 p-5 xl:col-span-2">
        <div class="admin-skeleton h-4 w-24 rounded-md" aria-hidden="true" />
        <div class="admin-skeleton h-56 w-full rounded-md" aria-hidden="true" />
      </div>
      <div class="admin-card space-y-3 p-5">
        <div class="admin-skeleton h-4 w-28 rounded-md" aria-hidden="true" />
        <div v-for="i in 6" :key="i" class="admin-skeleton h-7 w-full rounded-md" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>
