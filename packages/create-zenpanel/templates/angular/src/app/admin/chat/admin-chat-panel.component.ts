import {
  AfterViewChecked,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminChatPanelService,
  CHAT_PANEL_WIDTH,
  type AdminChatMessage,
  type AdminChatQuickAction,
} from '@/app/core/admin-chat-panel.service';
import { adminConfig } from '@/app/core/admin.config';
import { previewSendAdminChatMessage } from '@/app/lib/admin-api';
import { IconComponent } from '@/app/shared/icon.component';
import { AdminChatMarkdownComponent } from './admin-chat-markdown.component';

const DASHBOARD_QUICK_ACTIONS: AdminChatQuickAction[] = [
  {
    id: 'growth',
    label: 'Analyze growth',
    prompt: 'Analyze our user growth metrics and summarize key trends',
  },
  {
    id: 'revenue',
    label: 'Revenue summary',
    prompt: 'Summarize revenue and order performance for this week',
  },
  { id: 'help', label: 'What can you do?', prompt: 'What can you help me with on the dashboard?' },
];

const DEFAULT_QUICK_ACTIONS: AdminChatQuickAction[] = [
  { id: 'help', label: 'What can you do?', prompt: 'What can you help me with on this page?' },
  {
    id: 'workflow',
    label: 'Suggest workflow',
    prompt: 'Suggest a workflow for managing this section efficiently',
  },
];

