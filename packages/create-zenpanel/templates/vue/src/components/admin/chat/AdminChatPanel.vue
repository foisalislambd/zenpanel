<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import AdminChatMarkdown from "@/components/admin/chat/AdminChatMarkdown.vue";
import {
  CHAT_PANEL_WIDTH,
  useAdminChatPanel,
  type AdminChatMessage,
  type AdminChatQuickAction,
} from "@/composables/use-admin-chat-panel";
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
} from "lucide-vue-next";

const props = withDefaults(defineProps<{ overlay?: boolean }>(), { overlay: false });

const chat = useAdminChatPanel();
const prompt = ref("");
const error = ref<string | null>(null);
const endRef = ref<HTMLDivElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(
  () => [chat.messages, chat.isGenerating],
  async () => {
    await nextTick();
    endRef.value?.scrollIntoView({ behavior: "smooth", block: "end" });
  },
  { deep: true },
);

watch(prompt, async () => {
  await nextTick();
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
});

function onKeyDownEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    chat.closePanel();
  }
}

watch(
  () => chat.isOpen,
  (open) => {
    if (open) {
      document.addEventListener("keydown", onKeyDownEscape);
    } else {
      document.removeEventListener("keydown", onKeyDownEscape);
    }
  },
  // Panel only mounts while open — run immediately so Escape binds on mount.
  { immediate: true },
);

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDownEscape);
});

function buildPagePayload() {
  const ctx = chat.pageContext;
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
    ...chat.messages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: text },
  ];
  const res = await previewSendAdminChatMessage({
    messages: history,
    pageContext: buildPagePayload(),
  });
  chat.addMessage({ role: "assistant", content: res.reply });
}

async function handleSend() {
  const text = prompt.value.trim();
  if (!text || chat.isGenerating) return;

  error.value = null;
  prompt.value = "";
  chat.addMessage({ role: "user", content: text });
  chat.setIsGenerating(true);

  try {
    await runChat(text);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Something went wrong";
  } finally {
    chat.setIsGenerating(false);
  }
}

async function handleQuickAction(actionPrompt: string) {
  if (chat.isGenerating) return;
  error.value = null;
  chat.addMessage({ role: "user", content: actionPrompt });
  chat.setIsGenerating(true);

  try {
    await runChat(actionPrompt);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Something went wrong";
  } finally {
    chat.setIsGenerating(false);
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    void handleSend();
  }
}

