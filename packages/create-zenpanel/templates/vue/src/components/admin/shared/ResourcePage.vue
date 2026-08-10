<script setup lang="ts">
import { computed, ref } from "vue";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminAddButton from "@/components/admin/ui/AdminAddButton.vue";
import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.vue";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState.vue";
import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.vue";
import AdminRowActions from "@/components/admin/ui/AdminRowActions.vue";
import type {
  AdminResource,
  AdminResourceStatus,
} from "@/lib/admin-data/resources";
import { Database, Search } from "lucide-vue-next";

type StatusFilter = "all" | AdminResourceStatus;

const props = withDefaults(
  defineProps<{
    title: string;
    resourceLabel: string;
    items: AdminResource[];
    searchPlaceholder?: string;
    onAdd?: () => void;
    onView?: (item: AdminResource) => void;
    onEdit?: (item: AdminResource) => void;
    onDelete?: (item: AdminResource) => void;
  }>(),
  {
    searchPlaceholder: "Search title, details...",
  },
);

const statusStyles: Record<AdminResourceStatus, string> = {
  published:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  archived:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const irregularPlurals: Record<string, string> = {
  category: "categories",
  post: "posts",
};

function pluralize(label: string, count: number): string {
  if (count === 1) return label;
  return irregularPlurals[label] ?? `${label}s`;
}

const query = ref("");
const statusFilter = ref<StatusFilter>("all");

function setStatusFilter(value: StatusFilter) {
  statusFilter.value = value;
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.items.filter((item) => {
    if (statusFilter.value !== "all" && item.status !== statusFilter.value) {
      return false;
    }
    if (!q) return true;
    const haystack = [item.title, item.meta ?? "", item.id].join(" ").toLowerCase();
    return haystack.includes(q);
  });
});

const headings = ["Title", "Status", "Details", "Updated", "Actions"];
</script>

<template>
  <div class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader :title="title">
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
          :placeholder="searchPlaceholder"
          class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
          :aria-label="`Search ${pluralize(resourceLabel, 2)}`"
        />
      </div>

      <AdminFilterGroup
        ariaLabel="Filter by status"
        :value="statusFilter"
        :options="[
          { value: 'all', label: 'All' },
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ]"
        @change="setStatusFilter"
      />
    </div>

    <div class="admin-card w-full overflow-hidden">
      <template v-if="filtered.length === 0">
        <AdminEmptyState
          v-if="items.length === 0"
          :icon="Database"
          :title="`No ${resourceLabel.toLowerCase()} yet`"
          :description="`This page is ready for your data. Connect your backend API to load, create, and manage ${resourceLabel.toLowerCase()} from here.`"
        />
        <div
          v-else
          class="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          No {{ pluralize(resourceLabel, 2) }} match your filters
        </div>
      </template>
      <template v-else>
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          <li v-for="item in filtered" :key="item.id" class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ item.title }}
                </p>
                <p class="mt-0.5 truncate text-sm text-gray-500">
                  {{ item.meta ?? "—" }}
                </p>
                <div class="mt-2">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      statusStyles[item.status],
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </div>
              <AdminRowActions
                :item-label="item.title"
                size="md"
                :on-view="onView ? () => onView(item) : undefined"
                :on-edit="onEdit ? () => onEdit(item) : undefined"
                :on-delete="onDelete ? () => onDelete(item) : undefined"
              />
            </div>
          </li>
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block">
          <table class="w-full min-w-[720px] text-left text-sm">
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
                v-for="item in filtered"
                :key="item.id"
                class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
              >
                <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                  {{ item.title }}
                </td>
                <td class="px-5 py-3.5">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      statusStyles[item.status],
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="max-w-[220px] truncate px-5 py-3.5 text-gray-500">
                  {{ item.meta ?? "—" }}
                </td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                  {{ new Date(item.updatedAt).toLocaleDateString() }}
                </td>
                <td class="px-5 py-3.5">
                  <AdminRowActions
                    :item-label="item.title"
                    :on-view="onView ? () => onView(item) : undefined"
                    :on-edit="onEdit ? () => onEdit(item) : undefined"
                    :on-delete="onDelete ? () => onDelete(item) : undefined"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
