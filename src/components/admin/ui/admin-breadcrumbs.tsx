"use client";

import { adminNavItems } from "@/config/admin.config";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string | null {
  if (pathname === "/admin") return null;

  const sorted = [...adminNavItems].sort((a, b) => b.href.length - a.href.length);

  const match = sorted.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
  );

  return match?.name ?? null;
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  if (!pageTitle) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-md transition hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:hover:text-gray-200"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
        </li>
        <li>
          <span className="font-medium text-gray-700 dark:text-gray-300" aria-current="page">
            {pageTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}
