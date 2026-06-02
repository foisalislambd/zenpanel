"use client";

import { UiPreviewBanner } from "@/components/admin/shared/ui-preview-banner";
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
      <UiPreviewBanner />
      <ResourceList items={items} resourceLabel={resourceLabel} />
    </div>
  );
}