@Component({
  selector: 'app-admin-chat-panel',
  imports: [FormsModule, IconComponent, AdminChatMarkdownComponent],
  template: `
    @if (chat.isOpen()) {
      @if (!chat.isDesktop()) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          (click)="chat.closePanel()"
          aria-label="Close chat"
        ></button>
      }

      <aside
        class="admin-chat-panel admin-content-editor-panel flex flex-col"
        [class.fixed]="overlay || !chat.isDesktop()"
        [class.top-0]="overlay || !chat.isDesktop()"
        [class.right-0]="overlay || !chat.isDesktop()"
        [class.z-50]="overlay || !chat.isDesktop()"
        [class.h-dvh]="overlay || !chat.isDesktop()"
        [class.shadow-2xl]="overlay || !chat.isDesktop()"
        [class.h-full]="!(overlay || !chat.isDesktop())"
        [class.shrink-0]="!(overlay || !chat.isDesktop())"
        [style.width]="panelWidth()"
        [attr.role]="overlay || !chat.isDesktop() ? 'dialog' : null"
        [attr.aria-modal]="overlay || !chat.isDesktop() ? true : null"
        aria-label="AI assistant panel"
      >
        <div class="admin-content-editor-panel-header shrink-0">
          <div class="flex min-w-0 items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"
            >
              <app-icon name="sparkles" [size]="16" />
            </div>
            <div class="min-w-0">
              <p class="admin-content-editor-panel-title truncate">AI Assistant</p>
              @if (chat.pageContext()) {
                <p class="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {{ chat.pageContext()!.title }}
                </p>
              }
            </div>
          </div>
          <div class="flex items-center gap-1">
            @if (chat.messages().length > 0) {
              <button
                type="button"
                (click)="chat.clearMessages()"
                class="admin-content-editor-panel-close"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <app-icon name="trash-2" [size]="16" />
              </button>
            }
            <button
              type="button"
              (click)="chat.closePanel()"
              class="admin-content-editor-panel-close"
              title="Close panel"
              aria-label="Close panel"
            >
              <app-icon [name]="chat.isDesktop() ? 'panel-right-close' : 'x'" [size]="16" />
            </button>
          </div>
        </div>

        <div class="admin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          @if (chat.messages().length > 0 || chat.isGenerating()) {
            <div class="space-y-4">
              @for (msg of chat.messages(); track msg.id) {
                <div
                  class="admin-chat-bubble flex w-full min-w-0"
                  [class.justify-end]="msg.role === 'user'"
                  [class.justify-start]="msg.role !== 'user'"
                >
                  <div
                    class="max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm"
                    [class.bg-brand-500]="msg.role === 'user'"
                    [class.text-white]="msg.role === 'user'"
                    [class.shadow-brand-500/20]="msg.role === 'user'"
                    [class.border]="msg.role !== 'user'"
                    [class.border-gray-200/80]="msg.role !== 'user'"
                    [class.bg-white]="msg.role !== 'user'"
                    [class.text-gray-800]="msg.role !== 'user'"
                    [class.shadow-gray-200/40]="msg.role !== 'user'"
                    [class.dark:border-gray-700]="msg.role !== 'user'"
                    [class.dark:bg-gray-800/90]="msg.role !== 'user'"
                    [class.dark:text-gray-100]="msg.role !== 'user'"
                    [class.dark:shadow-none]="msg.role !== 'user'"
                  >
                    @if (msg.role !== 'user') {
                      <div
                        class="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-brand-600 dark:text-brand-400"
                      >
                        <span
                          class="flex h-5 w-5 items-center justify-center rounded-md bg-brand-500/10"
                        >
                          <app-icon name="bot" [size]="12" />
                        </span>
                        {{ brand.name }} AI
                      </div>
                    }
                    @if (msg.role === 'user') {
                      <p class="leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                    } @else {
                      <app-admin-chat-markdown [content]="msg.content" />
                    }
                  </div>
                </div>
              }
              @if (chat.isGenerating()) {
                <div
                  class="flex items-center gap-2 px-1 py-2"
                  aria-live="polite"
                  aria-label="Assistant is typing"
                >
                  <app-icon name="bot" [size]="16" class="text-brand-500" />
                  <div class="flex gap-1">
                    @for (i of [0, 1, 2]; track i) {
                      <span
                        class="admin-chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400"
                        [style.animation-delay.s]="i * 0.2"
                      ></span>
                    }
                  </div>
                </div>
              }
              <div #endRef class="h-1"></div>
            </div>
          } @else {
            <div class="flex flex-1 flex-col items-center justify-center px-4 text-center">
              <app-icon name="bot" [size]="40" class="mb-3 text-gray-300 dark:text-gray-600" />
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">How can I help?</h3>
              <p class="mt-1 max-w-[260px] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {{
                  chat.pageContext()?.description ??
                    'Ask anything about this admin page — get suggestions, analyze data, or plan your workflow.'
                }}
              </p>
              <div class="mt-4 flex flex-wrap justify-center gap-2">
                @for (action of quickActions(); track action.id) {
                  <button
                    type="button"
                    [disabled]="chat.isGenerating()"
                    (click)="handleQuickAction(action.prompt)"
                    class="admin-chip"
                  >
                    {{ action.label }}
                  </button>
                }
              </div>
            </div>
          }
        </div>

        @if (chat.messages().length > 0 && quickActions().length > 0) {
          <div class="shrink-0 border-t border-gray-100 px-3 py-2 dark:border-gray-800">
            <div class="flex gap-1.5 overflow-x-auto pb-1">
              @for (action of quickActions(); track action.id) {
                <button
                  type="button"
                  [disabled]="chat.isGenerating()"
                  (click)="handleQuickAction(action.prompt)"
                  class="admin-chip admin-chip-pill"
                >
                  {{ action.label }}
                </button>
              }
            </div>
          </div>
        }

        @if (error()) {
          <div
            class="mx-3 mb-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            {{ error() }}
          </div>
        }

        <div class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <div
            class="rounded-xl border border-gray-200 bg-gray-50 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <textarea
              #textareaRef
              [ngModel]="prompt()"
              (ngModelChange)="onPromptChange($event)"
              (keydown)="handleKeyDown($event)"
              rows="1"
              [disabled]="chat.isGenerating()"
              placeholder="Ask anything or describe what you need…"
              class="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 dark:text-white"
              aria-label="Chat message"
            ></textarea>
            <div class="flex items-center justify-end px-2 pb-2">
              <button
                type="button"
                [disabled]="!prompt().trim() || chat.isGenerating()"
                (click)="handleSend()"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                [class.bg-brand-500]="!!prompt().trim() && !chat.isGenerating()"
                [class.text-white]="!!prompt().trim() && !chat.isGenerating()"
                [class.hover:bg-brand-600]="!!prompt().trim() && !chat.isGenerating()"
                [class.bg-gray-200]="!prompt().trim() || chat.isGenerating()"
                [class.text-gray-400]="!prompt().trim() || chat.isGenerating()"
                [class.dark:bg-gray-800]="!prompt().trim() || chat.isGenerating()"
              >
                @if (chat.isGenerating()) {
                  <app-icon name="loader-2" [size]="14" class="animate-spin" />
                } @else {
                  Send
                  <app-icon name="arrow-right" [size]="14" />
                }
              </button>
            </div>
          </div>
          <p class="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </aside>
    }
  `,
})
export class AdminChatPanelComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() overlay = false;

  readonly chat = inject(AdminChatPanelService);
  private readonly destroyRef = inject(DestroyRef);

  readonly brand = adminConfig.brand;
  readonly prompt = signal('');
  readonly error = signal<string | null>(null);

  @ViewChild('endRef') private endRef?: ElementRef<HTMLDivElement>;
  @ViewChild('textareaRef') private textareaRef?: ElementRef<HTMLTextAreaElement>;

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.chat.closePanel();
    }
  };

  readonly panelWidth = computed(() =>
    this.chat.isDesktop() && !this.overlay ? `${CHAT_PANEL_WIDTH}px` : 'min(100vw, 400px)',
  );

  readonly quickActions = computed<AdminChatQuickAction[]>(() => {
    const ctx = this.chat.pageContext();
    if (ctx?.quickActions?.length) return ctx.quickActions;
    return ctx?.pageId === 'dashboard' ? DASHBOARD_QUICK_ACTIONS : DEFAULT_QUICK_ACTIONS;
  });

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
    this.destroyRef.onDestroy(() => document.removeEventListener('keydown', this.onKeyDown));
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  ngAfterViewChecked(): void {
    this.endRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    const el = this.textareaRef?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }

  onPromptChange(value: string): void {
    this.prompt.set(value);
  }

  private buildPagePayload() {
    const ctx = this.chat.pageContext();
    if (!ctx) return undefined;
    return {
      pageId: ctx.pageId,
      title: ctx.title,
      description: ctx.description,
      data: ctx.getSnapshot?.(),
    };
  }

  private async runChat(text: string): Promise<void> {
    const history = [
      ...this.chat.messages().map((m: AdminChatMessage) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];
    const res = await previewSendAdminChatMessage({
      messages: history,
      pageContext: this.buildPagePayload(),
    });
    this.chat.addMessage({ role: 'assistant', content: res.reply });
  }

  async handleSend(): Promise<void> {
    const text = this.prompt().trim();
    if (!text || this.chat.isGenerating()) return;

    this.error.set(null);
    this.prompt.set('');
    this.chat.addMessage({ role: 'user', content: text });
    this.chat.setIsGenerating(true);

    try {
      await this.runChat(text);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      this.chat.setIsGenerating(false);
    }
  }

  async handleQuickAction(actionPrompt: string): Promise<void> {
    if (this.chat.isGenerating()) return;
    this.error.set(null);
    this.chat.addMessage({ role: 'user', content: actionPrompt });
    this.chat.setIsGenerating(true);

    try {
      await this.runChat(actionPrompt);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      this.chat.setIsGenerating(false);
    }
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void this.handleSend();
    }
  }
}
