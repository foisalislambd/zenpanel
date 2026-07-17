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

  useEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    setPageContext({
      pageId: ctx.pageId,
      title: ctx.title,
      description: ctx.description,
      route: ctx.route,
      quickActions: ctx.quickActions,
      getSnapshot: () => ctxRef.current.getSnapshot?.() ?? {},
    });

    return () => setPageContext(null);
  }, [
    ctx.pageId,
    ctx.title,
    ctx.description,
    ctx.route,
    ctx.quickActions,
    setPageContext,
  ]);
}
