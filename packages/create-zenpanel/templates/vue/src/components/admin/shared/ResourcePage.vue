<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Download, Inbox, Search, SearchX, X } from "lucide-vue-next";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import ResourceEditor, { type ResourceInput } from "@/components/admin/shared/ResourceEditor.vue";
import ResourceStatusBadge from "@/components/admin/shared/ResourceStatusBadge.vue";
import AdminAddButton from "@/components/admin/ui/AdminAddButton.vue";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog.vue";
import AdminDialog from "@/components/admin/ui/AdminDialog.vue";
import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.vue";
import AdminPagination from "@/components/admin/ui/AdminPagination.vue";
import AdminRowActions from "@/components/admin/ui/AdminRowActions.vue";
import AdminSortHeader from "@/components/admin/ui/AdminSortHeader.vue";
import { useAdminToast } from "@/composables/use-admin-toast";
import { previewId, usePreviewCollection } from "@/composables/use-preview-collection";
import type { AdminResource, AdminResourceStatus } from "@/lib/admin-data/resources";
import {
  RESOURCE_STATUSES,
  capitalize,
  countResourceStatuses,
  filterResources,
  pluralize,
  type ResourceSortKey,
  type ResourceStatusFilter,
} from "@/lib/admin-resources";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { downloadCsv, nextSort, type SortState } from "@/lib/sort";

/**
 * Reusable admin resource list page: search, status filters, sortable table,
 * pagination, CSV export, create / edit / view / delete with confirmation.
 * Without the `on*` handlers it edits an in-memory preview copy.
 */
const props = withDefaults(
  defineProps<{
    title: string;
    resourceLabel: string;
    items: AdminResource[];
    searchPlaceholder?: string;
    titleLabel?: string;
    metaLabel?: string;
    /** Validate the title as an email address (newsletter, contacts). */
    titleIsEmail?: boolean;
    /** Rename statuses per resource, e.g. `{ published: "Paid" }`. */
    statusLabels?: Partial<Record<AdminResourceStatus, string>>;
    onCreate?: (input: ResourceInput) => Promise<AdminResource> | AdminResource;
    onUpdate?: (item: AdminResource, input: ResourceInput) => Promise<AdminResource> | AdminResource;
    onDelete?: (item: AdminResource) => Promise<void> | void;
  }>(),
  {
    searchPlaceholder: "Search title, details...",
    titleLabel: "Title",
    metaLabel: "Details",
    titleIsEmail: false,
    statusLabels: undefined,
    onCreate: undefined,
    onUpdate: undefined,
    onDelete: undefined,
  },
);

const { toast } = useAdminToast();
const route = useRoute();
const router = useRouter();
const items = usePreviewCollection<AdminResource>(`resource:${props.resourceLabel}`, props.items);

const query = ref("");
const statusFilter = ref<ResourceStatusFilter>("all");
const sort = ref<SortState<ResourceSortKey>>({ key: "updatedAt", direction: "desc" });
const page = ref(1);
const pageSize = ref(ADMIN_PAGE_SIZE);
const editing = ref<AdminResource | "new" | null>(route.query.new === "1" ? "new" : null);
const viewing = ref<AdminResource | null>(null);
const deleting = ref<AdminResource | null>(null);

const label = computed(() => props.resourceLabel.toLowerCase());
const plural = computed(() => pluralize(label.value, 2));
const statusText = (s: AdminResourceStatus) => props.statusLabels?.[s] ?? capitalize(s);

const counts = computed(() => countResourceStatuses(items.value));
const filtered = computed(() => filterResources(items.value, query.value, statusFilter.value, sort.value));
const paged = computed(() => slicePage(filtered.value, page.value, pageSize.value));
const hasFilters = computed(() => query.value.trim() !== "" || statusFilter.value !== "all");
const filterOptions = computed(() => [
  { value: "all" as ResourceStatusFilter, label: "All", count: counts.value.all },
  ...RESOURCE_STATUSES.map((s) => ({ value: s as ResourceStatusFilter, label: statusText(s), count: counts.value[s] })),
]);

function clearFilters() {
  query.value = "";
  statusFilter.value = "all";
  page.value = 1;
}

function closeEditor() {
  editing.value = null;
  if (route.query.new !== undefined) {
    const { new: _omit, ...rest } = route.query;
    void router.replace({ query: rest });
  }
}

