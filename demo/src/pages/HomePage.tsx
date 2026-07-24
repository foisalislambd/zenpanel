import { adminConfig } from "@/config/admin.config";
import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { ArrowRight, BookOpen, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#dde9ff_0%,_transparent_55%),linear-gradient(180deg,#f7f8fb_0%,#eef1f7_100%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(70,95,255,0.18)_0%,_transparent_50%),linear-gradient(180deg,#0b1220_0%,#101828_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(16,24,40,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.04)_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-20 dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm shadow-brand-500/30">
            {adminConfig.brand.letter}
          </span>
          <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
            {adminConfig.brand.name}
          </span>
        </div>
        <AdminThemeToggle />
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium tracking-wide text-brand-600 dark:text-brand-300">
            Open-source admin UI shell
          </p>
          <h1 className="mt-4 font-admin-sans text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            {adminConfig.brand.name}
          </h1>
          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg dark:text-gray-400">
            Same polished dashboard across every major framework. Read the
            guides, then explore the live admin preview.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/docs"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 sm:w-auto"
            >
              <BookOpen className="h-4 w-4" />
              Docs
              <ArrowRight className="h-4 w-4 opacity-80" />
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/80 px-6 text-sm font-semibold text-gray-800 backdrop-blur transition hover:border-gray-400 hover:bg-white sm:w-auto dark:border-gray-700 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            Demo login: <span className="font-mono text-gray-700 dark:text-gray-300">admin</span>{" "}
            / <span className="font-mono text-gray-700 dark:text-gray-300">admin</span>
          </p>
        </div>
      </div>
    </main>
  );
}
