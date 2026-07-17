import { Injectable, signal } from '@angular/core';

export const CHAT_PANEL_WIDTH = 400;
export const CHAT_DESKTOP_BREAKPOINT = 1024;

export type AdminChatMessage = {
  id: string;
  role: 'user' | 'assistant';
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

let messageSeq = 0;
function nextId(): string {
  messageSeq += 1;
  return `msg-${messageSeq}-${Date.now()}`;
}

@Injectable({ providedIn: 'root' })
export class AdminChatPanelService {
  readonly isOpen = signal(false);
  readonly isDesktop = signal(
    typeof window !== 'undefined'
      ? window.matchMedia(`(min-width: ${CHAT_DESKTOP_BREAKPOINT}px)`).matches
      : false,
  );
  readonly messages = signal<AdminChatMessage[]>([]);
  readonly isGenerating = signal(false);
  readonly pageContext = signal<AdminChatPageContext | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia(`(min-width: ${CHAT_DESKTOP_BREAKPOINT}px)`);
      const onChange = () => this.isDesktop.set(mq.matches);
      mq.addEventListener('change', onChange);
    }
  }

  openPanel(): void {
    this.isOpen.set(true);
  }

  closePanel(): void {
    this.isOpen.set(false);
  }

  togglePanel(): void {
    this.isOpen.update((v) => !v);
  }

  setPageContext(ctx: AdminChatPageContext | null): void {
    this.pageContext.set(ctx);
  }

  addMessage(msg: Omit<AdminChatMessage, 'id'>): string {
    const id = nextId();
    this.messages.update((prev) => [...prev, { ...msg, id }]);
    return id;
  }

  clearMessages(): void {
    this.messages.set([]);
  }

  setIsGenerating(value: boolean): void {
    this.isGenerating.set(value);
  }
}
