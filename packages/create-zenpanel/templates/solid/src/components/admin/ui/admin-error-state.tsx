import { AlertTriangle, RotateCw } from "lucide-solid";
import { Show } from "solid-js";

/** Inline error card with a retry action for failed loads. */
export function AdminErrorState(props: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div class="admin-card flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
        <AlertTriangle class="h-6 w-6" aria-hidden />
      </span>
      <h2 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
        {props.title ?? "Something went wrong"}
      </h2>
      <p class="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{props.message}</p>
      <Show when={props.onRetry}>
        <button type="button" class="admin-btn admin-btn-secondary mt-5" onClick={() => props.onRetry?.()}>
          <RotateCw class="h-4 w-4" aria-hidden />
          Try again
        </button>
      </Show>
    </div>
  );
}
