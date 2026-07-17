declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

export function refreshIcons(): void {
  window.lucide?.createIcons();
}
