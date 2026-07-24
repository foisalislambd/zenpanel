import { AdminChatMarkdown } from "@/components/admin/chat/admin-chat-markdown";
import {
  CHAT_PANEL_WIDTH,
  useAdminChatPanel,
  type AdminChatMessage,
  type AdminChatQuickAction,
} from "@/context/admin-chat-panel-context";
import { adminConfig } from "@/config/admin.config";
import { previewSendAdminChatMessage } from "@/lib/admin-api";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  Bot,
  Loader2,
  PanelRightClose,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function MessageBubble({ message }: { message: AdminChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "admin-chat-bubble flex w-full min-w-0",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
          isUser
            ? "bg-brand-500 text-white shadow-brand-500/20"
            : "border border-gray-200/80 bg-white text-gray-800 shadow-gray-200/40 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-none",
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10">
              <Bot className="h-3 w-3" aria-hidden />
            </span>
            {adminConfig.brand.name} AI
          </div>
        )}
        {isUser ? (
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <AdminChatMarkdown content={message.content} />
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-1 py-2" aria-live="polite" aria-label="Assistant is typing">
      <Bot className="h-4 w-4 text-brand-500" aria-hidden />
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="admin-chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  overlay?: boolean;
};

export function AdminChatPanel({ overlay = false }: Props) {
  const {
    isOpen,
    isDesktop,
    messages,
    isGenerating,
    pageContext,
    closePanel,
    addMessage,
    clearMessages,
    setIsGenerating,
  } = useAdminChatPanel();

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isGenerating]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [prompt]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closePanel]);

  const buildPagePayload = useCallback(() => {
    if (!pageContext) return undefined;

    return {
      pageId: pageContext.pageId,
      title: pageContext.title,
      description: pageContext.description,
      data: pageContext.getSnapshot?.(),
    };
  }, [pageContext]);

  const runChat = useCallback(
    async (text: string) => {
      const history = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];
      const res = await previewSendAdminChatMessage({
        messages: history,
        pageContext: buildPagePayload(),
      });
      addMessage({ role: "assistant", content: res.reply });
    },
    [messages, addMessage, buildPagePayload],
  );

  const handleSend = useCallback(async () => {
    const text = prompt.trim();
    if (!text || isGenerating) return;

    setError(null);
    setPrompt("");
    addMessage({ role: "user", content: text });
    setIsGenerating(true);

    try {
      await runChat(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, addMessage, setIsGenerating, runChat]);

  const handleQuickAction = useCallback(
    async (actionPrompt: string) => {
      if (isGenerating) return;
      setError(null);
      addMessage({ role: "user", content: actionPrompt });
      setIsGenerating(true);

      try {
        await runChat(actionPrompt);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, addMessage, setIsGenerating, runChat],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const defaultQuickActions: AdminChatQuickAction[] =
    pageContext?.pageId === "dashboard"
      ? [
          {
            id: "growth",
            label: "Analyze growth",
            prompt: "Analyze our user growth metrics and summarize key trends",
          },
          {
            id: "revenue",
            label: "Revenue summary",
            prompt: "Summarize revenue and order performance for this week",
          },
          {
            id: "help",
            label: "What can you do?",
            prompt: "What can you help me with on the dashboard?",
          },
        ]
      : [
          {
            id: "help",
            label: "What can you do?",
            prompt: "What can you help me with on this page?",
          },
          {
            id: "workflow",
            label: "Suggest workflow",
            prompt: "Suggest a workflow for managing this section efficiently",
          },
        ];

  const quickActions = pageContext?.quickActions?.length
    ? pageContext.quickActions
    : defaultQuickActions;

  if (!isOpen) return null;

  return (
    <>
      {!isDesktop && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={closePanel}
          aria-label="Close chat"
        />
      )}

      <aside
        className={cn(
          "admin-chat-panel admin-content-editor-panel flex flex-col",
          overlay || !isDesktop
            ? "fixed top-0 right-0 z-50 h-dvh shadow-2xl"
            : "h-full shrink-0",
        )}
        style={{ width: isDesktop && !overlay ? CHAT_PANEL_WIDTH : "min(100vw, 400px)" }}
        role={overlay || !isDesktop ? "dialog" : undefined}
        aria-modal={overlay || !isDesktop ? true : undefined}
        aria-label="AI assistant panel"
      >
        <div className="admin-content-editor-panel-header shrink-0">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Sparkles className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="admin-content-editor-panel-title truncate">AI Assistant</p>
              {pageContext && (
                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {pageContext.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                className="admin-content-editor-panel-close"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closePanel}
              className="admin-content-editor-panel-close"
              title="Close panel"
              aria-label="Close panel"
            >
              {isDesktop ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="admin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          {messages.length === 0 && !isGenerating ? (
            <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
              <Bot className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" aria-hidden />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                How can I help?
              </h3>
              <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {pageContext?.description ??
                  "Ask anything about this admin page — get suggestions, analyze data, or plan your workflow."}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => void handleQuickAction(action.prompt)}
                    className="admin-chip"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isGenerating && <TypingIndicator />}
              <div ref={endRef} className="h-1" />
            </div>
          )}
        </div>

        {messages.length > 0 && quickActions.length > 0 && (
          <div className="shrink-0 border-t border-gray-100 px-3 py-2 dark:border-gray-800">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => void handleQuickAction(action.prompt)}
                  className="admin-chip admin-chip-pill"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mx-3 mb-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <div className="rounded-xl border border-gray-200 bg-gray-50 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900/50">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isGenerating}
              placeholder="Ask anything or describe what you need…"
              className="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 dark:text-white"
              aria-label="Chat message"
            />
            <div className="flex items-center justify-end px-2 pb-2">
              <button
                type="button"
                disabled={!prompt.trim() || isGenerating}
                onClick={() => void handleSend()}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  prompt.trim() && !isGenerating
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-800",
                )}
              >
                {isGenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  <>
                    Send
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </aside>
    </>
  );
}
