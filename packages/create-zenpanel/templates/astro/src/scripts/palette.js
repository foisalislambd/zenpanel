/** Ctrl/⌘K command palette: jump to pages, create items, toggle theme. */
import { adminNavItems } from "./config.js";
import { buildPaletteCommands, rankPaletteCommands } from "./lib/command-palette.js";
import { activateDialog } from "./lib/dialog.js";
import { getTheme, toggleTheme } from "./theme.js";
import { escapeHtml, icon, refreshIcons } from "./utils.js";

let openInstance = null;

/** @param {{ onThemeChange?: () => void }} [options] */
export function openCommandPalette(options = {}) {
  if (openInstance) return openInstance;
  const listId = "zp-palette-list";
  const commands = buildPaletteCommands(adminNavItems, { plus: "plus", moon: getTheme() === "dark" ? "sun" : "moon" }, getTheme() === "dark");
  let query = "";
  let active = 0;
  let results = commands;

  const root = document.createElement("div");
  root.className = "admin-portal fixed inset-0 z-[60] flex items-start justify-center p-3 pt-[10vh] sm:p-4";
  root.innerHTML = `
    <div class="admin-overlay absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]" aria-hidden="true" data-close></div>
    <div role="dialog" aria-modal="true" aria-label="Search" tabindex="-1"
      class="admin-dialog relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none sm:mt-[12vh] sm:self-start dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
        ${icon("search", "h-5 w-5 text-gray-400")}
        <input data-autofocus placeholder="Search pages and actions…" aria-label="Search pages and actions"
          role="combobox" aria-expanded="true" aria-controls="${listId}" aria-autocomplete="list"
          class="h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white" />
        <kbd class="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:block dark:border-gray-700 dark:text-gray-400">Esc</kbd>
      </div>
      <ul id="${listId}" role="listbox" aria-label="Results" class="admin-scrollbar max-h-[min(60dvh,420px)] overflow-y-auto p-2"></ul>
    </div>`;
  document.body.appendChild(root);
  const panel = root.querySelector('[role="dialog"]');
  const input = root.querySelector("input");
  const list = root.querySelector("ul");

  function paint() {
    results = rankPaletteCommands(commands, query);
    active = Math.min(active, Math.max(0, results.length - 1));
    input.setAttribute("aria-activedescendant", results.length ? `${listId}-${active}` : "");
    list.innerHTML = results.length
      ? results
          .map((c, i) => {
            const heading =
              results[i - 1]?.group !== c.group
                ? `<p class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">${escapeHtml(c.group)}</p>`
                : "";
            return `
            <li role="presentation">
              ${heading}
              <div id="${listId}-${i}" role="option" tabindex="-1" aria-selected="${i === active}" data-index="${i}"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  i === active ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-gray-700 dark:text-gray-300"
                }">
                ${icon(c.icon, "h-4 w-4")}
                <span class="flex-1 truncate font-medium">${escapeHtml(c.label)}</span>
                ${c.hint ? `<span class="text-xs text-gray-500 dark:text-gray-400">${escapeHtml(c.hint)}</span>` : ""}
                ${i === active ? icon("corner-down-left", "h-3.5 w-3.5 opacity-70") : ""}
              </div>
            </li>`;
          })
          .join("")
      : `<li class="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No results for “${escapeHtml(query)}”</li>`;
    refreshIcons();
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }

  function close() {
    release();
    root.remove();
    openInstance = null;
  }

  function run(c) {
    if (!c) return;
    close();
    if (c.action === "toggle-theme") {
      toggleTheme();
      options.onThemeChange?.();
    } else if (c.href) {
      window.location.assign(c.href);
    }
  }

  input.addEventListener("input", () => {
    query = input.value;
    active = 0;
    paint();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = results.length || 1;
      active = e.key === "ArrowDown" ? (active + 1) % n : (active - 1 + n) % n;
      paint();
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  });
  list.addEventListener("mousemove", (e) => {
    const el = e.target.closest("[data-index]");
    if (el && Number(el.dataset.index) !== active) {
      active = Number(el.dataset.index);
      paint();
    }
  });
  list.addEventListener("click", (e) => {
    const el = e.target.closest("[data-index]");
    if (el) run(results[Number(el.dataset.index)]);
  });
  root.querySelector("[data-close]").addEventListener("click", close);

  paint();
  const release = activateDialog(panel, close, input);
  openInstance = { close };
  return openInstance;
}

export function toggleCommandPalette(options) {
  if (openInstance) openInstance.close();
  else openCommandPalette(options);
}