const defaultQuickActions = computed<AdminChatQuickAction[]>(() =>
  chat.pageContext?.pageId === "dashboard"
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

const quickActions = computed(() =>
  chat.pageContext?.quickActions?.length
    ? chat.pageContext.quickActions
    : defaultQuickActions.value,
);

function isUser(message: AdminChatMessage) {
  return message.role === "user";
}
</script>

<template>
  <template v-if="chat.isOpen">
    <button
      v-if="!chat.isDesktop"
      type="button"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
      aria-label="Close chat"
      @click="chat.closePanel()"
    />

    <aside
      :class="
        cn(
          'admin-chat-panel admin-content-editor-panel flex flex-col',
          props.overlay || !chat.isDesktop ? 'fixed top-0 right-0 z-50 h-dvh shadow-2xl' : 'h-full shrink-0',
        )
      "
      :style="{
        width: chat.isDesktop && !props.overlay ? `${CHAT_PANEL_WIDTH}px` : 'min(100vw, 400px)',
      }"
      :role="props.overlay || !chat.isDesktop ? 'dialog' : undefined"
      :aria-modal="props.overlay || !chat.isDesktop ? true : undefined"
      aria-label="AI assistant panel"
    >
      <div class="admin-content-editor-panel-header shrink-0">
        <div class="flex min-w-0 items-center gap-2.5">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"
          >
            <Sparkles class="h-4 w-4" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <p class="admin-content-editor-panel-title truncate">AI Assistant</p>
            <p v-if="chat.pageContext" class="truncate text-[11px] text-gray-500 dark:text-gray-400">
              {{ chat.pageContext.title }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button
            v-if="chat.messages.length > 0"
            type="button"
            class="admin-content-editor-panel-close"
            title="Clear chat"
            aria-label="Clear chat"
            @click="chat.clearMessages()"
          >
            <Trash2 class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="admin-content-editor-panel-close"
            title="Close panel"
            aria-label="Close panel"
            @click="chat.closePanel()"
          >
            <PanelRightClose v-if="chat.isDesktop" class="h-4 w-4" />
            <X v-else class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="admin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
        <div v-if="chat.messages.length > 0 || chat.isGenerating" class="space-y-4">
          <div
            v-for="msg in chat.messages"
            :key="msg.id"
            :class="cn('admin-chat-bubble flex w-full min-w-0', isUser(msg) ? 'justify-end' : 'justify-start')"
          >
            <div
              :class="
                cn(
                  'max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm',
                  isUser(msg)
                    ? 'bg-brand-500 text-white shadow-brand-500/20'
                    : 'border border-gray-200/80 bg-white text-gray-800 shadow-gray-200/40 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-none',
                )
              "
            >
              <div
                v-if="!isUser(msg)"
                class="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400"
              >
                <span class="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10">
                  <Bot class="h-3 w-3" aria-hidden="true" />
                </span>
                {{ adminConfig.brand.name }} AI
              </div>
              <p v-if="isUser(msg)" class="leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
              <AdminChatMarkdown v-else :content="msg.content" />
            </div>
          </div>
          <div
            v-if="chat.isGenerating"
            class="flex items-center gap-2 px-1 py-2"
            aria-live="polite"
            aria-label="Assistant is typing"
          >
            <Bot class="h-4 w-4 text-brand-500" aria-hidden="true" />
            <div class="flex gap-1">
              <span
                v-for="i in 3"
                :key="i"
                class="admin-chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400"
                :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
              />
            </div>
          </div>
          <div ref="endRef" class="h-1" />
        </div>
        <div v-else class="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <Bot class="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">How can I help?</h3>
          <p class="mt-1 max-w-[260px] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {{
              chat.pageContext?.description ??
              "Ask anything about this admin page — get suggestions, analyze data, or plan your workflow."
            }}
          </p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <button
              v-for="action in quickActions"
              :key="action.id"
              type="button"
              :disabled="chat.isGenerating"
              class="admin-chip"
              @click="handleQuickAction(action.prompt)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="chat.messages.length > 0 && quickActions.length > 0"
        class="shrink-0 border-t border-gray-100 px-3 py-2 dark:border-gray-800"
      >
        <div class="flex gap-1.5 overflow-x-auto pb-1">
          <button
            v-for="action in quickActions"
            :key="action.id"
            type="button"
            :disabled="chat.isGenerating"
            class="admin-chip admin-chip-pill"
            @click="handleQuickAction(action.prompt)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <div
        v-if="error"
        class="mx-3 mb-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        {{ error }}
      </div>

      <div class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
        <div
          class="rounded-xl border border-gray-200 bg-gray-50 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900/50"
        >
          <textarea
            ref="textareaRef"
            v-model="prompt"
            rows="1"
            :disabled="chat.isGenerating"
            placeholder="Ask anything or describe what you need…"
            class="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 dark:text-white"
            aria-label="Chat message"
            @keydown="handleKeyDown"
          />
          <div class="flex items-center justify-end px-2 pb-2">
            <button
              type="button"
              :disabled="!prompt.trim() || chat.isGenerating"
              :class="
                cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  prompt.trim() && !chat.isGenerating
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-800',
                )
              "
              @click="handleSend"
            >
              <Loader2 v-if="chat.isGenerating" class="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <template v-else>
                Send
                <ArrowRight class="h-3.5 w-3.5" aria-hidden="true" />
              </template>
            </button>
          </div>
        </div>
        <p class="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </aside>
  </template>
</template>
