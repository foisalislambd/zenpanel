export type DocsNavItem = {
  title: string;
  href: string;
  description: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export const docsNav: DocsNavSection[] = [
  {
    title: "Start",
    items: [
      {
        title: "Introduction",
        href: "/docs",
        description: "What ZenPanel is and how the docs are organized",
      },
      {
        title: "Getting started",
        href: "/docs/getting-started",
        description: "Scaffold a project and open the admin login",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "CLI reference",
        href: "/docs/cli",
        description: "Flags, create vs install mode, examples",
      },
      {
        title: "Frameworks",
        href: "/docs/frameworks",
        description: "Pick a template and understand UI parity",
      },
      {
        title: "Customization",
        href: "/docs/customization",
        description: "Branding, sidebar nav, and layout files",
      },
      {
        title: "Theming",
        href: "/docs/theming",
        description: "Light / dark mode, tokens, and fonts",
      },
      {
        title: "Connect your API",
        href: "/docs/connecting-api",
        description: "Replace preview data with real backends",
      },
    ],
  },
  {
    title: "Publish",
    items: [
      {
        title: "Publish to npm",
        href: "/docs/publishing",
        description: "Ship create-zenpanel to the registry",
      },
    ],
  },
];

export const docsPages = docsNav.flatMap((section) => section.items);

export function getDocsPage(href: string) {
  return docsPages.find((page) => page.href === href);
}

export function getDocsNeighbors(href: string) {
  const index = docsPages.findIndex((page) => page.href === href);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? docsPages[index - 1] : undefined,
    next: index < docsPages.length - 1 ? docsPages[index + 1] : undefined,
  };
}
