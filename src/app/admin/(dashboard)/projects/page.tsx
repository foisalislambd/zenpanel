import { ResourcePage } from "@/components/admin/shared/resource-page";
import { demoProjects } from "@/lib/demo-data/resources";

export default function AdminProjectsPage() {
  return (
    <ResourcePage
      title="Projects"
      description="Manage portfolio projects and case studies."
      resourceLabel="project"
      items={demoProjects}
    />
  );
}
