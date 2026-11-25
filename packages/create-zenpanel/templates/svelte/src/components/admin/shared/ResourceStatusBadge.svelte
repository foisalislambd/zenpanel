<script lang="ts">
  import type { AdminResourceStatus } from "@/lib/admin-data/resources";
  import { resourceStatusStyles } from "@/lib/admin-resources";

  type Props = { status: AdminResourceStatus; label: string };
  let { status, label }: Props = $props();
</script>

<span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap {resourceStatusStyles[status]}">
  {label}
</span>
