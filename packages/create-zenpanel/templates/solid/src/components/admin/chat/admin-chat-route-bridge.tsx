import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";
import { useLocation } from "@solidjs/router";
import { createEffect, onCleanup } from "solid-js";

/**
 * Sets a default page label for the AI panel based on the current route.
 * Page-specific hooks (e.g. dashboard) own `/admin` and override this.
 */
export function AdminChatRouteBridge() {
  const location = useLocation();
  const { setPageContext } = useAdminChatPanel();

  createEffect(() => {
    const path = normalizePathname(location.pathname);

    // Dashboard registers rich context via useAdminChatPageContext — do not overwrite it.
    if (path === "/admin") {
      return;
    }

    const nav = matchAdminNavItem(path);

    setPageContext({
      pageId: path,
      title: nav?.name ?? "Admin",
      description:
        nav?.description ??
        `Ask me anything about ${nav?.name ?? "this page"} — analyze data, get suggestions, or plan your next steps.`,
      route: path,
      getSnapshot: () => ({ route: path }),
    });

    onCleanup(() => setPageContext(null));
  });

  return null;
}
