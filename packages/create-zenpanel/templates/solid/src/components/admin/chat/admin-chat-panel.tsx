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
} from "lucide-solid";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";

function MessageBubble(props: { message: AdminChatMessage }) {
  const isUser = () => props.message.role === "user";

  return (
    <div
      class={cn(
        "admin-chat-bubble flex w-full min-w-0",
        isUser() ? "justify-end" : "justify-start",
      )}
    >
      <div
        class={cn(
          "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
          isUser()
            ? "bg-brand-500 text-white shadow-brand-500/20"
            : "border border-gray-200/80 bg-white text-gray-800 shadow-gray-200/40 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-none",
        )}
      >
        <Show when={!isUser()}>
          <div class="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
            <span class="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10">
              <Bot class="h-3 w-3" aria-hidden />
            </span>
            {adminConfig.brand.name} AI
          </div>
        </Show>
        <Show
          when={isUser()}
          fallback={<AdminChatMarkdown content={props.message.content} />}
        >
          <p class="leading-relaxed whitespace-pre-wrap">{props.message.content}</p>
        </Show>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div class="flex items-center gap-2 px-1 py-2" aria-live="polite" aria-label="Assistant is typing">
      <Bot class="h-4 w-4 text-brand-500" aria-hidden />
      <div class="flex gap-1">
        <For each={[0, 1, 2]}>
          {(i) => (
            <span
              class="admin-chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400"
              style={{ "animation-delay": `${i * 0.2}s` }}
            />
          )}
        </For>
      </div>
    </div>
  );
}

type Props = {
  overlay?: boolean;
};

export function AdminChatPanel(props: Props) {
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

  const [prompt, setPrompt] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  let endRef: HTMLDivElement | undefined;
  let textareaRef: HTMLTextAreaElement | undefined;

  createEffect(() => {
    messages();
    isGenerating();
    endRef?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  createEffect(() => {
    prompt();
    const el = textareaRef;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  });

  createEffect(() => {
    if (!isOpen()) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  function buildPagePayload() {
    const ctx = pageContext();
    if (!ctx) return undefined;

    return {
      pageId: ctx.pageId,
      title: ctx.title,
      description: ctx.description,
      data: ctx.getSnapshot?.(),
    };
  }

  async function runChat(text: string) {
    const history = [
      ...messages().map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];
    const res = await previewSendAdminChatMessage({
      messages: history,
      pageContext: buildPagePayload(),
    });
    addMessage({ role: "assistant", content: res.reply });
  }

  async function handleSend() {
    const text = prompt().trim();
    if (!text || isGenerating()) return;

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
  }

  async function handleQuickAction(actionPrompt: string) {
    if (isGenerating()) return;
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
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const defaultQuickActions = createMemo<AdminChatQuickAction[]>(() =>
    pageContext()?.pageId === "dashboard"
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
        ],
  );

  const quickActions = createMemo(
    () => pageContext()?.quickActions?.length
      ? pageContext()!.quickActions!
      : defaultQuickActions(),
  );

  return (
    <Show when={isOpen()}>
      <Show when={!isDesktop()}>
        <button
          type="button"
          class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={closePanel}
          aria-label="Close chat"
        />
      </Show>

      <aside
        class={cn(
          "admin-chat-panel admin-content-editor-panel flex flex-col",
          props.overlay || !isDesktop()
            ? "fixed top-0 right-0 z-50 h-dvh shadow-2xl"
            : "h-full shrink-0",
        )}
        style={{
          width: isDesktop() && !props.overlay ? `${CHAT_PANEL_WIDTH}px` : "min(100vw, 400px)",
        }}
        role={props.overlay || !isDesktop() ? "dialog" : undefined}
        aria-modal={props.overlay || !isDesktop() ? true : undefined}
        aria-label="AI assistant panel"
      >
        <div class="admin-content-editor-panel-header shrink-0">
          <div class="flex min-w-0 items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Sparkles class="h-4 w-4" aria-hidden />
            </div>
            <div class="min-w-0">
              <p class="admin-content-editor-panel-title truncate">AI Assistant</p>
              <Show when={pageContext()}>
                <p class="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {pageContext()!.title}
                </p>
              </Show>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <Show when={messages().length > 0}>
              <button
                type="button"
                onClick={clearMessages}
                class="admin-content-editor-panel-close"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </Show>
            <button
              type="button"
              onClick={closePanel}
              class="admin-content-editor-panel-close"
              title="Close panel"
              aria-label="Close panel"
            >
              <Show when={isDesktop()} fallback={<X class="h-4 w-4" />}>
                <PanelRightClose class="h-4 w-4" />
              </Show>
            </button>
          </div>
        </div>

        <div class="admin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <Show
            when={messages().length > 0 || isGenerating()}
            fallback={
              <div class="flex flex-1 flex-col items-center justify-center px-4 text-center">
                <Bot class="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" aria-hidden />
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  How can I help?
                </h3>
                <p class="mt-1 max-w-[260px] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {pageContext()?.description ??
                    "Ask anything about this admin page — get suggestions, analyze data, or plan your workflow."}
                </p>
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                  <For each={quickActions()}>
                    {(action) => (
                      <button
                        type="button"
                        disabled={isGenerating()}
                        onClick={() => void handleQuickAction(action.prompt)}
                        class="admin-chip"
                      >
                        {action.label}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            }
          >
            <div class="space-y-4">
              <For each={messages()}>{(msg) => <MessageBubble message={msg} />}</For>
              <Show when={isGenerating()}>
                <TypingIndicator />
              </Show>
              <div ref={endRef} class="h-1" />
            </div>
          </Show>
        </div>

        <Show when={messages().length > 0 && quickActions().length > 0}>
          <div class="shrink-0 border-t border-gray-100 px-3 py-2 dark:border-gray-800">
            <div class="flex gap-1.5 overflow-x-auto pb-1">
              <For each={quickActions()}>
                {(action) => (
                  <button
                    type="button"
                    disabled={isGenerating()}
                    onClick={() => void handleQuickAction(action.prompt)}
                    class="admin-chip admin-chip-pill"
                  >
                    {action.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        </Show>

        <Show when={error()}>
          <div class="mx-3 mb-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error()}
          </div>
        </Show>

        <div class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <div class="rounded-xl border border-gray-200 bg-gray-50 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900/50">
            <textarea
              ref={textareaRef}
              value={prompt()}
              onInput={(e) => setPrompt(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isGenerating()}
              placeholder="Ask anything or describe what you need…"
              class="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 dark:text-white"
              aria-label="Chat message"
            />
            <div class="flex items-center justify-end px-2 pb-2">
              <button
                type="button"
                disabled={!prompt().trim() || isGenerating()}
                onClick={() => void handleSend()}
                class={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  prompt().trim() && !isGenerating()
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-800",
                )}
              >
                <Show
                  when={isGenerating()}
                  fallback={
                    <>
                      Send
                      <ArrowRight class="h-3.5 w-3.5" aria-hidden />
                    </>
                  }
                >
                  <Loader2 class="h-3.5 w-3.5 animate-spin" aria-hidden />
                </Show>
              </button>
            </div>
          </div>
          <p class="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </aside>
    </Show>
  );
}
