import { Component, ElementRef, afterNextRender, inject, DestroyRef } from '@angular/core';
import { ToastService } from '@/app/core/toast.service';
import { IconComponent } from '@/app/shared/icon.component';

const icons = { success: 'check-circle-2', error: 'alert-circle', info: 'info' } as const;
const iconColors = {
  success: 'text-success-600 dark:text-success-500',
  error: 'text-error-500',
  info: 'text-brand-500 dark:text-brand-400',
} as const;

@Component({
  selector: 'app-admin-toast-host',
  imports: [IconComponent],
  template: `
    <div
      #host
      aria-live="polite"
      aria-atomic="false"
      class="admin-portal pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5"
    >
      @for (t of toaster.toasts(); track t.id) {
        <div
          [attr.role]="t.variant === 'error' ? 'alert' : 'status'"
          class="admin-toast pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg sm:w-[360px] dark:border-gray-700 dark:bg-gray-900"
        >
          <app-icon [name]="icons[t.variant]" [size]="20" class="mt-0.5" [class]="iconColors[t.variant]" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t.title }}</p>
            @if (t.description) {
              <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ t.description }}</p>
            }
          </div>
          <button
            type="button"
            class="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label="Dismiss notification"
            (click)="toaster.dismiss(t.id)"
          >
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
})
export class AdminToastHostComponent {
  readonly toaster = inject(ToastService);
  readonly icons = icons;
  readonly iconColors = iconColors;

  constructor() {
    const el = inject(ElementRef<HTMLElement>);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const region = (el.nativeElement as HTMLElement).firstElementChild;
      if (!region) return;
      document.body.appendChild(region);
      destroyRef.onDestroy(() => region.remove());
    });
  }
}
