import { onUnmounted, watch, type WatchSource } from "vue";
import {
  AdminChatPanelKey,
  type AdminChatPageContext,
  type AdminChatPanelContext,
} from "@/composables/use-admin-chat-panel";
import { inject } from "vue";

/** Register rich page context for the AI panel while a component is mounted. */
export function useAdminChatPageContext(getCtx: WatchSource<AdminChatPageContext>) {
  const panel = inject<AdminChatPanelContext>(AdminChatPanelKey);
  if (!panel) {
    throw new Error("useAdminChatPageContext must be used within AdminChatPanelProvider");
  }

  const stop = watch(
    getCtx,
    (ctx) => {
      panel.setPageContext(ctx);
    },
    { immediate: true, deep: true },
  );

  onUnmounted(() => {
    stop();
    panel.setPageContext(null);
  });
}
