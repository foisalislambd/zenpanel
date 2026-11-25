"use client";

import { ArrowLeft, Compass, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/** In-shell 404 for unknown /admin/* routes (the app-wide one is app/not-found.tsx). */
export default function AdminNotFoundPage() {
  const pathname = usePathname();
  const router = useRouter();

  const body = (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-6 text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        We couldn’t find{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs break-all text-gray-700 dark:bg-white/10 dark:text-gray-200">
          {pathname}
        </code>
        . It may have been moved, or the link is incorrect.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Go back
        </button>
        <Link href="/admin" className="admin-btn admin-btn-primary">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>
      </div>
    </div>
  );

  return <div className="admin-content admin-card px-6 py-16 sm:py-24">{body}</div>;
}
