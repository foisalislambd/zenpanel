"use client";

import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/ui/admin-breadcrumbs";
import { AdminLoading } from "@/components/admin/ui/admin-loading";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PortalUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    previewFetchUsers()
      .then((res) => setUsers(res.users))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AdminLoading message="Loading users…" />;
  }

  return (
    <div className="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader
        title="Users"
        description="Registered users — connect your API to load and manage accounts."
      />
      <RecentUsersTable users={users} />
    </div>
  );
}
