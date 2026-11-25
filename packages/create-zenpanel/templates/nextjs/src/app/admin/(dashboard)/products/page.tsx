import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminProducts } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <ResourcePage
      title="Products"
      resourceLabel="product"
      items={adminProducts}
      searchPlaceholder="Search title, price..."
      metaLabel="Price"
      statusLabels={{ published: "Active" }}
    />
  );
}
