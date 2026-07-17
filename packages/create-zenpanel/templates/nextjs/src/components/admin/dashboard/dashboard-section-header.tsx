import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
  trailing?: ReactNode;
};

export function DashboardSectionHeader({
  title,
  href,
  linkLabel = "View all",
  trailing,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      {trailing}
      {href && !trailing && (
        <Link
          href={href}
          className="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
