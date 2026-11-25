import { ResourcePage } from "@/components/admin/shared/resource-page";
import { adminProjects } from "@/lib/admin-data/resources";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default function AdminProjectsPage() {
  return (
    <ResourcePage
      title="Projects"
      resourceLabel="project"
      items={adminProjects}
      searchPlaceholder="Search title, details..."
    />
  );
}
