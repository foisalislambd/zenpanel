"use client";

import { matchAdminNavItem } from "@/lib/admin-nav";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, actions }: Props) {
  const pathname = usePathname();
  const nav = matchAdminNavItem(pathname);
  const section = nav?.section;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="mb-1.5">
          <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/admin" className="rounded hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </Link>
            </li>
            {section && section !== "Overview" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                <li>{section}</li>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <li aria-current="page" className="text-gray-700 dark:text-gray-200">
              {title}
            </li>
          </ol>
        </nav>
        <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
