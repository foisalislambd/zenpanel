"use client";

import { adminConfig } from "@/config/admin.config";
import { isDemoMode } from "@/lib/admin-api";
import { Info } from "lucide-react";

export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      role="status"
      className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="min-w-0 text-sm">
        <p className="font-medium text-amber-900 dark:text-amber-200">Demo mode active</p>
        <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/90">
          Data is mocked locally. Set{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-500/20">
            NEXT_PUBLIC_ADMIN_API_URL
          </code>{" "}
          to connect {adminConfig.brand.name} to your backend API.
        </p>
      </div>
    </div>
  );
}
