import { reactive } from "vue";

export type AdminToastVariant = "success" | "error" | "info";

export type AdminToastInput = {
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  /** Auto-dismiss after ms (default 4000). Pass 0 to keep until closed. */
  duration?: number;
};

export type AdminToastItem = AdminToastInput & { id: number; variant: AdminToastVariant };

const toasts = reactive<AdminToastItem[]>([]);
let nextId = 1;

function dismiss(id: number) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index >= 0) toasts.splice(index, 1);
}

function toast({ variant = "success", duration = 4000, ...rest }: AdminToastInput) {
  const id = nextId++;
  toasts.push({ id, variant, duration, ...rest });
  while (toasts.length > 4) toasts.shift();
  if (duration > 0) window.setTimeout(() => dismiss(id), duration);
}

/** App-wide toast notifications, rendered by <AdminToastHost />. */
export function useAdminToast() {
  return { toasts, toast, dismiss };
}