async function handleSave(input: ResourceInput) {
  const target = editing.value;
  try {
    if (target === "new") {
      const created = props.onCreate
        ? await props.onCreate(input)
        : { id: previewId(label.value.slice(0, 3)), updatedAt: new Date().toISOString(), ...input };
      items.value = [created, ...items.value];
      statusFilter.value = "all";
      page.value = 1;
      toast({ title: `${capitalize(label.value)} created`, description: `“${created.title}” was added.` });
    } else if (target) {
      const updated = props.onUpdate
        ? await props.onUpdate(target, input)
        : { ...target, ...input, updatedAt: new Date().toISOString() };
      items.value = items.value.map((i) => (i.id === target.id ? updated : i));
      toast({ title: "Changes saved", description: `“${updated.title}” was updated.` });
    }
    closeEditor();
  } catch (err) {
    toast({ variant: "error", title: "Could not save", description: err instanceof Error ? err.message : undefined });
  }
}

async function handleDelete() {
  const target = deleting.value;
  if (!target) return;
  deleting.value = null;
  try {
    await props.onDelete?.(target);
    items.value = items.value.filter((i) => i.id !== target.id);
    toast({ title: `${capitalize(label.value)} deleted`, description: `“${target.title}” was removed.` });
  } catch (err) {
    toast({ variant: "error", title: "Could not delete", description: err instanceof Error ? err.message : undefined });
  }
}

function exportCsv() {
  const rows = filtered.value;
  downloadCsv(
    `${plural.value}.csv`,
    ["ID", props.titleLabel, "Status", props.metaLabel, "Updated"],
    rows.map((i) => [i.id, i.title, statusText(i.status), i.meta ?? "", i.updatedAt]),
  );
  toast({
    variant: "info",
    title: "Export ready",
    description: `${rows.length} ${pluralize(label.value, rows.length)} exported to CSV.`,
  });
}

function sortBy(key: ResourceSortKey) {
  sort.value = nextSort(sort.value, key);
  page.value = 1;
}

function openEdit(item: AdminResource) {
  editing.value = item;
  viewing.value = null;
}
function openDelete(item: AdminResource) {
  deleting.value = item;
  viewing.value = null;
}
</script>

