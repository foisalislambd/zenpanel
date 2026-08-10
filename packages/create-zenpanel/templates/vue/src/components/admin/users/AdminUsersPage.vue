<script setup lang="ts">
import { computed, ref } from "vue";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminAddButton from "@/components/admin/ui/AdminAddButton.vue";
import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.vue";
import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.vue";
import AdminRowActions from "@/components/admin/ui/AdminRowActions.vue";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import { Search, X } from "lucide-vue-next";

type StatusFilter = "all" | UserAccountStatus;
type ProviderFilter = "all" | "email" | "google";

const props = defineProps<{
  users: PortalUserRow[];
  onAdd?: () => void;
  onEdit?: (user: PortalUserRow) => void;
  onDelete?: (user: PortalUserRow) => void;
}>();

const providerStyles: Record<string, string> = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

function dash(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

function providerClass(provider: string) {
  return (
    providerStyles[provider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800"
  );
}

const query = ref("");
const statusFilter = ref<StatusFilter>("all");
const providerFilter = ref<ProviderFilter>("all");
const selected = ref<PortalUserRow | null>(null);

function setStatusFilter(value: StatusFilter) {
  statusFilter.value = value;
}

function setProviderFilter(value: ProviderFilter) {
  providerFilter.value = value;
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.users.filter((user) => {
    if (statusFilter.value !== "all" && user.status !== statusFilter.value) {
      return false;
    }
    if (
      providerFilter.value !== "all" &&
      user.authProvider !== providerFilter.value
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      user.name,
      user.email,
      user.phone ?? "",
      user.lastIp ?? "",
      user.country ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const headings = [
  "User",
  "Country",
  "Phone",
  "Provider",
  "Status",
  "Joined",
  "Actions",
];

const detailRows = computed(() => {
  const user = selected.value;
  if (!user) return [];
  return [
    { label: "Provider", value: user.authProvider, capitalize: true },
    { label: "Status", value: user.status, capitalize: true },
    {
      label: "Email verified",
      value: user.emailVerified ? "Yes" : "No",
      capitalize: false,
    },
    { label: "Country", value: dash(user.country), capitalize: false },
    { label: "Phone", value: dash(user.phone), capitalize: false },
    { label: "Last IP", value: dash(user.lastIp), capitalize: false },
    {
      label: "Joined",
      value: new Date(user.createdAt).toLocaleString(),
      capitalize: false,
    },
  ];
});
</script>

<template>
  <div class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader title="Users">
      <template #actions>
        <AdminAddButton :on-click="onAdd" />
      </template>
    </AdminPageHeader>

    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="relative w-full max-w-md">
        <Search
          class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="query"
          type="search"
          placeholder="Search name, email, phone, IP..."
          class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
          aria-label="Search users"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <AdminFilterGroup
          ariaLabel="Filter by status"
          :value="statusFilter"
          :options="[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'banned', label: 'Banned' },
          ]"
          @change="setStatusFilter"
        />
        <AdminFilterGroup
          ariaLabel="Filter by provider"
          :value="providerFilter"
          :options="[
            { value: 'all', label: 'All' },
            { value: 'email', label: 'Email' },
            { value: 'google', label: 'Google' },
          ]"
          @change="setProviderFilter"
        />
      </div>
    </div>

    <div class="admin-card w-full overflow-hidden">
      <div
        v-if="filtered.length === 0"
        class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        No users match your filters
      </div>
      <template v-else>
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          <li v-for="user in filtered" :key="user.id" class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ user.name }}
                </p>
                <p class="mt-0.5 truncate text-sm text-gray-500">{{ user.email }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      providerClass(user.authProvider),
                    ]"
                  >
                    {{ user.authProvider }}
                  </span>
                  <span
                    v-if="user.status === 'active'"
                    class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
                  >
                    Active
                  </span>
                  <span
                    v-else
                    class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15"
                  >
                    Banned
                  </span>
                  <span
                    v-if="!user.emailVerified"
                    class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                  >
                    Unverified
                  </span>
                </div>
              </div>
              <AdminRowActions
                :item-label="user.name"
                size="md"
                :on-view="() => (selected = user)"
                :on-edit="onEdit ? () => onEdit?.(user) : undefined"
                :on-delete="onDelete ? () => onDelete?.(user) : undefined"
              />
            </div>
          </li>
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                <th
                  v-for="heading in headings"
                  :key="heading"
                  :class="[
                    'px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase',
                    heading === 'Actions' ? 'text-right' : '',
                  ]"
                >
                  {{ heading }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="user in filtered"
                :key="user.id"
                class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
              >
                <td class="px-5 py-3.5">
                  <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                  <p class="mt-0.5 text-sm text-gray-500">{{ user.email }}</p>
                </td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {{ dash(user.country) }}
                </td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {{ dash(user.phone) }}
                </td>
                <td class="px-5 py-3.5">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      providerClass(user.authProvider),
                    ]"
                  >
                    {{ user.authProvider }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span
                      v-if="user.status === 'active'"
                      class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
                    >
                      Active
                    </span>
                    <span
                      v-else
                      class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-error-500 dark:bg-error-500/15"
                    >
                      Banned
                    </span>
                    <span
                      v-if="!user.emailVerified"
                      class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                    >
                      Unverified
                    </span>
                  </div>
                </td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                  {{ new Date(user.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-5 py-3.5">
                  <AdminRowActions
                    :item-label="user.name"
                    :on-view="() => (selected = user)"
                    :on-edit="onEdit ? () => onEdit?.(user) : undefined"
                    :on-delete="onDelete ? () => onDelete?.(user) : undefined"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <div v-if="selected" class="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        class="absolute inset-0 bg-gray-900/40"
        aria-label="Close user details"
        @click="selected = null"
      />
      <aside
        class="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <div class="min-w-0">
            <h2 class="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {{ selected.name }}
            </h2>
            <p class="truncate text-sm text-gray-500">{{ selected.email }}</p>
          </div>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close"
            @click="selected = null"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
        <dl class="admin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm">
          <div v-for="row in detailRows" :key="row.label">
            <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
              {{ row.label }}
            </dt>
            <dd
              :class="[
                'mt-1 text-gray-900 dark:text-white',
                row.capitalize ? 'capitalize' : '',
              ]"
            >
              {{ row.value }}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>
