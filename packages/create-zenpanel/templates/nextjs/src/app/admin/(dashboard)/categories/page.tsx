import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminCategories } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <ResourcePage
      title="Categories"
      resourceLabel="category"
      items={adminCategories}
      searchPlaceholder="Search title, items..."
      metaLabel="Items"
      statusLabels={{ published: "Visible", draft: "Hidden" }}
    />
  );
}
