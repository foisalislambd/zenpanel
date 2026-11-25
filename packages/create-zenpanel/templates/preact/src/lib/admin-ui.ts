/** Shared class strings and helpers for admin form controls. */
export const adminInputClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:disabled:bg-white/5";

export const adminInputErrorClass =
  "border-error-500 focus:border-error-500 focus:ring-error-500/20 dark:border-error-500";

export function fieldDescribedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
