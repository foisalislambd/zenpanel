import { AccountSettings } from "@/components/admin/settings/account-settings";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import { cn } from "@/lib/cn";
import { createSignal, createUniqueId, For } from "solid-js";

const tabs = [
  { id: "account", label: "Account" },
  { id: "site", label: "Branding" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = createSignal<TabId>("account");
  const baseId = createUniqueId();

  return (
    <div class="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader title="Settings" />

      <div
        role="tablist"
        aria-label="Settings sections"
        class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800"
      >
        <For each={tabs}>
          {(tab) => {
            const selected = () => activeTab() === tab.id;
            return (
              <button
                type="button"
                role="tab"
                id={`${baseId}-${tab.id}`}
                aria-selected={selected()}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={selected() ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                class={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
                  selected()
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8",
                )}
              >
                {tab.label}
              </button>
            );
          }}
        </For>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-account`}
        aria-labelledby={`${baseId}-account`}
        hidden={activeTab() !== "account"}
      >
        <AccountSettings />
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-site`}
        aria-labelledby={`${baseId}-site`}
        hidden={activeTab() !== "site"}
        class="admin-card admin-card-body space-y-3"
      >
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Branding & navigation
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Edit{" "}
          <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">
            src/config/admin.config.ts
          </code>{" "}
          to customize the panel name, logo letter, sidebar links, and login page copy.
        </p>
      </div>
    </div>
  );
}
