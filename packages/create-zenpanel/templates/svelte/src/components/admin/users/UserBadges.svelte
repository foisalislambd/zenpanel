<script lang="ts">
  import type { PortalUserRow } from "@/lib/admin-api";
  import { providerStyles } from "@/lib/admin-resources";

  /** Provider + account status + verification badges for a user row. */
  type Props = { user: PortalUserRow; provider?: boolean; status?: boolean };
  let { user, provider = true, status = true }: Props = $props();
</script>

{#if provider}
  <span
    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {providerStyles[user.authProvider] ??
      'bg-gray-100 text-gray-600 dark:bg-gray-800'}"
  >
    {user.authProvider}
  </span>
{/if}
{#if status}
  {#if user.status === "active"}
    <span class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
      Active
    </span>
  {:else}
    <span class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]">
      Banned
    </span>
  {/if}
  {#if !user.emailVerified}
    <span class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
      Unverified
    </span>
  {/if}
{/if}
