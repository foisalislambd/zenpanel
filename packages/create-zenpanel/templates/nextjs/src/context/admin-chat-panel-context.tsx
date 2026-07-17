"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  isOpen: boolean;
  isDesktop: boolean;
  messages: AdminChatMessage[];
  isGenerating: boolean;
  pageContext: AdminChatPageContext | null;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setPageContext: (ctx: AdminChatPageContext | null) => void;
  addMessage: (msg: Omit<AdminChatMessage, "id">) => string;
  clearMessages: () => void;
  setIsGenerating: (v: boolean) => void;
};

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null);

let messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

export function AdminChatPanelProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageContext, setPageContext] = useState<AdminChatPageContext | null>(null);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen((open) => !open), []);

  const addMessage = useCallback((msg: Omit<AdminChatMessage, "id">) => {
    const id = nextId();
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const value = useMemo(
    () => ({
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
    }),
    [
      isOpen,
      isDesktop,
      messages,
      isGenerating,
      pageContext,
      openPanel,
      closePanel,
      togglePanel,
      addMessage,
      clearMessages,
    ],
  );

  return <ChatPanelContext.Provider value={value}>{children}</ChatPanelContext.Provider>;
}

export function useAdminChatPanel() {
  const ctx = useContext(ChatPanelContext);
  if (!ctx) {
    throw new Error("useAdminChatPanel must be used within AdminChatPanelProvider");
  }
  return ctx;
}
