<script setup lang="ts">
import { onMounted, ref } from "vue";
import RecentUsersTable from "@/components/admin/dashboard/RecentUsersTable.vue";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.vue";
import AdminLoading from "@/components/admin/ui/AdminLoading.vue";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

const users = ref<PortalUserRow[] | null>(null);
const loading = ref(true);
const error = ref<unknown>(null);

onMounted(() => {
  loading.value = true;
  error.value = null;
  previewFetchUsers()
    .then((res) => {
      users.value = res.users;
    })
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<template>
  <AdminLoading v-if="loading" message="Loading users…" />
  <div v-else-if="error" class="admin-content">
    <div class="admin-card admin-card-body text-sm text-error-500">
      {{ error instanceof Error ? error.message : "Failed to load users" }}
    </div>
  </div>
  <div v-else class="admin-content space-y-6">
    <AdminBreadcrumbs />
    <AdminPageHeader title="Users" />
    <RecentUsersTable :users="users ?? []" :href="null" />
  </div>
</template>
