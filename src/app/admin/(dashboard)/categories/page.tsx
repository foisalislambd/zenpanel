import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminCategories } from "@/lib/admin-data/resources";

export default function AdminCategoriesPage() {
  return (
    <ResourcePage
      title="Categories"
      description="Organize content with categories and subcategories."
      resourceLabel="category"
      items={adminCategories}
    />
  );
}
