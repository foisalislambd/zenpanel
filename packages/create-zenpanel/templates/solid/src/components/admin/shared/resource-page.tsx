import { ResourceList } from "@/components/admin/shared/resource-list";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import type { AdminResource } from "@/lib/admin-data/resources";

type Props = {
  title: string;
  resourceLabel: string;
  items: AdminResource[];
};

export function ResourcePage(props: Props) {
  return (
    <div class="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader title={props.title} />
      <ResourceList items={props.items} resourceLabel={props.resourceLabel} />
    </div>
  );
}
