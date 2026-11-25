// Generated from the shared ZenPanel TypeScript core - edit freely.
const PALETTE_CREATE_TARGETS = [
  { label: "New project", href: "/admin/projects?new=1" },
  { label: "New service", href: "/admin/services?new=1" },
  { label: "New blog post", href: "/admin/blog?new=1" },
  { label: "New product", href: "/admin/products?new=1" },
  { label: "New category", href: "/admin/categories?new=1" },
  { label: "Invite user", href: "/admin/users?new=1" }
];
function buildPaletteCommands(navItems, icons, isDark) {
  return [
    ...navItems.map((item) => ({
      id: `nav-${item.href}`,
      label: item.name,
      group: "Pages",
      hint: item.section,
      keywords: item.description,
      icon: item.icon,
      href: item.href
    })),
    ...PALETTE_CREATE_TARGETS.map((t) => ({
      id: `new-${t.href}`,
      label: t.label,
      group: "Actions",
      keywords: "add create",
      icon: icons.plus,
      href: t.href
    })),
    {
      id: "theme",
      label: isDark ? "Switch to light mode" : "Switch to dark mode",
      group: "Actions",
      keywords: "theme dark light appearance",
      icon: icons.moon,
      action: "toggle-theme"
    }
  ];
}
function rankPaletteCommands(commands, query) {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  const score = (c) => {
    const label = c.label.toLowerCase();
    if (label.startsWith(q)) return 0;
    if (label.split(/\s+/).some((w) => w.startsWith(q))) return 1;
    if (label.includes(q)) return 2;
    if ([c.hint ?? "", c.keywords ?? "", c.group].join(" ").toLowerCase().includes(q)) return 3;
    return -1;
  };
  return commands.map((c) => ({ c, s: score(c) })).filter((x) => x.s >= 0).sort((a, b) => a.s - b.s).map((x) => x.c);
}
const isMacPlatform = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
export {
  PALETTE_CREATE_TARGETS,
  buildPaletteCommands,
  isMacPlatform,
  rankPaletteCommands
};
