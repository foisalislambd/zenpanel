"use client";

import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { adminConfig } from "@/config/admin.config";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white";

export function AdminLoginForm() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { username: previewUser, email: previewEmail, password: previewPass } =
    adminConfig.previewLogin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username.trim().toLowerCase(), password);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function fillPreview() {
    setUsername(previewUser);
    setPassword(previewPass);
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-16">
      <div className="mx-auto w-full max-w-[400px]">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back
        </Link>

        <div className="mt-8 lg:mt-10">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-base font-bold text-white lg:hidden">
            {adminConfig.brand.letter}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Preview the admin shell — mock login only, nothing is sent to a server.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50/80 px-4 py-3 dark:border-violet-500/30 dark:bg-violet-500/10">
          <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
            UI kit login
          </p>
          <p className="mt-1 text-xs leading-relaxed text-violet-700/90 dark:text-violet-400/90">
            <span className="font-mono">{previewUser}</span> or{" "}
            <span className="font-mono">{previewEmail}</span> ·{" "}
            <span className="font-mono">{previewPass}</span>
          </p>
          <button
            type="button"
            onClick={fillPreview}
            className="mt-3 text-xs font-semibold text-violet-600 underline-offset-2 hover:underline dark:text-violet-400"
          >
            Fill preview credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/10 dark:text-error-400"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-username"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username or email
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-username"
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !username.trim() || !password}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:ring-2 focus:ring-brand-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Opening preview…" : "Enter admin UI"}
          </button>
        </form>
      </div>
    </div>
  );
}
