import { AdminUsersPage } from "@/components/admin/users/admin-users-page";
import { AdminErrorState } from "@/components/admin/ui/admin-error-state";
import { AdminTableSkeleton } from "@/components/admin/ui/admin-skeleton";
import { previewFetchUsers, type PortalUserRow } from "@/lib/admin-api";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<PortalUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    previewFetchUsers()
      .then((res) => {
        if (!cancelled) setUsers(res.users);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (loading) {
    return <AdminTableSkeleton label="Loading users…" />;
  }

  if (error) {
    return (
      <div className="admin-content">
        <AdminErrorState
          title="Couldn't load users"
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            setAttempt((n) => n + 1);
          }}
        />
      </div>
    );
  }

  return <AdminUsersPage users={users} />;
}
