import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminCategories } from "@/lib/admin-data/resources";

export default function AdminCategoriesPage() {
  return (
    <ResourcePage
      title="Categories"
      resourceLabel="category"
      items={adminCategories}
    />
  );
}
