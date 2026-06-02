"use client";

import { adminConfig } from "@/config/admin.config";
import { Palette } from "lucide-react";

export function UiPreviewBanner() {
  return (
    <div
      role="status"
      className="mb-6 flex gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/30 dark:bg-violet-500/10"
    >
      <Palette className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" />
      <div className="min-w-0 text-sm">
        <p className="font-medium text-violet-900 dark:text-violet-200">UI preview only</p>
        <p className="mt-0.5 text-violet-800/90 dark:text-violet-300/90">
          {adminConfig.brand.name} does not save data. Sample rows and login are for layout
          review. Your backend and real pages live in separate projects later.
        </p>
      </div>
    </div>
  );
}
