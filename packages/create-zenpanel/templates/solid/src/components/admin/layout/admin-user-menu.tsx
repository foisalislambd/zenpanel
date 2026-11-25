import { useAdminAuth } from "@/components/admin/auth/admin-auth-provider";
import { activateMenu } from "@/lib/dialog";
import { ChevronDown, LogOut, Settings, SlidersHorizontal } from "lucide-solid";
import { A, useNavigate } from "@solidjs/router";
import { createSignal, createUniqueId, onCleanup, onMount, Show } from "solid-js";

const itemClass =
  "flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5";

export function AdminUserMenu() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  const menuId = createUniqueId();
  let containerRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;

  onMount(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef && !containerRef.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    onCleanup(() => document.removeEventListener("mousedown", handleClick));
  });

  function menuRef(el: HTMLDivElement) {
    queueMicrotask(() => {
      const release = activateMenu(el, (restoreFocus) => {
        setOpen(false);
        if (restoreFocus) triggerRef?.focus();
      });
      onCleanup(release);
    });
  }

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div class="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        class="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pr-2 pl-1 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-white/5"
        aria-expanded={open()}
        aria-haspopup="menu"
        aria-controls={open() ? menuId : undefined}
        aria-label={`Account menu for ${admin()?.username ?? "admin"}`}
      >
        <span class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-xs font-semibold text-white">
          {admin()?.username?.charAt(0)?.toUpperCase() ?? "A"}
        </span>
        <span class="hidden min-w-0 text-left md:block">
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-white">
            {admin()?.username ?? "admin"}
          </span>
        </span>
        <ChevronDown
          class={`hidden h-4 w-4 shrink-0 text-gray-500 transition md:block ${open() ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <Show when={open()}>
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Account"
          class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">{admin()?.username}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-400">{admin()?.email}</p>
          </div>
          <A href="/admin/settings" role="menuitem" onClick={() => setOpen(false)} class={itemClass}>
            <Settings class="h-4 w-4" aria-hidden />
            Account settings
          </A>
          <A
            href="/admin/settings?tab=preferences"
            role="menuitem"
            onClick={() => setOpen(false)}
            class={itemClass}
          >
            <SlidersHorizontal class="h-4 w-4" aria-hidden />
            Preferences
          </A>
          <div class="my-1 h-px bg-gray-100 dark:bg-gray-800" role="separator" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 focus-visible:bg-error-50 focus-visible:outline-none dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10"
          >
            <LogOut class="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </Show>
    </div>
  );
}
