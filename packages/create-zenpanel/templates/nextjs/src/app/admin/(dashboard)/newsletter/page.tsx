import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminNewsletter } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Newsletter" };

export default function AdminNewsletterPage() {
  return (
    <ResourcePage
      title="Newsletter"
      resourceLabel="subscriber"
      items={adminNewsletter}
      titleLabel="Email"
      titleIsEmail
      metaLabel="Preferences"
      searchPlaceholder="Search email, source..."
      statusLabels={{ published: "Subscribed", draft: "Pending", archived: "Unsubscribed" }}
    />
  );
}
