import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";

export function AccountSettings() {
  const { admin } = useAdminAuth();

  return (
    <div className="admin-card admin-card-body space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Account
        </h3>
        <p className="mt-1 text-sm text-gray-500">Signed-in administrator</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Username
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin?.username ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin?.email ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Role
          </dt>
          <dd className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
            {admin?.role ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Last login
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin?.lastLoginAt
              ? new Date(admin.lastLoginAt).toLocaleString()
              : "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
