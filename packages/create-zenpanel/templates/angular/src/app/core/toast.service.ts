import { Injectable, signal } from '@angular/core';

export type AdminToastVariant = 'success' | 'error' | 'info';

export type AdminToastInput = {
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  /** Auto-dismiss after ms (default 4000). Pass 0 to keep until closed. */
  duration?: number;
};

export type AdminToastItem = AdminToastInput & { id: number; variant: AdminToastVariant };

/** App-wide toast notifications, rendered by <app-admin-toast-host />. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<AdminToastItem[]>([]);
  private nextId = 1;

  toast({ variant = 'success', duration = 4000, ...rest }: AdminToastInput): void {
    const id = this.nextId++;
    this.toasts.update((items) => [...items, { id, variant, duration, ...rest }].slice(-4));
    if (duration > 0) window.setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((items) => items.filter((t) => t.id !== id));
  }
}
