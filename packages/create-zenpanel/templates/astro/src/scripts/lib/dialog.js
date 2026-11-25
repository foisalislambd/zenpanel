// Generated from the shared ZenPanel TypeScript core - edit freely.
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function activateDialog(panel, onClose, initialFocus) {
  const previouslyFocused = document.activeElement;
  const first = initialFocus ?? panel.querySelector("[data-autofocus]") ?? panel.querySelector(FOCUSABLE);
  (first ?? panel).focus();
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
      (n) => n.offsetParent !== null
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
function activateMenu(menu, onClose) {
  const items = () => [...menu.querySelectorAll('[role="menuitem"]')];
  items()[0]?.focus();
  function onKeyDown(e) {
    if (e.key === "Escape") {
      onClose(true);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const list = items();
      const index = list.indexOf(document.activeElement);
      const next = e.key === "ArrowDown" ? (index + 1) % list.length : (index - 1 + list.length) % list.length;
      list[next]?.focus();
    }
    if (e.key === "Tab") onClose(false);
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}
function nextTabIndex(key, index, count) {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
}
export {
  activateDialog,
  activateMenu,
  nextTabIndex
};
