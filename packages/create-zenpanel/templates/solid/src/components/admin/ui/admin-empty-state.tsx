import type { LucideIcon } from "lucide-solid";
import type { JSX } from "solid-js";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: JSX.Element;
};

export function AdminEmptyState(props: Props) {
  return (
    <div class="flex flex-col items-center px-6 py-16 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
        <props.icon class="h-7 w-7 text-gray-400 dark:text-gray-500" aria-hidden />
      </div>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">{props.title}</h3>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {props.description}
      </p>
      {props.action && <div class="mt-6">{props.action}</div>}
    </div>
  );
}
