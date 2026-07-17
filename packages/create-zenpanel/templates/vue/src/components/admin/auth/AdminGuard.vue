<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuth } from "@/composables/use-admin-auth";
import AdminLoading from "@/components/admin/ui/AdminLoading.vue";

const auth = useAdminAuth();
const router = useRouter();

watch(
  () => auth.admin,
  (admin) => {
    if (!auth.loading && !admin) {
      router.replace("/admin/login");
    }
  },
  { immediate: true },
);
</script>

<template>
  <template v-if="!auth.loading && auth.admin">
    <slot />
  </template>
  <AdminLoading
    v-else
    :message="auth.loading ? 'Loading…' : 'Redirecting to sign in…'"
    full-height
  />
</template>
