/** Svelte action: move the node to <body> (modals, toasts) and remove it on destroy. */
export function portal(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      node.remove();
    },
  };
}
