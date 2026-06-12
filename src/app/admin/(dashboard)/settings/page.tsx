"use client";

import { AccountSettings } from "@/components/admin/settings/account-settings";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { cn } from "@/lib/cn";
import { useState } from "react";

const tabs = [
  { id: "account", label: "Account" },
  { id: "site", label: "Branding" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Account and site branding for the admin panel."
      />

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
        <div className="admin-card admin-card-body space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Branding & navigation
          </h3>
          <p className="text-sm text-gray-500">
            Edit <code className="text-xs">src/config/admin.config.ts</code> for panel name,
            logo letter, and sidebar links.
          </p>
        </div>
      )}
    </div>
  );
}
