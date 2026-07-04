"use client";

import { adminNavItems } from "@/config/admin.config";
import { useAdminChatPanel } from "@/context/admin-chat-panel-context";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets a default page label for the AI panel based on the current route.
 * Page-specific hooks override this on mount.
 */
export function AdminChatRouteBridge() {
  const pathname = usePathname();
  const { setPageContext } = useAdminChatPanel();

  useEffect(() => {
    if (pathname === "/admin") {
      setPageContext({
        pageId: "dashboard-loading",
        title: "Dashboard",
        description: "Loading dashboard metrics…",
        route: pathname,
        getSnapshot: () => ({ route: pathname }),
      });
      return () => setPageContext(null);
    }

    const sorted = [...adminNavItems].sort((a, b) => b.href.length - a.href.length);
    const nav = sorted.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href),
    );

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
