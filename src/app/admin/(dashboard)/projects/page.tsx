import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminProjects } from "@/lib/admin-data/resources";

export default function AdminProjectsPage() {
  return (
    <ResourcePage
      title="Projects"
      description="Manage portfolio projects and case studies."
      resourceLabel="project"
      items={adminProjects}
    />
  );
}
