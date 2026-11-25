<script lang="ts">
  import { tick } from "svelte";
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import AccountSettings from "@/components/admin/settings/AccountSettings.svelte";
  import PreferencesSettings from "@/components/admin/settings/PreferencesSettings.svelte";
  import SecuritySettings from "@/components/admin/settings/SecuritySettings.svelte";
  import SettingsCard from "@/components/admin/settings/SettingsCard.svelte";
  import { cn } from "@/lib/cn";
  import { nextTabIndex } from "@/lib/dialog";
  import { SETTINGS_TABS, parseSettingsTab, type SettingsTabId } from "@/lib/preferences";
  import { setSearchParams, usePathname } from "@/lib/router.svelte";

  const location = usePathname();
  const baseId = $props.id();
  const tabRefs: Record<string, HTMLButtonElement | null> = $state({});
  const activeTab = $derived(parseSettingsTab(new URLSearchParams(location.search).get("tab")));

  async function select(id: SettingsTabId, focus = false) {
    setSearchParams(id === "account" ? {} : { tab: id });
    if (focus) {
      await tick();
      tabRefs[id]?.focus();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    const index = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
    const next = nextTabIndex(e.key, index, SETTINGS_TABS.length);
    if (next >= 0) {
      e.preventDefault();
      void select(SETTINGS_TABS[next].id, true);
    }
  }
</script>

<div class="admin-content space-y-6">
  <AdminPageHeader title="Settings" />

  <div
    role="tablist"
    tabindex="-1"
    aria-label="Settings sections"
    class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800"
    onkeydown={onKeyDown}
  >
    {#each SETTINGS_TABS as tab (tab.id)}
      <button
        bind:this={tabRefs[tab.id]}
        type="button"
        role="tab"
        id="{baseId}-{tab.id}"
        aria-selected={activeTab === tab.id}
        aria-controls="{baseId}-panel-{tab.id}"
        tabindex={activeTab === tab.id ? 0 : -1}
        class={cn(
          "-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
          activeTab === tab.id
            ? "border-brand-500 text-brand-600 dark:text-brand-400"
            : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
        )}
        onclick={() => select(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#each SETTINGS_TABS as tab (tab.id)}
    <div
      role="tabpanel"
      id="{baseId}-panel-{tab.id}"
      aria-labelledby="{baseId}-{tab.id}"
      hidden={activeTab !== tab.id}
      tabindex="0"
      class="focus:outline-none"
    >
      {#if activeTab === tab.id}
        {#if tab.id === "account"}
          <AccountSettings />
        {:else if tab.id === "security"}
          <SecuritySettings />
        {:else if tab.id === "preferences"}
          <PreferencesSettings />
        {:else}
          <SettingsCard title="Branding & navigation" description="Panel name, logo letter, sidebar links and login copy.">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Edit
              <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/config/admin.config.ts</code>
              to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in
              <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/index.css</code>
              (<code class="text-xs">--color-brand-*</code>).
            </p>
          </SettingsCard>
        {/if}
      {/if}
    </div>
  {/each}
</div>
