import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminBlogPosts } from "@/lib/admin-data/resources";

export default function AdminBlogPage() {
  return (
    <ResourcePage
      title="Blog"
      resourceLabel="post"
      items={adminBlogPosts}
    />
  );
}
