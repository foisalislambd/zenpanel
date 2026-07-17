<script setup lang="ts">
import { ref } from "vue";
import AccountSettings from "@/components/admin/settings/AccountSettings.vue";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.vue";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "account", label: "Account" },
  { id: "site", label: "Branding" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const activeTab = ref<TabId>("account");
const baseId = `settings-tabs-${Math.random().toString(36).slice(2)}`;
</script>

<template>
  <div class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader title="Settings" />

    <div
      role="tablist"
      aria-label="Settings sections"
      class="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800"
    >
      <button
        v-for="tab in tabs"
        :id="`${baseId}-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`${baseId}-panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        :class="
          cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
            activeTab === tab.id
              ? 'bg-brand-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8',
          )
        "
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      role="tabpanel"
      :id="`${baseId}-panel-account`"
      :aria-labelledby="`${baseId}-account`"
      :hidden="activeTab !== 'account'"
    >
      <AccountSettings />
    </div>

    <div
      role="tabpanel"
      :id="`${baseId}-panel-site`"
      :aria-labelledby="`${baseId}-site`"
      :hidden="activeTab !== 'site'"
      class="admin-card admin-card-body space-y-3"
    >
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Branding & navigation</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Edit
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">
          src/config/admin.config.ts
        </code>
        to customize the panel name, logo letter, sidebar links, and login page copy.
      </p>
    </div>
  </div>
</template>
