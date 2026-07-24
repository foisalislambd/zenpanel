import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminServices } from "@/lib/admin-data/resources";

export default function AdminServicesPage() {
  return (
    <ResourcePage
      title="Services"
      resourceLabel="service"
      items={adminServices}
    />
  );
}
