import { inject, provide, ref, type InjectionKey } from "vue";
import { useIsDesktop } from "@/composables/use-is-desktop";

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

export type AdminChatPanelContext = {
  isOpen: boolean;
  isDesktop: boolean;
  messages: AdminChatMessage[];
  isGenerating: boolean;
  pageContext: AdminChatPageContext | null;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setPageContext: (next: AdminChatPageContext | null) => void;
  addMessage: (msg: Omit<AdminChatMessage, "id">) => string;
  clearMessages: () => void;
  setIsGenerating: (value: boolean) => void;
};

export const AdminChatPanelKey: InjectionKey<AdminChatPanelContext> = Symbol("admin-chat-panel");

let messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

export function provideAdminChatPanel() {
  const isDesktop = useIsDesktop();
  const isOpen = ref(false);
  const messages = ref<AdminChatMessage[]>([]);
  const isGenerating = ref(false);
  const pageContext = ref<AdminChatPageContext | null>(null);

  const ctx: AdminChatPanelContext = {
    get isOpen() {
      return isOpen.value;
    },
    get isDesktop() {
      return isDesktop.value;
    },
    get messages() {
      return messages.value;
    },
    get isGenerating() {
      return isGenerating.value;
    },
    get pageContext() {
      return pageContext.value;
    },
    openPanel() {
      isOpen.value = true;
    },
    closePanel() {
      isOpen.value = false;
    },
    togglePanel() {
      isOpen.value = !isOpen.value;
    },
    setPageContext(next: AdminChatPageContext | null) {
      pageContext.value = next;
    },
    addMessage(msg: Omit<AdminChatMessage, "id">) {
      const id = nextId();
      messages.value = [...messages.value, { ...msg, id }];
      return id;
    },
    clearMessages() {
      messages.value = [];
    },
    setIsGenerating(value: boolean) {
      isGenerating.value = value;
    },
  };

  provide(AdminChatPanelKey, ctx);
  return ctx;
}

export function useAdminChatPanel() {
  const ctx = inject(AdminChatPanelKey);
  if (!ctx) {
    throw new Error("useAdminChatPanel must be used within AdminChatPanelProvider");
  }
  return ctx;
}
