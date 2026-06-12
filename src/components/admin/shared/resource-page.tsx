"use client";

import { ResourceList } from "@/components/admin/shared/resource-list";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import type { AdminResource } from "@/lib/admin-data/resources";

type Props = {
  title: string;
  description: string;
  resourceLabel: string;
  items: AdminResource[];
};

export function ResourcePage({ title, description, resourceLabel, items }: Props) {
  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader title={title} description={description} />
      <ResourceList items={items} resourceLabel={resourceLabel} />
    </div>
  );
}
