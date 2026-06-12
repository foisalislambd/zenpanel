import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminPayments } from "@/lib/admin-data/resources";

export default function AdminPaymentsPage() {
  return (
    <ResourcePage
      title="Payments"
      description="Deposits, payment providers, and settlement status."
      resourceLabel="payment"
      items={adminPayments}
    />
  );
}
