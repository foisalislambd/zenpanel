"use client";

import { RecentUsersTable } from "@/components/admin/dashboard/recent-users-table";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
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
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader
        title="Users"
        description="Registered users — connect your API to load accounts."
      />
      <RecentUsersTable users={users} />
    </div>
  );
}
