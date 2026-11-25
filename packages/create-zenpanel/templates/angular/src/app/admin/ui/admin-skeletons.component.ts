import { Component, computed, input } from '@angular/core';

/** Skeleton for list pages (header, toolbar, table rows). */
@Component({
  selector: 'app-admin-table-skeleton',
  template: `
    <div class="admin-content space-y-6" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">{{ label() }}</span>
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
        @for (i of rowList(); track i) {
          <div
            class="flex items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-0 dark:border-gray-800"
          >
            <div class="admin-skeleton h-9 w-9 rounded-full" aria-hidden="true"></div>
            <div class="flex-1 space-y-2">
              <div class="admin-skeleton h-3.5 w-1/3 rounded-md" aria-hidden="true"></div>
              <div class="admin-skeleton h-3 w-1/2 rounded-md" aria-hidden="true"></div>
            </div>
            <div class="admin-skeleton hidden h-5 w-16 rounded-full sm:block" aria-hidden="true"></div>
            <div class="admin-skeleton h-8 w-20 rounded-lg" aria-hidden="true"></div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminTableSkeletonComponent {
  readonly rows = input(5);
  readonly label = input('Loading…');
  readonly rowList = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
}

/** Skeleton matching the dashboard layout (hero, stat cards, chart, side panel). */
@Component({
  selector: 'app-admin-dashboard-skeleton',
  template: `
    <div class="admin-content space-y-5" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">Loading dashboard…</span>
      <div class="admin-skeleton h-[136px] w-full rounded-2xl" aria-hidden="true"></div>
      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        @for (i of six; track i) {
          <div class="admin-card flex items-center justify-between p-4">
            <div class="space-y-2">
              <div class="admin-skeleton h-3 w-16 rounded-md" aria-hidden="true"></div>
              <div class="admin-skeleton h-6 w-20 rounded-md" aria-hidden="true"></div>
            </div>
            <div class="admin-skeleton h-10 w-10 rounded-lg" aria-hidden="true"></div>
          </div>
        }
      </div>
      <div class="grid gap-5 xl:grid-cols-3">
        <div class="admin-card space-y-4 p-5 xl:col-span-2">
          <div class="admin-skeleton h-4 w-24 rounded-md" aria-hidden="true"></div>
          <div class="admin-skeleton h-56 w-full rounded-md" aria-hidden="true"></div>
        </div>
        <div class="admin-card space-y-3 p-5">
          <div class="admin-skeleton h-4 w-28 rounded-md" aria-hidden="true"></div>
          @for (i of six; track i) {
            <div class="admin-skeleton h-7 w-full rounded-md" aria-hidden="true"></div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardSkeletonComponent {
  readonly six = [1, 2, 3, 4, 5, 6];
}
