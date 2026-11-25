import {
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { activateDialog } from '@/app/lib/dialog';
import { IconComponent } from '@/app/shared/icon.component';

let nextDialogId = 0;
const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' } as const;

/**
 * Accessible modal / drawer: focus trap, Escape to close, scroll lock,
 * focus restored to the trigger on close. Rendered at the end of <body>.
 * Mark the element to focus first with `data-autofocus`.
 * Project body content, plus buttons with the `dialogFooter` attribute.
 */
@Component({
  selector: 'app-admin-dialog',
  imports: [IconComponent],
  template: `
    @if (open()) {
      <div
        #root
        class="admin-portal fixed inset-0 z-[60] flex"
        [class]="
          placement() === 'center'
            ? 'items-end justify-center p-0 sm:items-center sm:p-4'
            : 'justify-end'
        "
      >
        <div
          class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
          aria-hidden="true"
          (click)="closed.emit()"
        ></div>
        <div
          #panel
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="description() ? descId : null"
          tabindex="-1"
          class="relative flex w-full flex-col bg-white shadow-2xl outline-none dark:bg-gray-900"
          [class]="
            placement() === 'center'
              ? 'admin-dialog max-h-[92dvh] rounded-t-2xl border border-gray-200 sm:rounded-2xl dark:border-gray-800 ' +
                widths[size()]
              : 'admin-drawer h-full max-w-md border-l border-gray-200 dark:border-gray-800'
          "
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800"
          >
            <div class="min-w-0">
              <h2 [id]="titleId" class="truncate text-lg font-semibold text-gray-900 dark:text-white">
                {{ title() }}
              </h2>
              @if (description()) {
                <p [id]="descId" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {{ description() }}
                </p>
              }
            </div>
            <button
              type="button"
              class="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200"
              aria-label="Close"
              (click)="closed.emit()"
            >
              <app-icon name="x" [size]="20" />
            </button>
          </div>
          <div class="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <ng-content />
          </div>
          <div
            class="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 empty:hidden sm:flex-row sm:justify-end dark:border-gray-800"
          ><ng-content select="[dialogFooter]" /></div>
        </div>
      </div>
    }
  `,
})
export class AdminDialogComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  /** `center` = modal, `right` = side drawer */
  readonly placement = input<'center' | 'right'>('center');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly closed = output<void>();

  readonly widths = widths;
  private readonly uid = `zp-dialog-${nextDialogId++}`;
  readonly titleId = `${this.uid}-title`;
  readonly descId = `${this.uid}-desc`;

  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect((onCleanup) => {
      const root = this.root()?.nativeElement;
      const panel = this.panel()?.nativeElement;
      if (!root || !panel) return;
      // Portal to <body> so no ancestor overflow / transform can clip the overlay.
      document.body.appendChild(root);
      const release = activateDialog(panel, () => this.closed.emit());
      onCleanup(() => {
        release();
        root.remove();
      });
    });
  }
}
