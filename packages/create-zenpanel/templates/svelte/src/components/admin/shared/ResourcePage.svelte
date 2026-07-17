<script lang="ts">
  import ResourceList from "@/components/admin/shared/ResourceList.svelte";
  import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.svelte";
  import AdminBreadcrumbs from "@/components/admin/ui/AdminBreadcrumbs.svelte";
  import type { AdminResource } from "@/lib/admin-data/resources";

  type Props = {
    title: string;
    resourceLabel: string;
    items: AdminResource[];
  };

  let { title, resourceLabel, items }: Props = $props();
</script>

<div class="admin-content space-y-6">
  <AdminBreadcrumbs />
  <AdminPageHeader {title} />
  <ResourceList {items} {resourceLabel} />
</div>
