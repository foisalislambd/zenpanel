export type AdminToastVariant = "success" | "error" | "info";

export type AdminToastInput = {
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  /** Auto-dismiss after ms (default 4000). Pass 0 to keep until closed. */
  duration?: number;
};

export type AdminToastItem = AdminToastInput & { id: number; variant: AdminToastVariant };

const state = $state<{ items: AdminToastItem[] }>({ items: [] });
let nextId = 1;

function dismiss(id: number) {
  state.items = state.items.filter((t) => t.id !== id);
}

function toast({ variant = "success", duration = 4000, ...rest }: AdminToastInput) {
  const id = nextId++;
  state.items = [...state.items, { id, variant, duration, ...rest }].slice(-4);
  if (duration > 0) window.setTimeout(() => dismiss(id), duration);
}

/** App-wide toast notifications, rendered by <AdminToastHost />. */
export function useAdminToast() {
  return {
    get toasts() {
      return state.items;
    },
    toast,
    dismiss,
  };
}
