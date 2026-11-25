"use client";

import { cn } from "@/lib/cn";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AdminToastVariant = "success" | "error" | "info";

export type AdminToastInput = {
  title: string;
  description?: string;
  variant?: AdminToastVariant;
  /** Auto-dismiss after ms (default 4000). Pass 0 to keep until closed. */
  duration?: number;
};

type ToastItem = AdminToastInput & { id: number; variant: AdminToastVariant };

type ToastContextValue = {
  toast: (input: AdminToastInput) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const iconColors: Record<AdminToastVariant, string> = {
  success: "text-success-600 dark:text-success-500",
  error: "text-error-500",
  info: "text-brand-500 dark:text-brand-400",
};

/** App-wide toast notifications (bottom-right, polite live region). */
export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ variant = "success", duration = 4000, ...rest }: AdminToastInput) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, variant, duration, ...rest }]);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5"
      >
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <div
              key={t.id}
              role={t.variant === "error" ? "alert" : "status"}
              className="admin-toast pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg sm:w-[360px] dark:border-gray-700 dark:bg-gray-900"
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColors[t.variant])} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useAdminToast must be used within AdminToastProvider");
  return ctx;
}
