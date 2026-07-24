import { getDocsNeighbors } from "@/config/docs-nav";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DocsPager() {
  const { pathname } = useLocation();
  const { prev, next } = getDocsNeighbors(pathname);

  if (!prev && !next) return null;

  return (
    <div className="mt-16 grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-2 dark:border-gray-800">
      {prev ? (
        <Link
          to={prev.href}
          className="group flex flex-col rounded-xl border border-gray-200 px-4 py-4 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-gray-800 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </span>
          <span className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.href}
          className="group flex flex-col rounded-xl border border-gray-200 px-4 py-4 text-right transition hover:border-brand-300 hover:bg-brand-50/40 sm:items-end dark:border-gray-800 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  );
}
