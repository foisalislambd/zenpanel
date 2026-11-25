<script setup lang="ts">
import type { PortalUserRow } from "@/lib/admin-api";
import { providerStyles } from "@/lib/admin-resources";

/** Provider + account status + verification badges for a user row. */
withDefaults(defineProps<{ user: PortalUserRow; provider?: boolean; status?: boolean }>(), { provider: true, status: true });
</script>

<template>
  <span
    v-if="provider"
    :class="[
      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
      providerStyles[user.authProvider] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800',
    ]"
  >
    {{ user.authProvider }}
  </span>
  <template v-if="status">
  <span
    v-if="user.status === 'active'"
    class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
  >
    Active
  </span>
  <span
    v-else
    class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]"
  >
    Banned
  </span>
  <span
    v-if="!user.emailVerified"
    class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
  >
    Unverified
  </span>
  </template>
</template>
