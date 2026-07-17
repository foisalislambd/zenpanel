import { A } from "@solidjs/router";
import { Show, type JSX } from "solid-js";

type Props = {
  title: string;
  href?: string;
  linkLabel?: string;
  trailing?: JSX.Element;
};

export function DashboardSectionHeader(props: Props) {
  const linkLabel = () => props.linkLabel ?? "View all";

  return (
    <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{props.title}</h3>
      {props.trailing}
      <Show when={props.href && !props.trailing}>
        <A
          href={props.href!}
          class="text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {linkLabel()}
        </A>
      </Show>
    </div>
  );
}
