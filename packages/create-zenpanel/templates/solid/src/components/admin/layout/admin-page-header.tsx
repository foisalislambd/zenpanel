import { matchAdminNavItem } from "@/lib/admin-nav";
import { A, useLocation } from "@solidjs/router";
import { ChevronRight } from "lucide-solid";
import { Show, type JSX } from "solid-js";

type Props = {
  title: string;
  actions?: JSX.Element;
};

/** Page title with breadcrumbs (Dashboard › Section › Page) and optional actions. */
export function AdminPageHeader(props: Props) {
  const location = useLocation();
  const section = () => matchAdminNavItem(location.pathname)?.section;

  return (
    <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" class="mb-1.5">
          <ol class="flex flex-wrap items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <li>
              <A href="/admin" end class="rounded hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </A>
            </li>
            <Show when={section() && section() !== "Overview"}>
              <ChevronRight class="h-3.5 w-3.5 opacity-60" aria-hidden />
              <li>{section()}</li>
            </Show>
            <ChevronRight class="h-3.5 w-3.5 opacity-60" aria-hidden />
            <li aria-current="page" class="text-gray-700 dark:text-gray-200">
              {props.title}
            </li>
          </ol>
        </nav>
        <h1 class="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {props.title}
        </h1>
      </div>
      <Show when={props.actions}>
        <div class="flex shrink-0 flex-wrap items-center gap-2">{props.actions}</div>
      </Show>
    </div>
  );
}
