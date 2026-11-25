<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Ban, Download, Search, SearchX, ShieldCheck, X } from "lucide-vue-next";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminAddButton from "@/components/admin/ui/AdminAddButton.vue";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog.vue";
import AdminDialog from "@/components/admin/ui/AdminDialog.vue";
import AdminFilterGroup from "@/components/admin/ui/AdminFilterGroup.vue";
import AdminPagination from "@/components/admin/ui/AdminPagination.vue";
import AdminRowActions from "@/components/admin/ui/AdminRowActions.vue";
import AdminSortHeader from "@/components/admin/ui/AdminSortHeader.vue";
import UserAvatar from "@/components/admin/users/UserAvatar.vue";
import UserBadges from "@/components/admin/users/UserBadges.vue";
import UserEditor, { type UserInput } from "@/components/admin/users/UserEditor.vue";
import { useAdminToast } from "@/composables/use-admin-toast";
import { previewId, usePreviewCollection } from "@/composables/use-preview-collection";
import type { PortalUserRow, UserAccountStatus } from "@/lib/admin-api";
import {
  USERS_CSV_HEADERS,
  capitalize,
  dash,
  filterUsers,
  presentProviders,
  usersCsvRows,
  type UserSortKey,
  type UserStatusFilter,
} from "@/lib/admin-resources";
import { formatDate } from "@/lib/format";
import { ADMIN_PAGE_SIZE, slicePage } from "@/lib/pagination";
import { downloadCsv, nextSort, type SortState } from "@/lib/sort";

/**
 * Users management: search, filters, sortable table, pagination, CSV export,
 * detail drawer, invite / edit / ban / delete with confirmation.
 */
