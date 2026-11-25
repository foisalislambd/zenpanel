import { cn } from "@/lib/cn";
import { Show, type JSX } from "solid-js";

/** Label + control + hint/error. Give the control `aria-describedby={fieldDescribedBy(id, error, hint)}`. */
export function AdminFormField(props: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  class?: string;
  children?: JSX.Element;
}) {
  return (
    <div class={cn("space-y-1.5", props.class)}>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {props.label}
        <Show when={props.required}>
          <span class="ml-0.5 text-error-500" aria-hidden="true">
            *
          </span>
        </Show>
      </label>
      {props.children}
      <Show
        when={props.error}
        fallback={
          <Show when={props.hint}>
            <p id={`${props.id}-hint`} class="text-xs text-gray-500 dark:text-gray-400">
              {props.hint}
            </p>
          </Show>
        }
      >
        <p id={`${props.id}-error`} class="text-sm text-error-500">
          {props.error}
        </p>
      </Show>
    </div>
  );
}
