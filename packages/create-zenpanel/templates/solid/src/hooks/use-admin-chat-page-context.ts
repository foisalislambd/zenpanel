import {
  useAdminChatPanel,
  type AdminChatPageContext,
} from "@/context/admin-chat-panel-context";
import { onCleanup, onMount } from "solid-js";

/**
 * Register rich page context for the AI panel (editors, dashboard, list pages).
 * Overrides the default route bridge while mounted.
 */
export function useAdminChatPageContext(ctx: AdminChatPageContext) {
  const { setPageContext } = useAdminChatPanel();

  onMount(() => {
    setPageContext(ctx);
    onCleanup(() => setPageContext(null));
  });
}
