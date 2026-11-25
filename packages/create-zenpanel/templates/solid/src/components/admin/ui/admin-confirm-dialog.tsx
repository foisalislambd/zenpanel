import { AdminDialog } from "@/components/admin/ui/admin-dialog";
import { cn } from "@/lib/cn";
import { AlertTriangle } from "lucide-solid";
import { Show, type JSX } from "solid-js";

/** Confirmation step for destructive actions (delete, ban). Focuses Cancel first. */
export function AdminConfirmDialog(props: {
  open: boolean;
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  children?: JSX.Element;
}) {
  const danger = () => (props.tone ?? "danger") === "danger";
  return (
    <AdminDialog
      open={props.open}
      title={props.title}
      size="sm"
      onClose={props.onCancel}
      footer={
        <>
          <button type="button" data-autofocus class="admin-btn admin-btn-secondary" onClick={() => props.onCancel()}>
            {props.cancelLabel ?? "Cancel"}
          </button>
          <button
            type="button"
            class={cn("admin-btn", danger() ? "admin-btn-danger" : "admin-btn-primary")}
            onClick={() => props.onConfirm()}
          >
            {props.confirmLabel ?? "Delete"}
          </button>
        </>
      }
    >
      <div class="flex gap-3">
        <Show when={danger()}>
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/15">
            <AlertTriangle class="h-5 w-5" aria-hidden />
          </span>
        </Show>
        <div class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{props.children}</div>
      </div>
    </AdminDialog>
  );
}
