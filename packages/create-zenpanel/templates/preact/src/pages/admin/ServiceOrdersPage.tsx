import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminServiceOrders } from "@/lib/admin-data/resources";

export default function AdminServiceOrdersPage() {
  return (
    <ResourcePage
      title="Service orders"
      resourceLabel="order"
      items={adminServiceOrders}
      titleLabel="Order"
      metaLabel="Amount"
      searchPlaceholder="Search customer, service, order ID..."
      statusLabels={{ published: "Completed", draft: "Pending", archived: "Refunded" }}
    />
  );
}
