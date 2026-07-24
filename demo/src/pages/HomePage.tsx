import { adminConfig } from "@/config/admin.config";
import { AdminThemeToggle } from "@/components/admin/ui/admin-theme-toggle";
import { ArrowRight, BookOpen, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const GITHUB_URL = "https://github.com/foisalislambd/zenpanel";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.586 2 12.253c0 4.537 2.865 8.387 6.839 9.747.5.095.683-.222.683-.48 0-.237-.009-.866-.013-1.7-2.782.618-3.369-1.38-3.369-1.38-.455-1.184-1.11-1.5-1.11-1.5-.908-.636.069-.623.069-.623 1.004.072 1.532 1.06 1.532 1.06.892 1.568 2.341 1.115 2.91.853.091-.662.35-1.115.636-1.372-2.22-.259-4.555-1.143-4.555-5.087 0-1.124.39-2.043 1.029-2.764-.103-.26-.446-1.302.098-2.713 0 0 .84-.276 2.75 1.055A9.304 9.304 0 0 1 12 6.912a9.3 9.3 0 0 1 2.504.346c1.909-1.331 2.747-1.055 2.747-1.055.546 1.411.203 2.453.1 2.713.64.721 1.028 1.64 1.028 2.764 0 3.953-2.338 4.825-4.566 5.079.359.317.679.943.679 1.901 0 1.372-.012 2.477-.012 2.813 0 .26.18.58.688.48A10.215 10.215 0 0 0 22 12.253C22 6.586 17.523 2 12 2Z" />
    </svg>
  );
}

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
        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
            aria-label="ZenPanel on GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <AdminThemeToggle />
        </div>
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

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
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
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/80 px-6 text-sm font-semibold text-gray-800 backdrop-blur transition hover:border-gray-400 hover:bg-white sm:w-auto dark:border-gray-700 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
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
