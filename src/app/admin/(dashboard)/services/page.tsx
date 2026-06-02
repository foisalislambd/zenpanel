import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoServices } from "@/lib/demo-data/resources";

export default function AdminServicesPage() {
  return (
    <ResourcePage
      title="Services"
      description="Manage service offerings and pricing."
      resourceLabel="service"
      items={demoServices}
    />
  );
}
