"use client";

import { cn } from "@/lib/cn";

export function AdminSkeleton({ className }: { className?: string }) {
  return <div className={cn("admin-skeleton rounded-md", className)} aria-hidden />;
}

/** Skeleton for list pages (header, toolbar, table rows). */
export function AdminTableSkeleton({ rows = 5, label = "Loading…" }: { rows?: number; label?: string }) {
  return (
    <div className="admin-content space-y-6" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="flex items-center justify-between">
        <AdminSkeleton className="h-8 w-40" />
        <AdminSkeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="flex flex-wrap gap-3">
        <AdminSkeleton className="h-10 w-full max-w-md rounded-xl" />
        <AdminSkeleton className="h-10 w-48 rounded-lg" />
      </div>
      <div className="admin-card overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
          <AdminSkeleton className="h-3 w-1/3" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-0 dark:border-gray-800">
            <AdminSkeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <AdminSkeleton className="h-3.5 w-1/3" />
              <AdminSkeleton className="h-3 w-1/2" />
            </div>
            <AdminSkeleton className="hidden h-5 w-16 rounded-full sm:block" />
            <AdminSkeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton matching the dashboard layout (hero, stat cards, chart, side panel). */
export function AdminDashboardSkeleton() {
  return (
    <div className="admin-content space-y-5" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading dashboard…</span>
      <AdminSkeleton className="h-[136px] w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="admin-card flex items-center justify-between p-4">
            <div className="space-y-2">
              <AdminSkeleton className="h-3 w-16" />
              <AdminSkeleton className="h-6 w-20" />
            </div>
            <AdminSkeleton className="h-10 w-10 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="admin-card space-y-4 p-5 xl:col-span-2">
          <AdminSkeleton className="h-4 w-24" />
          <AdminSkeleton className="h-56 w-full" />
        </div>
        <div className="admin-card space-y-3 p-5">
          <AdminSkeleton className="h-4 w-28" />
          {Array.from({ length: 6 }, (_, i) => (
            <AdminSkeleton key={i} className="h-7 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
