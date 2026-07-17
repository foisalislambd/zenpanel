import { Component, Input } from '@angular/core';

type MarkdownLine = { text: string; isLast: boolean };
type MarkdownPart = { bold: boolean; lines: MarkdownLine[] };

/** Lightweight assistant text — supports **bold** and line breaks without extra deps. */
@Component({
  selector: 'app-admin-chat-markdown',
  template: `
    <div class="admin-chat-markdown text-sm leading-relaxed">
      @for (part of parts; track $index) {
        @if (part.bold) {
          <strong class="font-semibold">{{ part.lines[0]?.text }}</strong>
        } @else {
          @for (line of part.lines; track $index) {
            {{ line.text }}
            @if (!line.isLast) {
              <br />
            }
          }
        }
      }
    </div>
  `,
})
export class AdminChatMarkdownComponent {
  parts: MarkdownPart[] = [];

  @Input({ required: true })
  set content(value: string) {
    this.parts = value.split(/(\*\*[^*]+\*\*)/g).map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { bold: true, lines: [{ text: part.slice(2, -2), isLast: true }] };
      }
      const lines = part.split('\n');
      return {
        bold: false,
        lines: lines.map((text, i) => ({ text, isLast: i === lines.length - 1 })),
      };
    });
  }
}
