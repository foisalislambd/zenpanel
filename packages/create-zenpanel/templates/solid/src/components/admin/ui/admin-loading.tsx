type Props = {
  message?: string;
  class?: string;
  fullHeight?: boolean;
};

export function AdminLoading(props: Props) {
  const message = () => props.message ?? "Loading…";

  return (
    <div
      class={`flex items-center justify-center ${props.fullHeight ? "h-dvh w-full" : "min-h-[50vh]"} ${props.class ?? ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          aria-hidden
        />
        <p class="text-sm text-gray-500 dark:text-gray-400">{message()}</p>
      </div>
    </div>
  );
}
