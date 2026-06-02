import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoTransactions } from "@/lib/demo-data/resources";

export default function AdminTransactionsPage() {
  return (
    <ResourcePage
      title="Transactions"
      description="Wallet credits, debits, and ledger activity."
      resourceLabel="transaction"
      items={demoTransactions}
    />
  );
}
