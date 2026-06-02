import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoBlogPosts } from "@/lib/demo-data/resources";

export default function AdminBlogPage() {
  return (
    <ResourcePage
      title="Blog"
      description="Publish and manage blog posts."
      resourceLabel="post"
      items={demoBlogPosts}
    />
  );
}
