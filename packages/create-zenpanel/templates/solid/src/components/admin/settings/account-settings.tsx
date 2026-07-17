import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";

export function AccountSettings() {
  const { admin } = useAdminAuth();

  return (
    <div class="admin-card admin-card-body space-y-6">
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Account
        </h3>
        <p class="mt-1 text-sm text-gray-500">Signed-in administrator</p>
      </div>

      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Username
          </dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin()?.username ?? "—"}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin()?.email ?? "—"}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Role
          </dt>
          <dd class="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
            {admin()?.role ?? "—"}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Last login
          </dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {admin()?.lastLoginAt
              ? new Date(admin()!.lastLoginAt!).toLocaleString()
              : "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
