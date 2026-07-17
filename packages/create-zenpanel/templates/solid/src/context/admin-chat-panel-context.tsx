import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";

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

type ChatPanelContextValue = {
  isOpen: Accessor<boolean>;
  isDesktop: Accessor<boolean>;
  messages: Accessor<AdminChatMessage[]>;
  isGenerating: Accessor<boolean>;
  pageContext: Accessor<AdminChatPageContext | null>;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setPageContext: (ctx: AdminChatPageContext | null) => void;
  addMessage: (msg: Omit<AdminChatMessage, "id">) => string;
  clearMessages: () => void;
  setIsGenerating: (v: boolean) => void;
};

const ChatPanelContext = createContext<ChatPanelContextValue>();

let messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

export function AdminChatPanelProvider(props: { children: JSX.Element }) {
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = createSignal(false);
  const [messages, setMessages] = createSignal<AdminChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = createSignal(false);
  const [pageContext, setPageContext] = createSignal<AdminChatPageContext | null>(null);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((open) => !open);

  const addMessage = (msg: Omit<AdminChatMessage, "id">) => {
    const id = nextId();
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  };

  const clearMessages = () => setMessages([]);

  const value: ChatPanelContextValue = {
    isOpen,
    isDesktop,
    messages,
    isGenerating,
    pageContext,
    openPanel,
    closePanel,
    togglePanel,
    setPageContext,
    addMessage,
    clearMessages,
    setIsGenerating,
  };

  return <ChatPanelContext.Provider value={value}>{props.children}</ChatPanelContext.Provider>;
}

export function useAdminChatPanel() {
  const ctx = useContext(ChatPanelContext);
  if (!ctx) {
    throw new Error("useAdminChatPanel must be used within AdminChatPanelProvider");
  }
  return ctx;
}
