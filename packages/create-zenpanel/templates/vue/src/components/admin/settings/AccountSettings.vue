<script setup lang="ts">
import { useAdminAuth } from "@/composables/use-admin-auth";

const auth = useAdminAuth();
</script>

<template>
  <div class="admin-card admin-card-body space-y-6">
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Account</h3>
      <p class="mt-1 text-sm text-gray-500">Signed-in administrator</p>
    </div>

    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Username</dt>
        <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {{ auth.admin?.username ?? "—" }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Email</dt>
        <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {{ auth.admin?.email ?? "—" }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Role</dt>
        <dd class="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
          {{ auth.admin?.role ?? "—" }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">Last login</dt>
        <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {{ auth.admin?.lastLoginAt ? new Date(auth.admin.lastLoginAt).toLocaleString() : "—" }}
        </dd>
      </div>
    </dl>
  </div>
</template>
