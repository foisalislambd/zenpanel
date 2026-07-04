"use client";

import { adminConfig } from "@/config/admin.config";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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

const DESKTOP_BREAKPOINT = 1024;
const STORAGE_KEY = adminConfig.storageKeys.chatPanelOpen;

function subscribeDesktop(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getDesktopSnapshot() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function getServerDesktopSnapshot() {
  return false;
}

let messageSeq = 0;
function nextId() {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

export function AdminChatPanelProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageContext, setPageContext] = useState<AdminChatPageContext | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsOpen(true);
  }, []);

  const persistOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    localStorage.setItem(STORAGE_KEY, String(open));
  }, []);

  const openPanel = useCallback(() => persistOpen(true), [persistOpen]);
  const closePanel = useCallback(() => persistOpen(false), [persistOpen]);
  const togglePanel = useCallback(() => persistOpen(!isOpen), [isOpen, persistOpen]);

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
