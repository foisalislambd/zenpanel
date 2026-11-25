import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminServices } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

export default function AdminServicesPage() {
  return (
    <ResourcePage
      title="Services"
      resourceLabel="service"
      items={adminServices}
      searchPlaceholder="Search title, pricing..."
      metaLabel="Pricing"
      statusLabels={{ published: "Active" }}
    />
  );
}
