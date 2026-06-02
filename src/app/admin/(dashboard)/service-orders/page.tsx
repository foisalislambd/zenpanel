import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoServiceOrders } from "@/lib/demo-data/resources";

export default function AdminServiceOrdersPage() {
  return (
    <ResourcePage
      title="Service orders"
      description="Track customer service purchases and fulfillment."
      resourceLabel="order"
      items={demoServiceOrders}
    />
  );
}
