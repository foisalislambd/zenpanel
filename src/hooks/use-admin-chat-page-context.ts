"use client";

import {
  useAdminChatPanel,
  type AdminChatPageContext,
} from "@/context/admin-chat-panel-context";
import { useEffect, useRef } from "react";

/**
 * Register rich page context for the AI panel (editors, dashboard, list pages).
 * Overrides the default route bridge while mounted.
 */
export function useAdminChatPageContext(ctx: AdminChatPageContext) {
  const { setPageContext } = useAdminChatPanel();
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    setPageContext({
      pageId: ctxRef.current.pageId,
      title: ctxRef.current.title,
      description: ctxRef.current.description,
      route: ctxRef.current.route,
      quickActions: ctxRef.current.quickActions,
      getSnapshot: () => ctxRef.current.getSnapshot?.() ?? {},
    });

    return () => setPageContext(null);
  }, [ctx.pageId, ctx.title, ctx.description, ctx.route, setPageContext]);
}
