"use client";

import { AccountSettings, SecuritySettings, SettingsCard } from "@/components/admin/settings/account-settings";
import { PreferencesSettings } from "@/components/admin/settings/preferences-settings";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { cn } from "@/lib/cn";
import { useId, useRef, type KeyboardEvent } from "react";
import { useSearchParams } from "@/hooks/use-url-search-params";

const tabs = [
  { id: "account", label: "Account" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
  { id: "branding", label: "Branding" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminSettingsPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const activeTab: TabId = tabs.some((t) => t.id === requested) ? (requested as TabId) : "account";
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: TabId, focus = false) {
    setParams(id === "account" ? {} : { tab: id }, { replace: true });
    if (focus) tabRefs.current[id]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((t) => t.id === activeTab);
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      select(tabs[next].id, true);
    }
  }

  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader title="Settings" />

      <div
        role="tablist"
        aria-label="Settings sections"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              className={cn(
                "-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                selected
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-${tab.id}`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
          className="focus:outline-none"
        >
          {activeTab === tab.id && tab.id === "account" && <AccountSettings />}
          {activeTab === tab.id && tab.id === "security" && <SecuritySettings />}
          {activeTab === tab.id && tab.id === "preferences" && <PreferencesSettings />}
          {activeTab === tab.id && tab.id === "branding" && (
            <SettingsCard title="Branding & navigation" description="Panel name, logo letter, sidebar links and login copy.">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Edit{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/config/admin.config.ts</code>{" "}
                to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/index.css</code> (
                <code className="text-xs">--color-brand-*</code>).
              </p>
            </SettingsCard>
          )}
        </div>
      ))}
    </div>
  );
}
