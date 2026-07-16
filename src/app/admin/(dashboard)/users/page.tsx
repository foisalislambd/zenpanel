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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    previewFetchUsers()
      .then((res) => setUsers(res.users))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load users");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AdminLoading message="Loading users…" />;
  }

  if (error) {
    return (
      <div className="admin-content">
        <div className="admin-card admin-card-body text-sm text-error-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-content space-y-6">
      <AdminBreadcrumbs />
      <AdminPageHeader title="Users" />
      <RecentUsersTable users={users} />
    </div>
  );
}
