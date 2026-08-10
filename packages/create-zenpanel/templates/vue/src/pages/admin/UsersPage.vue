<script setup lang="ts">
import { onMounted, ref } from "vue";
import AdminUsersPage from "@/components/admin/users/AdminUsersPage.vue";
import AdminLoading from "@/components/admin/ui/AdminLoading.vue";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

const users = ref<PortalUserRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(() => {
  loading.value = true;
  error.value = null;
  previewFetchUsers()
    .then((res) => {
      users.value = res.users;
    })
    .catch((err) => {
      error.value = err instanceof Error ? err.message : "Failed to load users";
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
      {{ error }}
    </div>
  </div>
  <AdminUsersPage v-else :users="users" />
</template>
