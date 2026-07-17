<script lang="ts">
  import type { Snippet } from "svelte";
  import AdminGuestGuard from "@/components/admin/auth/AdminGuestGuard.svelte";

  type Props = { children?: Snippet };
  let { children }: Props = $props();
</script>

<AdminGuestGuard>
  <div class="relative isolate min-h-dvh w-full overflow-x-hidden bg-white dark:bg-gray-950">
    {@render children?.()}
  </div>
</AdminGuestGuard>
