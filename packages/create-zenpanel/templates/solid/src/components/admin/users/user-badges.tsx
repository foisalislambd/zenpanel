import type { PortalUserRow } from "@/lib/admin-api";
import { providerStyles } from "@/lib/admin-resources";
import { Show } from "solid-js";

/** Provider + account status + verification badges for a user row. */
export function UserBadges(props: { user: PortalUserRow; provider?: boolean; status?: boolean }) {
  return (
    <>
      <Show when={props.provider ?? true}>
        <span
          class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            providerStyles[props.user.authProvider] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800"
          }`}
        >
          {props.user.authProvider}
        </span>
      </Show>
      <Show when={props.status ?? true}>
        <Show
          when={props.user.status === "active"}
          fallback={
            <span class="inline-flex rounded-full bg-error-50 px-2.5 py-0.5 text-xs font-medium text-[#b42318] dark:bg-error-500/15 dark:text-[#f97066]">
              Banned
            </span>
          }
        >
          <span class="inline-flex rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            Active
          </span>
        </Show>
        <Show when={!props.user.emailVerified}>
          <span class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
            Unverified
          </span>
        </Show>
      </Show>
    </>
  );
}
