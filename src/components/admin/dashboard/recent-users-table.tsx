"use client";

import type { PortalUserRow } from "@/lib/admin-api";
import Link from "next/link";

const providerStyles: Record<string, string> = {
  email: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  google: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  apple: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  discord: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
};

function ProviderBadge({ provider }: { provider: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        providerStyles[provider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800"
      }`}
    >
      {provider}
    </span>
  );
}

export function RecentUsersTable({ users }: { users: PortalUserRow[] }) {
  return (
    <div className="admin-card w-full overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            Recent users
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Newest sign-ups on your platform
          </p>
        </div>
        <Link
          href="/admin/users"
          className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          View all
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="admin-card-body py-12 text-center text-sm text-gray-500">
          No users yet
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
            {users.map((user) => (
              <li key={user.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">{user.email}</p>
                  </div>
                  <ProviderBadge provider={user.authProvider} />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="admin-scrollbar hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-white/[0.02]">
                  <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Provider
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white/90">
                      {user.name}
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-4 text-gray-600 dark:text-gray-400 lg:max-w-xs">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <ProviderBadge provider={user.authProvider} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
