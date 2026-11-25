import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AccountSettings } from "@/components/admin/settings/account-settings";
import { PreferencesSettings } from "@/components/admin/settings/preferences-settings";
import { SecuritySettings } from "@/components/admin/settings/security-settings";
import { SettingsCard } from "@/components/admin/settings/settings-card";
import { cn } from "@/lib/cn";
import { nextTabIndex } from "@/lib/dialog";
import { SETTINGS_TABS, parseSettingsTab, type SettingsTabId } from "@/lib/preferences";
import { useSearchParams } from "@solidjs/router";
import { createUniqueId, For, Match, Show, Switch } from "solid-js";

/** Settings with URL-synced tabs (`?tab=security`) and arrow-key navigation. */
export default function AdminSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const baseId = createUniqueId();
  const tabRefs: Partial<Record<SettingsTabId, HTMLButtonElement>> = {};
  const activeTab = () => parseSettingsTab(typeof searchParams.tab === "string" ? searchParams.tab : null);

  function select(id: SettingsTabId, focus = false) {
    setSearchParams({ tab: id === "account" ? undefined : id }, { replace: true });
    if (focus) queueMicrotask(() => tabRefs[id]?.focus());
  }

  function onKeyDown(e: KeyboardEvent) {
    const index = SETTINGS_TABS.findIndex((t) => t.id === activeTab());
    const next = nextTabIndex(e.key, index, SETTINGS_TABS.length);
    if (next >= 0) {
      e.preventDefault();
      select(SETTINGS_TABS[next].id, true);
    }
  }

  return (
    <div class="admin-content space-y-6">
      <AdminPageHeader title="Settings" />

      <div
        role="tablist"
        aria-label="Settings sections"
        class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800"
        onKeyDown={onKeyDown}
      >
        <For each={SETTINGS_TABS}>
          {(tab) => (
            <button
              ref={(el) => (tabRefs[tab.id] = el)}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}`}
              aria-selected={activeTab() === tab.id}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabindex={activeTab() === tab.id ? 0 : -1}
              class={cn(
                "-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab() === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
              )}
              onClick={() => select(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>

      <For each={SETTINGS_TABS}>
        {(tab) => (
          <div
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-${tab.id}`}
            hidden={activeTab() !== tab.id}
            tabindex="0"
            class="focus:outline-none"
          >
            <Show when={activeTab() === tab.id}>
              <Switch>
                <Match when={tab.id === "account"}>
                  <AccountSettings />
                </Match>
                <Match when={tab.id === "security"}>
                  <SecuritySettings />
                </Match>
                <Match when={tab.id === "preferences"}>
                  <PreferencesSettings />
                </Match>
                <Match when={true}>
                  <SettingsCard
                    title="Branding & navigation"
                    description="Panel name, logo letter, sidebar links and login copy."
                  >
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      Edit{" "}
                      <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">
                        src/config/admin.config.ts
                      </code>{" "}
                      to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in{" "}
                      <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/index.css</code> (
                      <code class="text-xs">--color-brand-*</code>).
                    </p>
                  </SettingsCard>
                </Match>
              </Switch>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
