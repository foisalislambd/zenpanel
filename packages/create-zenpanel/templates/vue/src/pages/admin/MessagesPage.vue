<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ArrowLeft, Inbox, MessageCircle, Search, SendHorizontal } from "lucide-vue-next";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader.vue";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState.vue";
import { useAdminToast } from "@/composables/use-admin-toast";
import { usePreviewCollection } from "@/composables/use-preview-collection";
import { adminConversations, type AdminConversation } from "@/lib/admin-data/messages";
import { filterConversations, initials } from "@/lib/admin-resources";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/format";

const { toast } = useAdminToast();
const conversations = usePreviewCollection<AdminConversation>("messages", adminConversations);
const activeId = ref<string | null>(null);
const query = ref("");
const draft = ref("");
const threadEnd = ref<HTMLDivElement | null>(null);
const composer = ref<HTMLTextAreaElement | null>(null);

const active = computed(() => conversations.value.find((c) => c.id === activeId.value) ?? null);
const list = computed(() => filterConversations(conversations.value, query.value));
const lastOf = (c: AdminConversation) => c.messages[c.messages.length - 1];

watch(
  () => [activeId.value, active.value?.messages.length],
  async () => {
    await nextTick();
    threadEnd.value?.scrollIntoView({ block: "end" });
  },
);

function openConversation(id: string) {
  activeId.value = id;
  draft.value = "";
  conversations.value = conversations.value.map((c) => (c.id === id ? { ...c, unread: 0 } : c));
}

function send() {
  const body = draft.value.trim();
  const target = active.value;
  if (!body || !target) return;
  conversations.value = conversations.value.map((c) =>
    c.id === target.id
      ? {
          ...c,
          messages: [...c.messages, { id: `m-${Date.now()}`, from: "admin" as const, body, sentAt: new Date().toISOString() }],
        }
      : c,
  );
  draft.value = "";
  toast({ title: "Reply sent", description: `Your message to ${target.name} was delivered.` });
  composer.value?.focus();
}

function onComposerKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}
</script>

<template>
  <div class="admin-content flex h-full min-h-0 flex-col px-3 py-4 sm:px-4 sm:py-5">
    <AdminPageHeader title="Messages" />

    <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
      <aside
        :class="
          cn(
            'admin-card min-h-0 w-full shrink-0 flex-col overflow-hidden md:flex md:w-80 lg:w-96',
            active ? 'hidden' : 'flex',
          )
        "
        aria-label="Conversations"
      >
        <div class="shrink-0 space-y-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ conversations.length }} conversation{{ conversations.length === 1 ? "" : "s" }}
            </p>
          </div>
          <div class="relative">
            <Search class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              v-model="query"
              type="search"
              placeholder="Search messages…"
              aria-label="Search messages"
              class="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white"
            />
          </div>
        </div>
        <ul class="admin-scrollbar min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
          <li v-if="list.length === 0">
            <AdminEmptyState
              :icon="Inbox"
              :title="conversations.length === 0 ? 'No messages yet' : 'No matches'"
              :description="
                conversations.length === 0
                  ? 'When customers reach out, their conversations will appear here.'
                  : 'Try a different search term.'
              "
            />
          </li>
          <li v-for="c in list" :key="c.id">
            <button
              type="button"
              :aria-current="c.id === activeId ? 'true' : undefined"
              :class="
                cn(
                  'flex w-full gap-3 px-4 py-3.5 text-left transition-colors',
                  c.id === activeId ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]',
                )
              "
              @click="openConversation(c.id)"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                aria-hidden="true"
              >
                {{ initials(c.name) }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-baseline justify-between gap-2">
                  <span :class="cn('truncate text-sm text-gray-900 dark:text-white', c.unread ? 'font-semibold' : 'font-medium')">
                    {{ c.name }}
                  </span>
                  <time :datetime="lastOf(c).sentAt" class="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(lastOf(c).sentAt) }}
                  </time>
                </span>
                <span
                  :class="
                    cn(
                      'mt-0.5 block truncate text-sm',
                      c.unread ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300',
                    )
                  "
                >
                  {{ c.subject }}
                </span>
                <span class="mt-0.5 flex items-center gap-2">
                  <span class="min-w-0 flex-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {{ lastOf(c).from === "admin" ? "You: " : "" }}{{ lastOf(c).body }}
                  </span>
                  <span
                    v-if="c.unread > 0"
                    class="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white"
                  >
                    {{ c.unread }}<span class="sr-only"> unread</span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        </ul>
      </aside>

      <section
        :class="cn('admin-card min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex', active ? 'flex' : 'hidden')"
        :aria-label="active ? `Conversation with ${active.name}` : 'Conversation'"
      >
        <div v-if="!active" class="flex flex-1 items-center justify-center">
          <AdminEmptyState
            :icon="MessageCircle"
            title="Select a conversation"
            description="Choose a thread from the inbox to read and reply."
          />
        </div>
        <template v-else>
          <header class="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-white/10"
              aria-label="Back to inbox"
              @click="activeId = null"
            >
              <ArrowLeft class="h-5 w-5" aria-hidden="true" />
            </button>
            <div class="min-w-0">
              <h2 class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ active.subject }}</h2>
              <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ active.name }} · {{ active.email }}</p>
            </div>
          </header>
          <div class="admin-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5" role="log" aria-live="polite">
            <div v-for="m in active.messages" :key="m.id" :class="cn('flex', m.from === 'admin' ? 'justify-end' : 'justify-start')">
              <div
                :class="
                  cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%]',
                    m.from === 'admin'
                      ? 'rounded-br-md bg-brand-500 text-white'
                      : 'rounded-bl-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white',
                  )
                "
              >
                <p class="whitespace-pre-wrap">{{ m.body }}</p>
                <time
                  :datetime="m.sentAt"
                  :class="cn('mt-1 block text-[11px]', m.from === 'admin' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400')"
                >
                  {{ formatRelativeTime(m.sentAt) }}
                </time>
              </div>
            </div>
            <div ref="threadEnd" />
          </div>
          <form class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800" @submit.prevent="send">
            <div
              class="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900"
            >
              <label for="message-reply" class="sr-only">Reply to {{ active.name }}</label>
              <textarea
                id="message-reply"
                ref="composer"
                v-model="draft"
                rows="1"
                :placeholder="`Reply to ${active.name.split(' ')[0]}…`"
                class="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                @keydown="onComposerKeyDown"
              />
              <button
                type="submit"
                :disabled="!draft.trim()"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send reply"
              >
                <SendHorizontal class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p class="mt-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400">Enter to send · Shift + Enter for a new line</p>
          </form>
        </template>
      </section>
    </div>
  </div>
</template>