const props = defineProps<{
  users: PortalUserRow[];
  onCreate?: (input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onUpdate?: (user: PortalUserRow, input: UserInput) => Promise<PortalUserRow> | PortalUserRow;
  onDelete?: (user: PortalUserRow) => Promise<void> | void;
}>();

const { toast } = useAdminToast();
const route = useRoute();
const router = useRouter();
const users = usePreviewCollection<PortalUserRow>("users", props.users);

const query = ref("");
const statusFilter = ref<UserStatusFilter>("all");
const providerFilter = ref("all");
const sort = ref<SortState<UserSortKey>>({ key: "createdAt", direction: "desc" });
const page = ref(1);
const pageSize = ref(ADMIN_PAGE_SIZE);
const selectedId = ref<string | null>(null);
const editing = ref<PortalUserRow | "new" | null>(route.query.new === "1" ? "new" : null);
const deleting = ref<PortalUserRow | null>(null);
const banning = ref<PortalUserRow | null>(null);

const selected = computed(() => users.value.find((u) => u.id === selectedId.value) ?? null);
const providerOptions = computed(() => [
  { value: "all", label: "All" },
  ...presentProviders(users.value).map((p) => ({ value: p as string, label: capitalize(p) })),
]);
const statusOptions: { value: UserStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
];
const filtered = computed(() =>
  filterUsers(users.value, query.value, statusFilter.value, providerFilter.value, sort.value),
);
const paged = computed(() => slicePage(filtered.value, page.value, pageSize.value));
const hasFilters = computed(
  () => query.value.trim() !== "" || statusFilter.value !== "all" || providerFilter.value !== "all",
);
const existingEmails = computed(() => {
  const target = editing.value;
  return users.value
    .filter((u) => target === "new" || u.id !== target?.id)
    .map((u) => u.email.toLowerCase());
});
const detailRows = computed(() => {
  const s = selected.value;
  if (!s) return [];
  return [
    { label: "Country", value: dash(s.country) },
    { label: "Phone", value: dash(s.phone) },
    { label: "Email verified", value: s.emailVerified ? "Yes" : "No" },
    { label: "Last IP", value: dash(s.lastIp) },
    { label: "Joined", value: new Date(s.createdAt).toLocaleString() },
    { label: "User ID", value: s.id },
  ];
});

const errMsg = (err: unknown) => (err instanceof Error ? err.message : undefined);

function clearFilters() {
  query.value = "";
  statusFilter.value = "all";
  providerFilter.value = "all";
  page.value = 1;
}

function closeEditor() {
  editing.value = null;
  if (route.query.new !== undefined) {
    const { new: _omit, ...rest } = route.query;
    void router.replace({ query: rest });
  }
}

async function handleSave(input: UserInput) {
  const target = editing.value;
  try {
    if (target === "new") {
      const created: PortalUserRow = props.onCreate
        ? await props.onCreate(input)
        : {
            id: previewId("u"),
            authProvider: "email",
            createdAt: new Date().toISOString(),
            emailVerified: false,
            lastIp: null,
            ...input,
          };
      users.value = [created, ...users.value];
      page.value = 1;
      toast({ title: "User invited", description: `An invitation was sent to ${created.email}.` });
    } else if (target) {
      const updated = props.onUpdate ? await props.onUpdate(target, input) : { ...target, ...input };
      users.value = users.value.map((u) => (u.id === target.id ? updated : u));
      toast({ title: "User updated", description: `${updated.name}'s profile was saved.` });
    }
    closeEditor();
  } catch (err) {
    toast({ variant: "error", title: "Could not save user", description: errMsg(err) });
  }
}

async function confirmDelete() {
  const target = deleting.value;
  if (!target) return;
  deleting.value = null;
  try {
    await props.onDelete?.(target);
    users.value = users.value.filter((u) => u.id !== target.id);
    if (selectedId.value === target.id) selectedId.value = null;
    toast({ title: "User deleted", description: `${target.name} was removed.` });
  } catch (err) {
    toast({ variant: "error", title: "Could not delete user", description: errMsg(err) });
  }
}

async function confirmBanToggle() {
  const target = banning.value;
  if (!target) return;
  banning.value = null;
  const status: UserAccountStatus = target.status === "banned" ? "active" : "banned";
  try {
    const updated = props.onUpdate ? await props.onUpdate(target, { ...target, status }) : { ...target, status };
    users.value = users.value.map((u) => (u.id === target.id ? updated : u));
    toast({
      title: status === "banned" ? "User banned" : "User reactivated",
      description: status === "banned" ? `${target.name} can no longer sign in.` : `${target.name} can sign in again.`,
    });
  } catch (err) {
    toast({ variant: "error", title: "Could not update status", description: errMsg(err) });
  }
}

function exportCsv() {
  downloadCsv("users.csv", USERS_CSV_HEADERS, usersCsvRows(filtered.value));
  toast({ variant: "info", title: "Export ready", description: `${filtered.value.length} users exported to CSV.` });
}

function sortBy(key: UserSortKey) {
  sort.value = nextSort(sort.value, key);
  page.value = 1;
}

function editSelected(user: PortalUserRow) {
  editing.value = user;
  selectedId.value = null;
}

const plainTh = "px-5 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase";
</script>

<template>
  <div class="admin-content">
    <AdminPageHeader title="Users">
      <template #actions>
        <button type="button" :disabled="filtered.length === 0" class="admin-btn admin-btn-secondary" @click="exportCsv">
          <Download class="h-4 w-4" aria-hidden="true" />
          Export
        </button>
        <AdminAddButton label="Invite user" :on-click="() => (editing = 'new')" />
      </template>
    </AdminPageHeader>

    <div class="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div class="relative w-full max-w-md">
        <Search class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          v-model="query"
          type="search"
          placeholder="Search name, email, phone, IP..."
          class="h-11 w-full rounded-xl border border-gray-200 bg-white pr-10 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden"
          aria-label="Search users"
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
      <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
        <AdminFilterGroup
          label="Status"
          group-label="Filter by status"
          :value="statusFilter"
          :options="statusOptions"
          @change="
            (v) => {
              statusFilter = v as UserStatusFilter;
              page = 1;
            }
          "
        />
        <AdminFilterGroup
          label="Provider"
          group-label="Filter by sign-in provider"
          :value="providerFilter"
          :options="providerOptions"
          @change="
            (v) => {
              providerFilter = v;
              page = 1;
            }
          "
        />
      </div>
    </div>

    <div class="admin-card w-full overflow-hidden">
      <div v-if="filtered.length === 0" class="flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
          <SearchX class="h-6 w-6" aria-hidden="true" />
        </span>
        <p class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          {{ users.length === 0 ? "No users yet" : "No users match your filters" }}
        </p>
        <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {{ users.length === 0 ? "Invite your first user to get started." : "Try a different search or clear the filters." }}
        </p>
        <button v-if="hasFilters" type="button" class="admin-btn admin-btn-secondary mt-5" @click="clearFilters">
          Clear filters
        </button>
      </div>
      <template v-else>
        <ul class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          <li v-for="user in paged.rows" :key="user.id" class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <button type="button" class="flex min-w-0 flex-1 gap-3 rounded-md text-left" @click="selectedId = user.id">
                <UserAvatar :name="user.name" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                  <span class="mt-0.5 block truncate text-sm text-gray-500">{{ user.email }}</span>
                  <span class="mt-2 flex flex-wrap items-center gap-1.5"><UserBadges :user="user" /></span>
                </span>
              </button>
              <AdminRowActions
                :item-label="user.name"
                size="md"
                :on-view="() => (selectedId = user.id)"
                :on-edit="() => (editing = user)"
                :on-delete="() => (deleting = user)"
              />
            </div>
          </li>
        </ul>

        <div class="admin-scrollbar hidden overflow-x-auto md:block" tabindex="0" role="region" aria-label="Users table">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                <AdminSortHeader label="User" :active="sort.key === 'name'" :direction="sort.direction" @sort="sortBy('name')" />
                <AdminSortHeader label="Country" :active="sort.key === 'country'" :direction="sort.direction" @sort="sortBy('country')" />
                <th scope="col" :class="plainTh">Phone</th>
                <AdminSortHeader
                  label="Provider"
                  :active="sort.key === 'authProvider'"
                  :direction="sort.direction"
                  @sort="sortBy('authProvider')"
                />
                <th scope="col" :class="plainTh">Status</th>
                <AdminSortHeader label="Joined" :active="sort.key === 'createdAt'" :direction="sort.direction" @sort="sortBy('createdAt')" />
                <th scope="col" :class="[plainTh, 'text-right']">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="user in paged.rows" :key="user.id" class="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]">
                <td class="px-5 py-3">
                  <button type="button" class="group flex items-center gap-3 rounded-md text-left" @click="selectedId = user.id">
                    <UserAvatar :name="user.name" />
                    <span>
                      <span class="block font-medium text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                        {{ user.name }}
                      </span>
                      <span class="mt-0.5 block text-sm text-gray-500">{{ user.email }}</span>
                    </span>
                  </button>
                </td>
                <td class="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{{ dash(user.country) }}</td>
                <td class="px-5 py-3 whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-400">{{ dash(user.phone) }}</td>
                <td class="px-5 py-3">
                  <UserBadges :user="user" :status="false" />
                </td>
                <td class="px-5 py-3">
                  <div class="flex flex-wrap items-center gap-1.5"><UserBadges :user="user" :provider="false" /></div>
                </td>
                <td class="px-5 py-3 whitespace-nowrap text-gray-500">
                  <time :datetime="user.createdAt">{{ formatDate(user.createdAt) }}</time>
                </td>
                <td class="px-5 py-3">
                  <AdminRowActions
                    :item-label="user.name"
                    :on-view="() => (selectedId = user.id)"
                    :on-edit="() => (editing = user)"
                    :on-delete="() => (deleting = user)"
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

    <AdminDialog
      :open="selected !== null"
      placement="right"
      :title="selected?.name ?? ''"
      :description="selected?.email"
      @close="selectedId = null"
    >
      <div v-if="selected" class="space-y-6">
        <div class="flex items-center gap-3">
          <UserAvatar :name="selected.name" />
          <div class="flex flex-wrap gap-1.5"><UserBadges :user="selected" /></div>
        </div>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div v-for="row in detailRows" :key="row.label">
            <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ row.label }}</dt>
            <dd class="mt-1 break-words text-gray-900 dark:text-white">{{ row.value }}</dd>
          </div>
        </dl>
      </div>
      <template v-if="selected" #footer>
        <button type="button" class="admin-btn admin-btn-danger-ghost" @click="deleting = selected">Delete</button>
        <button type="button" class="admin-btn admin-btn-secondary" @click="banning = selected">
          <template v-if="selected.status === 'banned'">
            <ShieldCheck class="h-4 w-4" aria-hidden="true" /> Reactivate
          </template>
          <template v-else><Ban class="h-4 w-4" aria-hidden="true" /> Ban user</template>
        </button>
        <button type="button" class="admin-btn admin-btn-primary" @click="editSelected(selected)">Edit user</button>
      </template>
    </AdminDialog>

    <UserEditor
      v-if="editing"
      :key="editing === 'new' ? 'new' : editing.id"
      :user="editing === 'new' ? null : editing"
      :existing-emails="existingEmails"
      :on-save="handleSave"
      @cancel="closeEditor"
    />

    <AdminConfirmDialog
      :open="deleting !== null"
      title="Delete user?"
      confirm-label="Delete user"
      @cancel="deleting = null"
      @confirm="confirmDelete"
    >
      <strong class="font-semibold text-gray-900 dark:text-white">{{ deleting?.name }}</strong>
      ({{ deleting?.email }}) and their data will be permanently removed. This cannot be undone.
    </AdminConfirmDialog>

    <AdminConfirmDialog
      :open="banning !== null"
      :tone="banning?.status === 'banned' ? 'default' : 'danger'"
      :title="banning?.status === 'banned' ? 'Reactivate user?' : 'Ban user?'"
      :confirm-label="banning?.status === 'banned' ? 'Reactivate' : 'Ban user'"
      @cancel="banning = null"
      @confirm="confirmBanToggle"
    >
      {{
        banning?.status === "banned"
          ? `${banning?.name} will be able to sign in again.`
          : `${banning?.name} will be signed out and blocked from signing in until reactivated.`
      }}
    </AdminConfirmDialog>
  </div>
</template>
