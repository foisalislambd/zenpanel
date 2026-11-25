import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
  DestroyRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { adminNavItems } from '@/app/core/admin.config';
import { ThemeService } from '@/app/core/theme.service';
import { buildPaletteCommands, rankPaletteCommands, type PaletteCommand } from '@/app/lib/command-palette';
import { activateDialog } from '@/app/lib/dialog';
import { IconComponent } from '@/app/shared/icon.component';

const listId = 'zp-command-palette';

/** ⌘K / Ctrl+K quick navigation across admin pages and common actions. */
@Component({
  selector: 'app-admin-command-palette',
  imports: [IconComponent],
  template: `
    <div #root class="admin-portal fixed inset-0 z-[60] flex items-start justify-center p-3 pt-[10vh] sm:p-4">
      <div
        class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
        aria-hidden="true"
        (click)="closed.emit()"
      ></div>
      <div
        #panel
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        tabindex="-1"
        class="admin-dialog relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none sm:mt-[12vh] sm:self-start dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
          <app-icon name="search" [size]="20" class="text-gray-400" />
          <input
            [value]="query()"
            data-autofocus
            placeholder="Search pages and actions…"
            class="h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
            role="combobox"
            aria-expanded="true"
            [attr.aria-controls]="listId"
            [attr.aria-activedescendant]="results().length ? listId + '-' + activeIndex() : null"
            aria-autocomplete="list"
            aria-label="Search pages and actions"
            (input)="onInput($any($event.target).value)"
            (keydown)="onKeyDown($event)"
          />
          <kbd
            class="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:block dark:border-gray-700 dark:text-gray-400"
            >Esc</kbd
          >
        </div>
        <ul
          [id]="listId"
          role="listbox"
          aria-label="Results"
          class="admin-scrollbar max-h-[min(60dvh,420px)] overflow-y-auto p-2"
        >
          @if (results().length === 0) {
            <li class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              No results for “{{ query() }}”
            </li>
          }
          @for (c of results(); track c.id; let index = $index) {
            <li role="presentation">
              @if (results()[index - 1]?.group !== c.group) {
                <p
                  class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
                >
                  {{ c.group }}
                </p>
              }
              <div
                [id]="listId + '-' + index"
                role="option"
                tabindex="-1"
                [attr.aria-selected]="index === activeIndex()"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                [class]="
                  index === activeIndex()
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-gray-700 dark:text-gray-300'
                "
                (mousemove)="active.set(index)"
                (click)="run(c)"
              >
                <app-icon [name]="c.icon" [size]="16" />
                <span class="flex-1 truncate font-medium">{{ c.label }}</span>
                @if (c.hint) {
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ c.hint }}</span>
                }
                @if (index === activeIndex()) {
                  <app-icon name="corner-down-left" [size]="14" class="opacity-70" />
                }
              </div>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class AdminCommandPaletteComponent {
  readonly closed = output<void>();
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  readonly listId = listId;
  readonly query = signal('');
  readonly active = signal(0);

  readonly commands = computed(() =>
    buildPaletteCommands<string>(adminNavItems, { plus: 'plus', moon: 'moon' }, this.themeService.theme() === 'dark'),
  );
  readonly results = computed(() => rankPaletteCommands(this.commands(), this.query()));
  readonly activeIndex = computed(() => Math.min(this.active(), Math.max(0, this.results().length - 1)));

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.root().nativeElement;
      document.body.appendChild(root);
      const release = activateDialog(this.panel().nativeElement, () => this.closed.emit());
      destroyRef.onDestroy(() => {
        release();
        root.remove();
      });
    });
    effect(() => {
      const index = this.activeIndex();
      queueMicrotask(() => document.getElementById(`${listId}-${index}`)?.scrollIntoView({ block: 'nearest' }));
    });
  }

  onInput(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  run(command: PaletteCommand<string>): void {
    this.closed.emit();
    if (command.action === 'toggle-theme') this.themeService.toggle();
    else if (command.href) void this.router.navigateByUrl(command.href);
  }

  onKeyDown(e: KeyboardEvent): void {
    const count = Math.max(1, this.results().length);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.active.set((this.activeIndex() + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.active.set((this.activeIndex() - 1 + count) % count);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const command = this.results()[this.activeIndex()];
      if (command) this.run(command);
    }
  }
}
