import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminNewsletter } from "@/lib/admin-data/resources";

export default function AdminNewsletterPage() {
  return (
    <ResourcePage
      title="Newsletter"
      resourceLabel="subscriber"
      items={adminNewsletter}
      searchPlaceholder="Search email, source..."
      titleLabel="Email"
      metaLabel="Preferences"
      titleIsEmail
      statusLabels={{ published: "Subscribed", draft: "Pending", archived: "Unsubscribed" }}
    />
  );
}
