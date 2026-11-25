"use client";

import { adminNavItems } from "@/config/admin.config";
import { AdminDialogShell } from "@/components/admin/ui/admin-dialog";
import { cn } from "@/lib/cn";
import { CornerDownLeft, Moon, Plus, Search, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type Command = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
};

const CREATE_TARGETS: Array<{ label: string; href: string }> = [
  { label: "New project", href: "/admin/projects?new=1" },
  { label: "New service", href: "/admin/services?new=1" },
  { label: "New blog post", href: "/admin/blog?new=1" },
  { label: "New product", href: "/admin/products?new=1" },
  { label: "New category", href: "/admin/categories?new=1" },
  { label: "Invite user", href: "/admin/users?new=1" },
];

type Props = { open: boolean; onClose: () => void };

/** ⌘K / Ctrl+K quick navigation across admin pages and common actions. */
export function AdminCommandPalette({ open, onClose }: Props) {
  if (!open) return null;
  return <PaletteBody onClose={onClose} />;
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      onClose();
      router.push(href);
    };
    return [
      ...adminNavItems.map((item) => ({
        id: `nav-${item.href}`,
        label: item.name,
        group: "Pages",
        hint: item.section,
        icon: item.icon,
        keywords: item.description,
        run: go(item.href),
      })),
      ...CREATE_TARGETS.map((t) => ({
        id: `new-${t.href}`,
        label: t.label,
        group: "Actions",
        icon: Plus,
        keywords: "add create",
        run: go(t.href),
      })),
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        group: "Actions",
        icon: Moon,
        keywords: "theme dark light appearance",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          onClose();
        },
      },
    ];
  }, [router, onClose, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    const score = (c: Command) => {
      const label = c.label.toLowerCase();
      if (label.startsWith(q)) return 0;
      if (label.split(/\s+/).some((w) => w.startsWith(q))) return 1;
      if (label.includes(q)) return 2;
      if ([c.hint ?? "", c.keywords ?? "", c.group].join(" ").toLowerCase().includes(q)) return 3;
      return -1;
    };
    return commands
      .map((c) => ({ c, s: score(c) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s)
      .map((x) => x.c);
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.run();
    }
  }

  return (
    <AdminDialogShell onClose={onClose} label="Search" initialFocusRef={inputRef} className="max-w-xl sm:mt-[12vh] sm:self-start">
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
        <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search pages and actions…"
          className="h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-label="Search pages and actions"
        />
        <kbd className="hidden rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:block dark:border-gray-700 dark:text-gray-400">
          Esc
        </kbd>
      </div>
      <ul id={listId} role="listbox" aria-label="Results" className="admin-scrollbar max-h-[min(60dvh,420px)] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No results for “{query}”
          </li>
        )}
        {results.map((c, index) => {
          const header = results[index - 1]?.group !== c.group ? c.group : null;
          const Icon = c.icon;
          const selected = index === activeIndex;
          return (
            <li key={c.id} role="presentation">
              {header && (
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {header}
                </p>
              )}
              <div
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(index)}
                onClick={() => c.run()}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                  selected
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex-1 truncate font-medium">{c.label}</span>
                {c.hint && <span className="text-xs text-gray-500 dark:text-gray-400">{c.hint}</span>}
                {selected && <CornerDownLeft className="h-3.5 w-3.5 opacity-70" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ul>
    </AdminDialogShell>
  );
}
