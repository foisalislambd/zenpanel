import { Component, ElementRef, computed, effect, inject, signal, viewChild, type WritableSignal } from '@angular/core';
import { AdminPageHeaderComponent } from '@/app/admin/layout/admin-page-header.component';
import { AdminEmptyStateComponent } from '@/app/admin/ui/admin-empty-state.component';
import { PreviewStoreService } from '@/app/core/preview-store.service';
import { ToastService } from '@/app/core/toast.service';
import { adminConversations, type AdminConversation } from '@/app/lib/admin-data/messages';
import { filterConversations, initials } from '@/app/lib/admin-resources';
import { formatRelativeTime } from '@/app/lib/format';
import { IconComponent } from '@/app/shared/icon.component';

/** Inbox + thread view with replies (preview data until you connect your API). */
@Component({
  selector: 'app-messages-page',
  host: { class: 'block h-full' },
  imports: [AdminPageHeaderComponent, AdminEmptyStateComponent, IconComponent],
  template: `
    <div class="admin-content flex h-full min-h-0 flex-col px-3 py-4 sm:px-4 sm:py-5">
      <app-admin-page-header title="Messages" />

      <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <aside
          class="admin-card min-h-0 w-full shrink-0 flex-col overflow-hidden md:flex md:w-80 lg:w-96"
          [class.hidden]="!!active()"
          [class.flex]="!active()"
          aria-label="Conversations"
        >
          <div class="shrink-0 space-y-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Inbox</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ conversations().length }} conversation{{ conversations().length === 1 ? '' : 's' }}
              </p>
            </div>
            <div class="relative">
              <app-icon name="search" [size]="16" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                [value]="query()"
                (input)="query.set($any($event.target).value)"
                placeholder="Search messages…"
                aria-label="Search messages"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white"
              />
            </div>
          </div>
          <ul class="admin-scrollbar min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
            @for (c of list(); track c.id) {
              <li>
                <button
                  type="button"
                  [attr.aria-current]="c.id === activeId() ? 'true' : null"
                  class="flex w-full gap-3 px-4 py-3.5 text-left transition-colors"
                  [class]="c.id === activeId() ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'"
                  (click)="open(c.id)"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                    aria-hidden="true"
                    >{{ initials(c.name) }}</span
                  >
                  <span class="min-w-0 flex-1">
                    <span class="flex items-baseline justify-between gap-2">
                      <span class="truncate text-sm text-gray-900 dark:text-white" [class]="c.unread ? 'font-semibold' : 'font-medium'">{{
                        c.name
                      }}</span>
                      <time [attr.datetime]="last(c).sentAt" class="shrink-0 text-xs text-gray-500 dark:text-gray-400">{{
                        rel(last(c).sentAt)
                      }}</time>
                    </span>
                    <span
                      class="mt-0.5 block truncate text-sm"
                      [class]="c.unread ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'"
                      >{{ c.subject }}</span
                    >
                    <span class="mt-0.5 flex items-center gap-2">
                      <span class="min-w-0 flex-1 truncate text-xs text-gray-500 dark:text-gray-400"
                        >{{ last(c).from === 'admin' ? 'You: ' : '' }}{{ last(c).body }}</span
                      >
                      @if (c.unread > 0) {
                        <span
                          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white"
                          >{{ c.unread }}<span class="sr-only"> unread</span></span
                        >
                      }
                    </span>
                  </span>
                </button>
              </li>
            } @empty {
              <li>
                <app-admin-empty-state
                  icon="inbox"
                  [title]="conversations().length === 0 ? 'No messages yet' : 'No matches'"
                  [description]="
                    conversations().length === 0
                      ? 'When customers reach out, their conversations will appear here.'
                      : 'Try a different search term.'
                  "
                />
              </li>
            }
          </ul>
        </aside>

        <section
          class="admin-card min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex"
          [class.flex]="!!active()"
          [class.hidden]="!active()"
          [attr.aria-label]="active() ? 'Conversation with ' + active()!.name : 'Conversation'"
        >
          @if (active(); as conv) {
            <header class="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-white/10"
                aria-label="Back to inbox"
                (click)="activeId.set(null)"
              >
                <app-icon name="arrow-left" [size]="20" />
              </button>
              <div class="min-w-0">
                <h2 class="truncate text-sm font-semibold text-gray-900 dark:text-white">{{ conv.subject }}</h2>
                <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ conv.name }} · {{ conv.email }}</p>
              </div>
            </header>
            <div class="admin-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5" role="log" aria-live="polite">
              @for (m of conv.messages; track m.id) {
                <div class="flex" [class]="m.from === 'admin' ? 'justify-end' : 'justify-start'">
                  <div
                    class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%]"
                    [class]="
                      m.from === 'admin'
                        ? 'rounded-br-md bg-brand-500 text-white'
                        : 'rounded-bl-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white'
                    "
                  >
                    <p class="whitespace-pre-wrap">{{ m.body }}</p>
                    <time
                      [attr.datetime]="m.sentAt"
                      class="mt-1 block text-[11px]"
                      [class]="m.from === 'admin' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'"
                      >{{ rel(m.sentAt) }}</time
                    >
                  </div>
                </div>
              }
              <div #threadEnd></div>
            </div>
            <form class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800" (submit)="send($event)">
              <div
                class="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900"
              >
                <label for="message-reply" class="sr-only">Reply to {{ conv.name }}</label>
                <textarea
                  id="message-reply"
                  #composer
                  [value]="draft()"
                  (input)="draft.set($any($event.target).value)"
                  (keydown)="onComposerKeyDown($event)"
                  rows="1"
                  [placeholder]="'Reply to ' + conv.name.split(' ')[0] + '…'"
                  class="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                ></textarea>
                <button
                  type="submit"
                  [disabled]="!draft().trim()"
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send reply"
                >
                  <app-icon name="send-horizontal" [size]="16" />
                </button>
              </div>
              <p class="mt-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400">Enter to send · Shift + Enter for a new line</p>
            </form>
          } @else {
            <div class="flex flex-1 items-center justify-center">
              <app-admin-empty-state
                icon="message-circle"
                title="Select a conversation"
                description="Choose a thread from the inbox to read and reply."
              />
            </div>
          }
        </section>
      </div>
    </div>
  `,
})
export class MessagesPageComponent {
  private readonly toaster = inject(ToastService);
  private readonly conversationsStore: WritableSignal<AdminConversation[]> = inject(PreviewStoreService).collection(
    'messages',
    adminConversations,
  );
  readonly conversations = this.conversationsStore.asReadonly();
  readonly activeId = signal<string | null>(null);
  readonly query = signal('');
  readonly draft = signal('');
  readonly initials = initials;
  readonly rel = (iso: string) => formatRelativeTime(iso);

