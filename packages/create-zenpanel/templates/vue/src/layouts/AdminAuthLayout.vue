<script setup lang="ts">
import AdminGuestGuard from "@/components/admin/auth/AdminGuestGuard.vue";
</script>

<template>
  <AdminGuestGuard>
    <div class="relative isolate min-h-dvh w-full overflow-x-hidden bg-white dark:bg-gray-950">
      <RouterView />
    </div>
  </AdminGuestGuard>
</template>
