import { useTheme } from "@/components/theme/theme-provider";
import { adminNavItems } from "@/config/admin.config";
import { cn } from "@/lib/cn";
import { buildPaletteCommands, rankPaletteCommands, type PaletteCommand } from "@/lib/command-palette";
import { activateDialog } from "@/lib/dialog";
import { useNavigate } from "@solidjs/router";
import { CornerDownLeft, Moon, Plus, Search, type LucideIcon } from "lucide-solid";
import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, onMount, Show } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

/** ⌘K / Ctrl+K quick navigation across admin pages and common actions. */
export function AdminCommandPalette(props: { onClose: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const listId = createUniqueId();
  const [query, setQuery] = createSignal("");
  const [active, setActive] = createSignal(0);
  let panel: HTMLDivElement | undefined;

  const commands = createMemo(() =>
    buildPaletteCommands<LucideIcon>(adminNavItems, { plus: Plus, moon: Moon }, resolvedTheme() === "dark"),
  );
  const results = createMemo(() => rankPaletteCommands(commands(), query()));
  const activeIndex = createMemo(() => Math.min(active(), Math.max(0, results().length - 1)));

  function run(command: PaletteCommand<LucideIcon>) {
    props.onClose();
    if (command.action === "toggle-theme") setTheme(resolvedTheme() === "dark" ? "light" : "dark");
    else if (command.href) navigate(command.href);
  }

  function onKeyDown(e: KeyboardEvent) {
    const count = Math.max(1, results().length);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex() + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex() - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const command = results()[activeIndex()];
      if (command) run(command);
    }
  }

  createEffect(() => {
    document.getElementById(`${listId}-${activeIndex()}`)?.scrollIntoView({ block: "nearest" });
  });

  onMount(() => {
    if (!panel) return;
    onCleanup(activateDialog(panel, () => props.onClose()));
  });

  return (
    <Portal>
      <div class="admin-portal fixed inset-0 z-[60] flex items-start justify-center p-3 pt-[10vh] sm:p-4">
        <div
          class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
          aria-hidden="true"
          onClick={() => props.onClose()}
        />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          tabindex="-1"
          class="admin-dialog relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none sm:mt-[12vh] sm:self-start dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
            <Search class="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
            <input
              value={query()}
              data-autofocus
              placeholder="Search pages and actions…"
              class="h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results().length ? `${listId}-${activeIndex()}` : undefined}
              aria-autocomplete="list"
              aria-label="Search pages and actions"
              onInput={(e) => {
                setQuery(e.currentTarget.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd class="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:block dark:border-gray-700 dark:text-gray-400">
              Esc
            </kbd>
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-label="Results"
            class="admin-scrollbar max-h-[min(60dvh,420px)] overflow-y-auto p-2"
          >
            <Show when={results().length === 0}>
              <li class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No results for “{query()}”
              </li>
            </Show>
            <For each={results()}>
              {(c, index) => (
                <li role="presentation">
                  <Show when={results()[index() - 1]?.group !== c.group}>
                    <p class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      {c.group}
                    </p>
                  </Show>
                  <div
                    id={`${listId}-${index()}`}
                    role="option"
                    tabindex="-1"
                    aria-selected={index() === activeIndex()}
                    class={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                      index() === activeIndex()
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                    onMouseMove={() => setActive(index())}
                    onClick={() => run(c)}
                  >
                    <Dynamic component={c.icon} class="h-4 w-4 shrink-0" aria-hidden />
                    <span class="flex-1 truncate font-medium">{c.label}</span>
                    <Show when={c.hint}>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{c.hint}</span>
                    </Show>
                    <Show when={index() === activeIndex()}>
                      <CornerDownLeft class="h-3.5 w-3.5 opacity-70" aria-hidden />
                    </Show>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </Portal>
  );
}
