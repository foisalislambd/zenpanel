import { useAdminSidebar } from "@/context/admin-sidebar-context";
import { createEffect, onCleanup, Show } from "solid-js";

export function AdminBackdrop() {
  const { isMobileOpen, isDesktop, closeMobileSidebar } = useAdminSidebar();

  createEffect(() => {
    if (!isMobileOpen() || isDesktop()) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMobileSidebar();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <Show when={isMobileOpen() && !isDesktop()}>
      <button
        type="button"
        class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-[2px] lg:hidden"
        onClick={closeMobileSidebar}
        aria-label="Close navigation"
      />
    </Show>
  );
}
