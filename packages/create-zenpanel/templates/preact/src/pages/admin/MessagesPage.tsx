import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { useAdminToast } from "@/components/admin/ui/admin-toast-provider";
import { adminConversations, type AdminConversation } from "@/lib/admin-data/messages";
import { usePreviewCollection } from "@/lib/admin-data/preview-store";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/format";
import { ArrowLeft, Inbox, MessageCircle, Search, SendHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function AdminMessagesPage() {
  const { toast } = useAdminToast();
  const [conversations, setConversations] = usePreviewCollection<AdminConversation>("messages", adminConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const unreadTotal = conversations.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...conversations].sort(
      (a, b) => new Date(b.messages.at(-1)!.sentAt).getTime() - new Date(a.messages.at(-1)!.sentAt).getTime(),
    );
    if (!q) return sorted;
    return sorted.filter((c) =>
      [c.name, c.email, c.subject, ...c.messages.map((m) => m.body)].join(" ").toLowerCase().includes(q),
    );
  }, [conversations, query]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeId, active?.messages.length]);

  function openConversation(id: string) {
    setActiveId(id);
    setDraft("");
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !active) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, { id: `m-${Date.now()}`, from: "admin", body, sentAt: new Date().toISOString() }],
            }
          : c,
      ),
    );
    setDraft("");
    toast({ title: "Reply sent", description: `Your message to ${active.name} was delivered.` });
    composerRef.current?.focus();
  }

  return (
    <div className="admin-content flex h-full min-h-0 flex-col px-3 py-4 sm:px-4 sm:py-5">
      <AdminPageHeader
        title="Messages"
        description={unreadTotal > 0 ? `${unreadTotal} unread conversation${unreadTotal === 1 ? "" : "s"}` : "You're all caught up"}
      />

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside
          className={cn(
            "admin-card min-h-0 w-full shrink-0 flex-col overflow-hidden md:flex md:w-80 lg:w-96",
            active ? "hidden" : "flex",
          )}
          aria-label="Conversations"
        >
          <div className="shrink-0 space-y-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Search messages…"
                aria-label="Search messages"
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white"
              />
            </div>
          </div>
          <ul className="admin-scrollbar min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
            {list.length === 0 ? (
              <li>
                <AdminEmptyState
                  icon={Inbox}
                  title={conversations.length === 0 ? "No messages yet" : "No matches"}
                  description={
                    conversations.length === 0
                      ? "When customers reach out, their conversations will appear here."
                      : "Try a different search term."
                  }
                />
              </li>
            ) : (
              list.map((c) => {
                const last = c.messages.at(-1)!;
                const selected = c.id === activeId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => openConversation(c.id)}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3.5 text-left transition-colors",
                        selected ? "bg-brand-50 dark:bg-brand-500/10" : "hover:bg-gray-50 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" aria-hidden>
                        {initials(c.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={cn("truncate text-sm text-gray-900 dark:text-white", c.unread ? "font-semibold" : "font-medium")}>
                            {c.name}
                          </span>
                          <time dateTime={last.sentAt} className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(last.sentAt)}
                          </time>
                        </span>
                        <span className={cn("mt-0.5 block truncate text-sm", c.unread ? "font-medium text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-300")}>
                          {c.subject}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-xs text-gray-500 dark:text-gray-400">
                            {last.from === "admin" ? "You: " : ""}
                            {last.body}
                          </span>
                          {c.unread > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">
                              {c.unread}
                              <span className="sr-only"> unread</span>
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <section
          className={cn("admin-card min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex", active ? "flex" : "hidden")}
          aria-label={active ? `Conversation with ${active.name}` : "Conversation"}
        >
          {!active ? (
            <div className="flex flex-1 items-center justify-center">
              <AdminEmptyState
                icon={MessageCircle}
                title="Select a conversation"
                description="Choose a thread from the inbox to read and reply."
              />
            </div>
          ) : (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-white/10"
                  aria-label="Back to inbox"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </button>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{active.subject}</h2>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {active.name} · {active.email}
                  </p>
                </div>
              </header>
              <div className="admin-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5" role="log" aria-live="polite">
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.from === "admin" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%]",
                        m.from === "admin"
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white",
                      )}
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <time
                        dateTime={m.sentAt}
                        className={cn("mt-1 block text-[11px]", m.from === "admin" ? "text-white/80" : "text-gray-500 dark:text-gray-400")}
                      >
                        {formatRelativeTime(m.sentAt)}
                      </time>
                    </div>
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>
              <form onSubmit={send} className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
                <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900">
                  <label htmlFor="message-reply" className="sr-only">
                    Reply to {active.name}
                  </label>
                  <textarea
                    id="message-reply"
                    ref={composerRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder={`Reply to ${active.name.split(" ")[0]}…`}
                    className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send reply"
                  >
                    <SendHorizontal className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <p className="mt-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400">Enter to send · Shift + Enter for a new line</p>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
