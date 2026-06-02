"use client";

import { DemoModeBanner } from "@/components/admin/shared/demo-mode-banner";
import { ResourceList } from "@/components/admin/shared/resource-list";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import type { DemoResource } from "@/lib/demo-data/resources";

type Props = {
  title: string;
  description: string;
  resourceLabel: string;
  items: DemoResource[];
};

export function ResourcePage({ title, description, resourceLabel, items }: Props) {
  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader title={title} description={description} />
      <DemoModeBanner />
      <ResourceList
        items={items}
        resourceLabel={resourceLabel}
        onAdd={() => {
          /* Wire to your create route when integrating API */
        }}
      />
    </div>
  );
}
