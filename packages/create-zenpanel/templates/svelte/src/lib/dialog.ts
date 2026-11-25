/**
 * Framework-agnostic dialog behaviour: focus trap, Escape to close,
 * body scroll lock and focus restore. Call `activate` when the panel is
 * mounted and run the returned cleanup when it closes.
 */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function activateDialog(
  panel: HTMLElement,
  onClose: () => void,
  initialFocus?: HTMLElement | null,
): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const first =
    initialFocus ??
    panel.querySelector<HTMLElement>("[data-autofocus]") ??
    panel.querySelector<HTMLElement>(FOCUSABLE);
  (first ?? panel).focus();

  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
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
}

/** Menu keyboard support: arrows move between `[role=menuitem]`, Escape/Tab close. */
export function activateMenu(menu: HTMLElement, onClose: (restoreFocus: boolean) => void): () => void {
  const items = () => [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')];
  items()[0]?.focus();
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose(true);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const list = items();
      const index = list.indexOf(document.activeElement as HTMLElement);
      const next =
        e.key === "ArrowDown" ? (index + 1) % list.length : (index - 1 + list.length) % list.length;
      list[next]?.focus();
    }
    if (e.key === "Tab") onClose(false);
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}

/** Roving-tabindex helper for tablists: returns the next index for a key, or -1. */
export function nextTabIndex(key: string, index: number, count: number): number {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
}
