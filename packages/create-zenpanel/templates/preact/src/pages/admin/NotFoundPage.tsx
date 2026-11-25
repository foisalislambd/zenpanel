import { useDocumentTitle } from "@/hooks/use-document-title";
import { ArrowLeft, Compass, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type Props = {
  /** Inside the admin shell the card is shown in the content area. */
  variant?: "admin" | "page";
};

export default function NotFoundPage({ variant = "page" }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useDocumentTitle("Page not found");
  const inAdmin = variant === "admin";

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
        <button type="button" onClick={() => navigate(-1)} className="admin-btn admin-btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Go back
        </button>
        <Link to={inAdmin ? "/admin" : "/"} className="admin-btn admin-btn-primary">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          {inAdmin ? "Back to dashboard" : "Back to home"}
        </Link>
      </div>
    </div>
  );

  if (inAdmin) {
    return <div className="admin-content admin-card px-6 py-16 sm:py-24">{body}</div>;
  }

  return (
    <main className="admin-shell flex min-h-dvh items-center justify-center px-6 py-16 dark:bg-gray-950">
      {body}
    </main>
  );
}
