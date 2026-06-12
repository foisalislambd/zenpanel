import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminProducts } from "@/lib/admin-data/resources";

export default function AdminProductsPage() {
  return (
    <ResourcePage
      title="Products"
      description="Digital products, downloads, and storefront items."
      resourceLabel="product"
      items={adminProducts}
    />
  );
}
