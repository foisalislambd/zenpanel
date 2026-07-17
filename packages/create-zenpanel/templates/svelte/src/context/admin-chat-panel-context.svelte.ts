import { getContext, setContext } from "svelte";
import { createIsDesktop } from "@/hooks/use-is-desktop.svelte";

export const CHAT_PANEL_WIDTH = 400;

export type AdminChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AdminChatQuickAction = {
  id: string;
  label: string;
  prompt: string;
};

export type AdminChatPageContext = {
  pageId: string;
  title: string;
  description?: string;
  route?: string;
  getSnapshot?: () => Record<string, unknown>;
  quickActions?: AdminChatQuickAction[];
};

export const ADMIN_CHAT_PANEL_KEY = Symbol("admin-chat-panel");

export type AdminChatPanelContext = ReturnType<typeof createAdminChatPanel>;

let messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

export function createAdminChatPanel() {
  const isDesktop = createIsDesktop();
  let isOpen = $state(false);
  let messages = $state<AdminChatMessage[]>([]);
  let isGenerating = $state(false);
  let pageContext = $state<AdminChatPageContext | null>(null);

  const ctx = {
    get isOpen() {
      return isOpen;
    },
    get isDesktop() {
      return isDesktop.current;
    },
    get messages() {
      return messages;
    },
    get isGenerating() {
      return isGenerating;
    },
    get pageContext() {
      return pageContext;
    },
    openPanel() {
      isOpen = true;
    },
    closePanel() {
      isOpen = false;
    },
    togglePanel() {
      isOpen = !isOpen;
    },
    setPageContext(next: AdminChatPageContext | null) {
      pageContext = next;
    },
    addMessage(msg: Omit<AdminChatMessage, "id">) {
      const id = nextId();
      messages = [...messages, { ...msg, id }];
      return id;
    },
    clearMessages() {
      messages = [];
    },
    setIsGenerating(value: boolean) {
      isGenerating = value;
    },
  };

  setContext(ADMIN_CHAT_PANEL_KEY, ctx);
  return ctx;
}

export function useAdminChatPanel() {
  const ctx = getContext<AdminChatPanelContext>(ADMIN_CHAT_PANEL_KEY);
  if (!ctx) {
    throw new Error("useAdminChatPanel must be used within AdminChatPanelProvider");
  }
  return ctx;
}
