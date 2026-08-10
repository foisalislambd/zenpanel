import { Plus } from "lucide-solid";

type Props = {
  label?: string;
  onClick?: () => void;
  /** When true (default for shell), button is disabled until API is wired */
  pending?: boolean;
};

/**
 * Primary “Add new” control for resource/list pages.
 * Pass `onClick` after connecting your API to enable the button.
 */
export function AdminAddButton(props: Props) {
  const label = () => props.label ?? "Add new";
  const pending = () => props.pending ?? false;
  const enabled = () => Boolean(props.onClick) && !pending();

  return (
    <button
      type="button"
      onClick={() => {
        if (enabled()) props.onClick?.();
      }}
      disabled={!enabled()}
      title={enabled() ? label() : "Available after you connect your API"}
      class={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white ${
        enabled()
          ? "bg-brand-500 shadow-sm shadow-brand-500/20 hover:bg-brand-600"
          : "cursor-not-allowed bg-brand-500/50 text-white/90"
      }`}
    >
      <Plus class="h-4 w-4" aria-hidden />
      {label()}
    </button>
  );
}
