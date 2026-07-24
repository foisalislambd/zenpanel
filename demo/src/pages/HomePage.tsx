import { adminConfig } from "@/config/admin.config";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white">
          {adminConfig.brand.letter}
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {adminConfig.brand.name}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Admin panel shell for React + Vite projects.
        </p>
        <Link
          to="/admin/login"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Admin sign in
        </Link>
      </div>
    </main>
  );
}
