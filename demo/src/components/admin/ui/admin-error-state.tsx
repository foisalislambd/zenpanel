import { AlertTriangle, RotateCw } from "lucide-react";

type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

/** Inline error card with a retry action for failed loads. */
export function AdminErrorState({ title = "Something went wrong", message, onRetry }: Props) {
  return (
    <div className="admin-card flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="admin-btn admin-btn-secondary mt-5">
          <RotateCw className="h-4 w-4" aria-hidden />
          Try again
        </button>
      )}
    </div>
  );
}