  private readonly threadEnd = viewChild<ElementRef<HTMLDivElement>>('threadEnd');
  private readonly composer = viewChild<ElementRef<HTMLTextAreaElement>>('composer');

  readonly active = computed(() => this.conversations().find((c) => c.id === this.activeId()) ?? null);
  readonly list = computed(() => filterConversations(this.conversations(), this.query()));

  constructor() {
    effect(() => {
      this.active()?.messages.length;
      const end = this.threadEnd();
      queueMicrotask(() => end?.nativeElement.scrollIntoView({ block: 'end' }));
    });
  }

  last(c: AdminConversation) {
    return c.messages[c.messages.length - 1];
  }

  open(id: string): void {
    this.activeId.set(id);
    this.draft.set('');
    this.conversationsStore.update((items) => items.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  send(e?: Event): void {
    e?.preventDefault();
    const body = this.draft().trim();
    const target = this.active();
    if (!body || !target) return;
    this.conversationsStore.update((items) =>
      items.map((c) =>
        c.id === target.id
          ? {
              ...c,
              messages: [...c.messages, { id: `m-${Date.now()}`, from: 'admin' as const, body, sentAt: new Date().toISOString() }],
            }
          : c,
      ),
    );
    this.draft.set('');
    this.toaster.toast({ title: 'Reply sent', description: `Your message to ${target.name} was delivered.` });
    this.composer()?.nativeElement.focus();
  }

  onComposerKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }
}
