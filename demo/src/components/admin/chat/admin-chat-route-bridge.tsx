import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import { matchAdminNavItem, normalizePathname } from "@/lib/admin-nav";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Sets a default page label for the AI panel based on the current route.
 * Page-specific hooks (e.g. dashboard) own `/admin` and override this.
 */
export function AdminChatRouteBridge() {
  const { pathname } = useLocation();
  const { setPageContext } = useAdminChatPanel();

  useEffect(() => {
    const path = normalizePathname(pathname);

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

    return () => setPageContext(null);
  }, [pathname, setPageContext]);

  return null;
}
