import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminServiceOrders } from "@/lib/admin-data/resources";

export default function AdminServiceOrdersPage() {
  return (
    <ResourcePage
      title="Service orders"
      description="Track customer service purchases and fulfillment."
      resourceLabel="order"
      items={adminServiceOrders}
    />
  );
}
