/** Inbox + thread view with replies (preview data until you connect your API). */
import { adminConversations } from "./lib/admin-data/messages.js";
import { filterConversations, initials } from "./lib/admin-resources.js";
import { formatRelativeTime } from "./lib/format.js";
import { previewCollection, toast } from "./ui.js";
import { emptyState, escapeHtml, icon, navSectionFor, pageHeader, refreshIcons } from "./utils.js";

const last = (c) => c.messages[c.messages.length - 1];

export function renderMessagesPage(root) {
  if (!root) return;
  const store = previewCollection("messages", adminConversations);
  let activeId = null;
  let query = "";

  root.innerHTML = `
    <div class="admin-content flex h-full min-h-0 flex-col px-3 py-4 sm:px-4 sm:py-5">
      ${pageHeader("Messages", "", navSectionFor("Messages"))}
      <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside data-slot="inbox" class="admin-card flex min-h-0 w-full shrink-0 flex-col overflow-hidden md:flex md:w-80 lg:w-96" aria-label="Conversations">
          <div class="shrink-0 space-y-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
              <p class="text-xs text-gray-500 dark:text-gray-400" data-slot="count"></p>
            </div>
            <div class="relative">
              ${icon("search", "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400")}
              <input type="search" data-search placeholder="Search messages…" aria-label="Search messages"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white" />
            </div>
          </div>
          <ul data-slot="list" class="admin-scrollbar min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800"></ul>
        </aside>
        <section data-slot="thread" class="admin-card hidden min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex" aria-label="Conversation"></section>
      </div>
    </div>`;

  const inbox = root.querySelector('[data-slot="inbox"]');
  const list = root.querySelector('[data-slot="list"]');
  const thread = root.querySelector('[data-slot="thread"]');
  const count = root.querySelector('[data-slot="count"]');

  function paintList() {
    const all = store.get();
    const items = filterConversations(all, query);
    count.textContent = `${all.length} conversation${all.length === 1 ? "" : "s"}`;
    list.innerHTML = items.length
      ? items
          .map((c) => {
            const m = last(c);
            const current = c.id === activeId;
            return `
          <li>
            <button type="button" data-open="${escapeHtml(c.id)}" ${current ? 'aria-current="true"' : ""}
              class="flex w-full gap-3 px-4 py-3.5 text-left transition-colors ${current ? "bg-brand-50 dark:bg-brand-500/10" : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"}">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" aria-hidden="true">${escapeHtml(initials(c.name))}</span>
              <span class="min-w-0 flex-1">
                <span class="flex items-baseline justify-between gap-2">
                  <span class="truncate text-sm text-gray-900 dark:text-white ${c.unread ? "font-semibold" : "font-medium"}">${escapeHtml(c.name)}</span>
                  <time datetime="${escapeHtml(m.sentAt)}" class="shrink-0 text-xs text-gray-500 dark:text-gray-400">${escapeHtml(formatRelativeTime(m.sentAt))}</time>
                </span>
                <span class="mt-0.5 block truncate text-sm ${c.unread ? "font-medium text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-300"}">${escapeHtml(c.subject)}</span>
                <span class="mt-0.5 flex items-center gap-2">
                  <span class="min-w-0 flex-1 truncate text-xs text-gray-500 dark:text-gray-400">${m.from === "admin" ? "You: " : ""}${escapeHtml(m.body)}</span>
                  ${c.unread > 0 ? `<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">${c.unread}<span class="sr-only"> unread</span></span>` : ""}
                </span>
              </span>
            </button>
          </li>`;
          })
          .join("")
      : `<li>${emptyState({
          iconName: "inbox",
          title: all.length === 0 ? "No messages yet" : "No matches",
          description: all.length === 0 ? "When customers reach out, their conversations will appear here." : "Try a different search term.",
        })}</li>`;
  }

  function paintThread() {
    const conv = store.get().find((c) => c.id === activeId);
    inbox.classList.toggle("hidden", Boolean(conv));
    inbox.classList.toggle("flex", !conv);
    thread.classList.toggle("hidden", !conv);
    thread.classList.toggle("flex", Boolean(conv));
    thread.setAttribute("aria-label", conv ? `Conversation with ${conv.name}` : "Conversation");
    if (!conv) {
      thread.innerHTML = `<div class="flex flex-1 items-center justify-center">${emptyState({
        iconName: "message-circle",
        title: "Select a conversation",
        description: "Choose a thread from the inbox to read and reply.",
      })}</div>`;
      return;
    }
    const first = conv.name.split(" ")[0];
    thread.innerHTML = `
      <header class="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <button type="button" data-back class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-white/10" aria-label="Back to inbox">${icon("arrow-left", "h-5 w-5")}</button>
        <div class="min-w-0">
          <h2 class="truncate text-sm font-semibold text-gray-900 dark:text-white">${escapeHtml(conv.subject)}</h2>
          <p class="truncate text-xs text-gray-500 dark:text-gray-400">${escapeHtml(conv.name)} · ${escapeHtml(conv.email)}</p>
        </div>
      </header>
      <div class="admin-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5" role="log" aria-live="polite" data-log>
        ${conv.messages
          .map(
            (m) => `
          <div class="flex ${m.from === "admin" ? "justify-end" : "justify-start"}">
            <div class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%] ${m.from === "admin" ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white"}">
              <p class="whitespace-pre-wrap">${escapeHtml(m.body)}</p>
              <time datetime="${escapeHtml(m.sentAt)}" class="mt-1 block text-[11px] ${m.from === "admin" ? "text-white/80" : "text-gray-500 dark:text-gray-400"}">${escapeHtml(formatRelativeTime(m.sentAt))}</time>
            </div>
          </div>`,
          )
          .join("")}
      </div>
      <form class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800" data-reply>
        <div class="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900">
          <label for="message-reply" class="sr-only">Reply to ${escapeHtml(conv.name)}</label>
          <textarea id="message-reply" rows="1" placeholder="Reply to ${escapeHtml(first)}…"
            class="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"></textarea>
          <button type="submit" disabled aria-label="Send reply"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">${icon("send-horizontal", "h-4 w-4")}</button>
        </div>
        <p class="mt-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400">Enter to send · Shift + Enter for a new line</p>
      </form>`;
    const log = thread.querySelector("[data-log]");
    log.scrollTop = log.scrollHeight;
    const form = thread.querySelector("[data-reply]");
    const textarea = form.querySelector("textarea");
    const send = form.querySelector('[type="submit"]');
    textarea.addEventListener("input", () => (send.disabled = !textarea.value.trim()));
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const body = textarea.value.trim();
      if (!body) return;
      store.set((items) =>
        items.map((c) =>
          c.id === conv.id
            ? { ...c, messages: [...c.messages, { id: `m-${Date.now()}`, from: "admin", body, sentAt: new Date().toISOString() }] }
            : c,
        ),
      );
      toast({ title: "Reply sent", description: `Your message to ${conv.name} was delivered.` });
      paint();
      thread.querySelector("#message-reply")?.focus();
    });
  }

  function paint() {
    paintList();
    paintThread();
    refreshIcons();
  }

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    activeId = btn.dataset.open;
    store.set((items) => items.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c)));
    paint();
  });
  thread.addEventListener("click", (e) => {
    if (e.target.closest("[data-back]")) {
      activeId = null;
      paint();
    }
  });
  root.querySelector("[data-search]").addEventListener("input", (e) => {
    query = e.target.value;
    paintList();
    refreshIcons();
  });

  paint();
}
