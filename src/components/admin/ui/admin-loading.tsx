type Props = {
  message?: string;
  className?: string;
  fullHeight?: boolean;
};

export function AdminLoading({
  message = "Loading…",
  className = "",
  fullHeight = false,
}: Props) {
  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? "h-dvh w-full" : "min-h-[50vh]"} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
