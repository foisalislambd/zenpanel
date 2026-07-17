import { getContext } from "svelte";
import {
  ADMIN_CHAT_PANEL_KEY,
  type AdminChatPageContext,
  type AdminChatPanelContext,
} from "@/context/admin-chat-panel-context.svelte";

/** Register rich page context for the AI panel while a component is mounted. */
export function registerAdminChatPageContext(getCtx: () => AdminChatPageContext) {
  const panel = getContext<AdminChatPanelContext>(ADMIN_CHAT_PANEL_KEY);
  if (!panel) {
    throw new Error("registerAdminChatPageContext must be used within AdminChatPanelProvider");
  }

  $effect(() => {
    panel.setPageContext(getCtx());
    return () => panel.setPageContext(null);
  });
}
