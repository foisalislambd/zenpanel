import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminTransactions } from "@/lib/admin-data/resources";

export default function AdminTransactionsPage() {
  return (
    <ResourcePage
      title="Transactions"
      description="Wallet credits, debits, and ledger activity."
      resourceLabel="transaction"
      items={adminTransactions}
    />
  );
}
