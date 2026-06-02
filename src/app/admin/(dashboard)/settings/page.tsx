"use client";

import { AccountSettings } from "@/components/admin/settings/account-settings";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { DemoModeBanner } from "@/components/admin/shared/demo-mode-banner";
import { adminConfig } from "@/config/admin.config";
import { cn } from "@/lib/cn";
import { useState } from "react";

const tabs = [
  { id: "account", label: "Account" },
  { id: "site", label: "Site" },
  { id: "integrations", label: "Integrations" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure your admin panel and connected services."
      />
      <DemoModeBanner />

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              activeTab === tab.id
                ? "bg-brand-500 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "account" && <AccountSettings />}

      {activeTab === "site" && (
        <div className="admin-card admin-card-body">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Site settings
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Customize <code className="text-xs">src/config/admin.config.ts</code> for
            branding, navigation, and demo credentials when reusing {adminConfig.brand.name}{" "}
            in another project.
          </p>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="admin-card admin-card-body space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            API integration
          </h3>
          <p className="text-sm text-gray-500">
            Point ZenPanel at your Express (or compatible) admin API:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
            {`# .env.local
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:4000

# Expected routes (cookie auth):
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/me
GET    /api/admin/stats
GET    /api/admin/users`}
          </pre>
        </div>
      )}
    </div>
  );
}
