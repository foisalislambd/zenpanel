import { adminConfig } from "@/config/admin.config";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white">
          {adminConfig.brand.letter}
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {adminConfig.brand.name}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Reusable Next.js admin panel — clone into any project, customize config, and
          connect your API when ready.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Open admin panel
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>
        <p className="mt-10 text-xs text-gray-400">
          Demo: {adminConfig.demo.credentials.username} /{" "}
          {adminConfig.demo.credentials.password}
        </p>
      </div>
    </main>
  );
}
