import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoPayments } from "@/lib/demo-data/resources";

export default function AdminPaymentsPage() {
  return (
    <ResourcePage
      title="Payments"
      description="Deposits, payment providers, and settlement status."
      resourceLabel="payment"
      items={demoPayments}
    />
  );
}
