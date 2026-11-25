<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AccountSettings from "@/components/admin/settings/AccountSettings.vue";
import PreferencesSettings from "@/components/admin/settings/PreferencesSettings.vue";
import SecuritySettings from "@/components/admin/settings/SecuritySettings.vue";
import SettingsCard from "@/components/admin/settings/SettingsCard.vue";
import { cn } from "@/lib/cn";
import { nextTabIndex } from "@/lib/dialog";
import { SETTINGS_TABS, parseSettingsTab, type SettingsTabId } from "@/lib/preferences";

const route = useRoute();
const router = useRouter();
const baseId = useId();
const tabRefs = ref<Record<string, HTMLButtonElement | null>>({});

const activeTab = computed(() => parseSettingsTab(typeof route.query.tab === "string" ? route.query.tab : null));

async function select(id: SettingsTabId, focus = false) {
  await router.replace({ query: id === "account" ? {} : { tab: id } });
  if (focus) {
    await nextTick();
    tabRefs.value[id]?.focus();
  }
}

function onKeyDown(e: KeyboardEvent) {
  const index = SETTINGS_TABS.findIndex((t) => t.id === activeTab.value);
  const next = nextTabIndex(e.key, index, SETTINGS_TABS.length);
  if (next >= 0) {
    e.preventDefault();
    void select(SETTINGS_TABS[next].id, true);
  }
}
</script>

<template>
  <div class="admin-content space-y-6">
    <AdminPageHeader title="Settings" />

    <div
      role="tablist"
      aria-label="Settings sections"
      class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 px-1 dark:border-gray-800"
      @keydown="onKeyDown"
    >
      <button
        v-for="tab in SETTINGS_TABS"
        :id="`${baseId}-${tab.id}`"
        :key="tab.id"
        :ref="(el) => (tabRefs[tab.id] = el as HTMLButtonElement | null)"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`${baseId}-panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        :class="
          cn(
            '-mb-[2px] shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
          )
        "
        @click="select(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in SETTINGS_TABS"
      :id="`${baseId}-panel-${tab.id}`"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`${baseId}-${tab.id}`"
      :hidden="activeTab !== tab.id"
      tabindex="0"
      class="focus:outline-none"
    >
      <template v-if="activeTab === tab.id">
        <AccountSettings v-if="tab.id === 'account'" />
        <SecuritySettings v-else-if="tab.id === 'security'" />
        <PreferencesSettings v-else-if="tab.id === 'preferences'" />
        <SettingsCard v-else title="Branding & navigation" description="Panel name, logo letter, sidebar links and login copy.">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Edit
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/config/admin.config.ts</code>
            to customize the panel name, logo letter, sidebar links, and login page copy. Colors live in
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">src/index.css</code>
            (<code class="text-xs">--color-brand-*</code>).
          </p>
        </SettingsCard>
      </template>
    </div>
  </div>
</template>