<template>
  <div class="admin-content">
    <AdminPageHeader :title="title">
      <template #actions>
        <button type="button" :disabled="filtered.length === 0" class="admin-btn admin-btn-secondary" @click="exportCsv">
          <Download class="h-4 w-4" aria-hidden="true" />
          Export
        </button>
        <AdminAddButton :label="`Add ${label}`" :on-click="() => (editing = 'new')" />
      </template>
    </AdminPageHeader>

    <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="relative w-full max-w-md">
        <Search class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          v-model="query"
          type="search"
          :placeholder="searchPlaceholder"
          class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          :aria-label="`Search ${plural}`"
          @input="page = 1"
        />
        <button
          v-if="query"
          type="button"
          class="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
          aria-label="Clear search"
          @click="
            query = '';
            page = 1;
          "
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <AdminFilterGroup
        group-label="Filter by status"
        :value="statusFilter"
        :options="filterOptions"
        @change="
          (v) => {
            statusFilter = v as ResourceStatusFilter;
            page = 1;
          }
        "
      />
    </div>

    <div class="admin-card w-full overflow-hidden">
      <div v-if="filtered.length === 0" class="flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
          <Inbox v-if="items.length === 0" class="h-6 w-6" aria-hidden="true" />
          <SearchX v-else class="h-6 w-6" aria-hidden="true" />
        </span>
        <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          {{ items.length === 0 ? `No ${plural} yet` : `No ${plural} match your filters` }}
        </p>
        <p class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {{ items.length === 0 ? `Create your first ${label} to get started.` : "Try a different search term or clear the filters." }}
        </p>
        <div class="mt-5">
          <AdminAddButton v-if="items.length === 0" :label="`Add ${label}`" :on-click="() => (editing = 'new')" />
          <button v-else-if="hasFilters" type="button" class="admin-btn admin-btn-secondary" @click="clearFilters">
            Clear filters
          </button>
        </div>
      </div>
      <template v-else>
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          <li v-for="item in paged.rows" :key="item.id" class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <button type="button" class="min-w-0 flex-1 rounded-md text-left" @click="viewing = item">
                <p class="truncate font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                <p class="mt-0.5 truncate text-sm text-gray-500">{{ item.meta ?? "-" }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <ResourceStatusBadge :status="item.status" :label="statusText(item.status)" />
                  <span class="text-xs text-gray-500">{{ formatDate(item.updatedAt) }}</span>
                </div>
              </button>
              <AdminRowActions
                :item-label="item.title"
                size="md"
                :on-view="() => (viewing = item)"
                :on-edit="() => (editing = item)"
                :on-delete="() => (deleting = item)"
              />
            </div>
          </li>
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" :aria-label="`${title} table`">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                <AdminSortHeader :label="titleLabel" :active="sort.key === 'title'" :direction="sort.direction" @sort="sortBy('title')" />
                <AdminSortHeader label="Status" :active="sort.key === 'status'" :direction="sort.direction" @sort="sortBy('status')" />
                <th scope="col" class="px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase">{{ metaLabel }}</th>
                <AdminSortHeader label="Updated" :active="sort.key === 'updatedAt'" :direction="sort.direction" @sort="sortBy('updatedAt')" />
                <th scope="col" class="px-5 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="item in paged.rows" :key="item.id" class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                  <button type="button" class="rounded text-left hover:text-brand-600 dark:hover:text-brand-400" @click="viewing = item">
                    {{ item.title }}
                  </button>
                </td>
                <td class="px-5 py-3.5">
                  <ResourceStatusBadge :status="item.status" :label="statusText(item.status)" />
                </td>
                <td class="max-w-[260px] truncate px-5 py-3.5 text-gray-500" :title="item.meta">{{ item.meta ?? "-" }}</td>
                <td class="px-5 py-3.5 whitespace-nowrap text-gray-500">
                  <time :datetime="item.updatedAt">{{ formatDate(item.updatedAt) }}</time>
                </td>
                <td class="px-5 py-3.5">
                  <AdminRowActions
                    :item-label="item.title"
                    :on-view="() => (viewing = item)"
                    :on-edit="() => (editing = item)"
                    :on-delete="() => (deleting = item)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <AdminPagination
        :page="paged.page"
        :page-count="paged.pageCount"
        :total="filtered.length"
        :page-size="pageSize"
        show-page-size
        @page-change="(p) => (page = p)"
        @page-size-change="
          (size) => {
            pageSize = size;
            page = 1;
          }
        "
      />
    </div>

    <ResourceEditor
      v-if="editing"
      :key="editing === 'new' ? 'new' : editing.id"
      :item="editing === 'new' ? null : editing"
      :label="label"
      :title-label="titleLabel"
      :meta-label="metaLabel"
      :title-is-email="titleIsEmail"
      :status-text="statusText"
      :on-save="handleSave"
      @cancel="closeEditor"
    />

    <AdminDialog
      :open="viewing !== null"
      placement="right"
      :title="viewing?.title ?? ''"
      :description="viewing ? `${capitalize(label)} · ${viewing.id}` : undefined"
      @close="viewing = null"
    >
      <dl v-if="viewing" class="space-y-4 text-sm">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ titleLabel }}</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{{ viewing.title }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Status</dt>
          <dd class="mt-1"><ResourceStatusBadge :status="viewing.status" :label="statusText(viewing.status)" /></dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ metaLabel }}</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{{ viewing.meta || "-" }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last updated</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">{{ new Date(viewing.updatedAt).toLocaleString() }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">ID</dt>
          <dd class="mt-1 text-gray-900 dark:text-white">
            <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/10">{{ viewing.id }}</code>
          </dd>
        </div>
      </dl>
      <template v-if="viewing" #footer>
        <button type="button" class="admin-btn admin-btn-danger-ghost" @click="openDelete(viewing)">Delete</button>
        <button type="button" class="admin-btn admin-btn-primary" @click="openEdit(viewing)">Edit {{ label }}</button>
      </template>
    </AdminDialog>

    <AdminConfirmDialog
      :open="deleting !== null"
      :title="`Delete ${label}?`"
      :confirm-label="`Delete ${label}`"
      @cancel="deleting = null"
      @confirm="handleDelete"
    >
      <strong class="font-semibold text-gray-900 dark:text-white">“{{ deleting?.title }}”</strong>
      will be permanently removed. This action cannot be undone.
    </AdminConfirmDialog>
  </div>
</template>
