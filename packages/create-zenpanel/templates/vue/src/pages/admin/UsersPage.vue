<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AdminUsersPage from "@/components/admin/users/AdminUsersPage.vue";
import AdminErrorState from "@/components/admin/ui/AdminErrorState.vue";
import AdminTableSkeleton from "@/components/admin/ui/AdminTableSkeleton.vue";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";

const users = ref<PortalUserRow[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const attempt = ref(0);

watchEffect((onCleanup) => {
  void attempt.value;
  let cancelled = false;
  onCleanup(() => (cancelled = true));
  loading.value = true;
  error.value = null;
  previewFetchUsers()
    .then((res) => {
      if (!cancelled) users.value = res.users;
    })
    .catch((err) => {
      if (!cancelled) error.value = err instanceof Error ? err.message : "Failed to load users";
    })
    .finally(() => {
      if (!cancelled) loading.value = false;
    });
});
</script>

<template>
  <AdminTableSkeleton v-if="loading" label="Loading users…" />
  <div v-else-if="error" class="admin-content">
    <AdminErrorState title="Couldn't load users" :message="error" @retry="attempt++" />
  </div>
  <AdminUsersPage v-else :users="users" />
</template>
