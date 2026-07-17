"use client";

import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import { matchAdminNavItem } from "@/lib/admin-nav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets a default page label for the AI panel based on the current route.
 * Page-specific hooks (e.g. dashboard) own `/admin` and override this.
 */
export function AdminChatRouteBridge() {
  const pathname = usePathname();
  const { setPageContext } = useAdminChatPanel();

  useEffect(() => {
    // Dashboard registers rich context via useAdminChatPageContext — do not overwrite it.
    if (pathname === "/admin") {
      return;
    }

    const nav = matchAdminNavItem(pathname);

    setPageContext({
      pageId: pathname,
      title: nav?.name ?? "Admin",
      description:
        nav?.description ??
        `Ask me anything about ${nav?.name ?? "this page"} — analyze data, get suggestions, or plan your next steps.`,
      route: pathname,
      getSnapshot: () => ({ route: pathname }),
    });

    return () => setPageContext(null);
  }, [pathname, setPageContext]);

  return null;
}
