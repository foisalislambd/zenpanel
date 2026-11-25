"use client";

import { cn } from "@/lib/cn";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function useDialogBehavior(
  open: boolean,
  panelRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
  initialFocusRef?: React.RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first =
      initialFocusRef?.current ??
      panel?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, panelRef, initialFocusRef]);
}

type AdminDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** `center` = modal, `right` = side drawer */
  placement?: "center" | "right";
  size?: "sm" | "md" | "lg";
  /** Element to focus first (defaults to the first focusable field). */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Accessible modal / drawer: focus trap, Escape to close, scroll lock,
 * focus restored to the trigger on close.
 */
export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  placement = "center",
  size = "md",
  initialFocusRef,
}: AdminDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useDialogBehavior(open, panelRef, onClose, initialFocusRef);

  // Portals need `document`; dialogs only open on the client.
  if (!open || typeof document === "undefined") return null;

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" } as const;

  return createPortal(
    <div
      className={cn(
        "admin-portal fixed inset-0 z-[60] flex",
        placement === "center" ? "items-end justify-center p-0 sm:items-center sm:p-4" : "justify-end",
      )}
    >
      <div
        className="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col bg-white shadow-2xl outline-none dark:bg-gray-900",
          placement === "center"
            ? cn(
                "admin-dialog max-h-[92dvh] rounded-t-2xl border border-gray-200 sm:rounded-2xl dark:border-gray-800",
                widths[size],
              )
            : "admin-drawer h-full max-w-md border-l border-gray-200 dark:border-gray-800",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <div id={descId} className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation step for destructive actions (delete, ban, sign out everywhere). */
export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AdminDialog
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      initialFocusRef={cancelRef}
      footer={
        <>
          <button ref={cancelRef} type="button" onClick={onCancel} className="admin-btn admin-btn-secondary">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn("admin-btn", tone === "danger" ? "admin-btn-danger" : "admin-btn-primary")}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        {tone === "danger" && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</div>
      </div>
    </AdminDialog>
  );
}

/** Bare modal surface (no header/footer) - used by the command palette. */
export function AdminDialogShell({
  onClose,
  label,
  children,
  className,
  initialFocusRef,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(true, panelRef, onClose, initialFocusRef);
  return createPortal(
    <div className="admin-portal fixed inset-0 z-[60] flex items-start justify-center p-3 pt-[10vh] sm:p-4">
      <div className="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "admin-dialog relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none dark:border-gray-800 dark:bg-gray-900",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
