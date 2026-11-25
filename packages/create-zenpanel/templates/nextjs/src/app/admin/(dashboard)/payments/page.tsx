import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminPayments } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return (
    <ResourcePage
      title="Payments"
      resourceLabel="payment"
      items={adminPayments}
      searchPlaceholder="Search title, provider, amount..."
      metaLabel="Amount"
      statusLabels={{ published: "Completed", draft: "Pending", archived: "Closed" }}
    />
  );
}
