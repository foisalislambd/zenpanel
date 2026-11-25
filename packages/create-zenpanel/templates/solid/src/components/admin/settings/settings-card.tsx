import { Show, type JSX } from "solid-js";

/** Two-column settings section; renders a <form> when `onSubmit` is set. */
export function SettingsCard(props: {
  title: string;
  description: string;
  onSubmit?: () => void;
  children?: JSX.Element;
  footer?: JSX.Element;
}) {
  const body = () => (
    <>
      <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,240px)_1fr] md:p-6">
        <div>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">{props.title}</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{props.description}</p>
        </div>
        <div class="min-w-0 space-y-4">{props.children}</div>
      </div>
      <Show when={props.footer}>
        <div class="flex justify-end gap-2 border-t border-gray-200 bg-gray-50/60 px-5 py-3 md:px-6 dark:border-gray-800 dark:bg-white/[0.02]">
          {props.footer}
        </div>
      </Show>
    </>
  );

  return (
    <Show when={props.onSubmit} fallback={<div class="admin-card overflow-hidden">{body()}</div>}>
      <form
        novalidate
        class="admin-card overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit?.();
        }}
      >
        {body()}
      </form>
    </Show>
  );
}
