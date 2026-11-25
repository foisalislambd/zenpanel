import { Compass, Home, LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found · ZenPanel",
};

/** Root 404 - replaces the default Next.js not-found screen. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-gray-50 px-6 py-16 dark:bg-gray-950">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
          <Compass className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-6 text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-white/5"
          >
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
