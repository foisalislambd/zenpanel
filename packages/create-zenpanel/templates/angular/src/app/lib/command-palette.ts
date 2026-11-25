/** Command palette data + ranking shared across frameworks. */
export const PALETTE_CREATE_TARGETS: Array<{ label: string; href: string }> = [
  { label: "New project", href: "/admin/projects?new=1" },
  { label: "New service", href: "/admin/services?new=1" },
  { label: "New blog post", href: "/admin/blog?new=1" },
  { label: "New product", href: "/admin/products?new=1" },
  { label: "New category", href: "/admin/categories?new=1" },
  { label: "Invite user", href: "/admin/users?new=1" },
];

export type PaletteCommand<I = unknown> = {
  id: string;
  label: string;
  group: "Pages" | "Actions";
  hint?: string;
  keywords?: string;
  icon: I;
  /** Navigate here, or run `action` (e.g. "toggle-theme"). */
  href?: string;
  action?: "toggle-theme";
};

export function buildPaletteCommands<I>(
  navItems: Array<{ name: string; href: string; section?: string; description?: string; icon: I }>,
  icons: { plus: I; moon: I },
  isDark: boolean,
): PaletteCommand<I>[] {
  return [
    ...navItems.map((item) => ({
      id: `nav-${item.href}`,
      label: item.name,
      group: "Pages" as const,
      hint: item.section,
      keywords: item.description,
      icon: item.icon,
      href: item.href,
    })),
    ...PALETTE_CREATE_TARGETS.map((t) => ({
      id: `new-${t.href}`,
      label: t.label,
      group: "Actions" as const,
      keywords: "add create",
      icon: icons.plus,
      href: t.href,
    })),
    {
      id: "theme",
      label: isDark ? "Switch to light mode" : "Switch to dark mode",
      group: "Actions" as const,
      keywords: "theme dark light appearance",
      icon: icons.moon,
      action: "toggle-theme" as const,
    },
  ];
}

/** Prefix > word-prefix > substring > keyword match. */
export function rankPaletteCommands<C extends PaletteCommand<unknown>>(commands: C[], query: string): C[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  const score = (c: C) => {
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
}

export const isMacPlatform = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
