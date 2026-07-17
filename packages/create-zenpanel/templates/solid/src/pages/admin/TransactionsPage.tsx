import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminTransactions } from "@/lib/admin-data/resources";

export default function AdminTransactionsPage() {
  return <ResourcePage title="Transactions" resourceLabel="transaction" items={adminTransactions} />;
}
