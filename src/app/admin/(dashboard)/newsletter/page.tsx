import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminNewsletter } from "@/lib/admin-data/resources";

export default function AdminNewsletterPage() {
  return (
    <ResourcePage
      title="Newsletter"
      description="Subscriber list and email campaign audience."
      resourceLabel="subscriber"
      items={adminNewsletter}
    />
  );
}
