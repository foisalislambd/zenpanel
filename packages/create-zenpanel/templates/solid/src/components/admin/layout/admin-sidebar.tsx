import { adminConfig, adminNavItems } from "@/config/admin.config";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useAdminSidebar,
} from "@/context/admin-sidebar-context";
import { isAdminNavActive, isExternalUrl } from "@/lib/admin-nav";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-solid";
import { A, useLocation } from "@solidjs/router";
import { createEffect, createMemo, For, Show } from "solid-js";

export function AdminSidebar() {
  const location = useLocation();
  const { isExpanded, isMobileOpen, isDesktop, toggleSidebar, closeMobileSidebar } =
    useAdminSidebar();

  createEffect(() => {
    location.pathname;
    closeMobileSidebar();
  });

  const showLabels = createMemo(() => !isDesktop() || isExpanded() || isMobileOpen());
  const desktopWidth = createMemo(() =>
    isExpanded() ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
  );
  const mobileClosed = createMemo(() => !isDesktop() && !isMobileOpen());
  const { brand } = adminConfig;
  const siteUrl = brand.siteUrl || "/";
  const navGroups = createMemo(() => {
    const groups: { section: string; items: typeof adminNavItems }[] = [];
    for (const item of adminNavItems) {
      const section = item.section || "Menu";
      const last = groups[groups.length - 1];
      if (last?.section === section) last.items.push(item);
      else groups.push({ section, items: [item] });
    }
    return groups;
  });

  return (
    <aside
      style={{
        width: isDesktop() ? `${desktopWidth()}px` : `${Math.min(320, SIDEBAR_WIDTH_EXPANDED)}px`,
      }}
      class={`fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        isMobileOpen() ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      aria-label="Admin navigation"
      aria-hidden={mobileClosed() || undefined}
      inert={mobileClosed() || undefined}
    >
      <div class="admin-topbar flex items-center gap-2 px-3">
        <A
          href="/admin"
          onClick={closeMobileSidebar}
          class={`flex min-w-0 flex-1 items-center gap-2 ${!showLabels() ? "justify-center" : ""}`}
        >
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            {brand.letter}
          </span>
          <Show when={showLabels()}>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {brand.name}
              </p>
            </div>
          </Show>
        </A>
        <Show when={!isDesktop()}>
          <button
            type="button"
            onClick={closeMobileSidebar}
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X class="h-5 w-5" />
          </button>
        </Show>
      </div>

      <nav class="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto px-2.5 py-3">
        <For each={navGroups()}>
          {(group, index) => (
            <div class="flex flex-col gap-1">
              <Show
                when={showLabels()}
                fallback={
                  index() > 0 ? <div class="mx-2 my-1 h-px bg-gray-200 dark:bg-gray-800" /> : null
                }
              >
                <p class="px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                  {group.section}
                </p>
              </Show>
              <For each={group.items}>
                {(item) => {
                  const active = createMemo(() => isAdminNavActive(location.pathname, item.href));
                  const Icon = item.icon;

                  return (
                    <A
                      href={item.href}
                      onClick={closeMobileSidebar}
                      title={!showLabels() ? item.name : undefined}
                      aria-current={active() ? "page" : undefined}
                      class={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                        active()
                          ? "bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8"
                      } ${!showLabels() ? "justify-center px-0" : ""}`}
                    >
                      <Icon
                        class={`h-[18px] w-[18px] shrink-0 ${
                          active()
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400"
                        }`}
                      />
                      <Show when={showLabels()}>
                        <span class="truncate">{item.name}</span>
                      </Show>
                    </A>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </nav>

      <div class="shrink-0 space-y-1 border-t border-gray-200 p-3 dark:border-gray-800">
        <Show
          when={isExternalUrl(siteUrl)}
          fallback={
            <A
              href={siteUrl}
              class={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 ${!showLabels() ? "justify-center" : ""}`}
              title={!showLabels() ? "View site" : undefined}
            >
              <ExternalLink class="h-5 w-5 shrink-0" />
              <Show when={showLabels()}>
                <span>View site</span>
              </Show>
            </A>
          }
        >
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            class={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/8 ${!showLabels() ? "justify-center" : ""}`}
            title={!showLabels() ? "View site" : undefined}
          >
            <ExternalLink class="h-5 w-5 shrink-0" />
            <Show when={showLabels()}>
              <span>View site</span>
            </Show>
          </a>
        </Show>

        <Show when={isDesktop()}>
          <button
            type="button"
            onClick={toggleSidebar}
            class={`mt-2 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5 ${!showLabels() ? "justify-center" : ""}`}
            aria-label={isExpanded() ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Show when={isExpanded()} fallback={<ChevronRight class="h-5 w-5 shrink-0" />}>
              <ChevronLeft class="h-5 w-5 shrink-0" />
              <span>Collapse</span>
            </Show>
          </button>
        </Show>
      </div>
    </aside>
  );
}
