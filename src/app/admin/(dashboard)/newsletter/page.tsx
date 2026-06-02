import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoNewsletter } from "@/lib/demo-data/resources";

export default function AdminNewsletterPage() {
  return (
    <ResourcePage
      title="Newsletter"
      description="Subscriber list and email campaign audience."
      resourceLabel="subscriber"
      items={demoNewsletter}
    />
  );
}
