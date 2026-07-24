import {
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsProse,
  DocsTable,
  DocsUl,
} from "@/components/docs/docs-prose";

export default function DocsFrameworksPage() {
  return (
    <DocsProse>
      <DocsH1>Frameworks</DocsH1>
      <DocsLead>
        All templates share the same admin UI/UX. Next.js is the visual source of
        truth — pick the stack that matches your app.
      </DocsLead>

      <DocsH2 id="matrix">Supported templates</DocsH2>
      <DocsTable
        headers={["Framework", "Tooling", "Port", "Notes"]}
        rows={[
          ["Next.js", "App Router, Tailwind 4", "3000", "Canonical design reference"],
          ["React", "Vite 8", "5173", "Same React admin UI as Next"],
          ["Preact", "Vite + preact/compat", "5173", "React-style code, Preact runtime"],
          ["Solid", "Vite + @solidjs/router", "5173", "Native Solid port"],
          ["Svelte", "Svelte 5 + Vite", "5173", "Native Svelte runes port"],
          ["Vue", "Vue 3 + vue-router", "5173", "Native Composition API port"],
          ["HTML", "HTML/CSS/JS + Tailwind CLI", "5173", "No Vite; static serve"],
          ["Astro", "Astro 7 + Tailwind", "4321", "Vanilla JS (same as HTML), MPA"],
          ["Angular", "Angular 22 + Tailwind", "4200", "Native Angular components"],
          ["Remix", "—", "—", "Coming soon"],
        ]}
      />

      <DocsH2 id="which">Which should I choose?</DocsH2>
      <DocsUl>
        <li>
          Already on Next.js → <DocsCode>--framework nextjs</DocsCode>
        </li>
        <li>
          Vite SPA → <DocsCode>react</DocsCode>, <DocsCode>preact</DocsCode>,{" "}
          <DocsCode>solid</DocsCode>, <DocsCode>svelte</DocsCode>, or{" "}
          <DocsCode>vue</DocsCode>
        </li>
        <li>
          No framework → <DocsCode>html</DocsCode>
        </li>
        <li>
          Content site + admin → <DocsCode>astro</DocsCode>
        </li>
        <li>
          Angular shop → <DocsCode>angular</DocsCode>
        </li>
      </DocsUl>

      <DocsH2 id="parity">Parity notes</DocsH2>
      <DocsUl>
        <li>
          Dashboard, login, shell, resources, messages, and settings are designed
          to match across frameworks.
        </li>
        <li>
          Preview auth is in-memory / <DocsCode>sessionStorage</DocsCode> only —
          wire real auth when you connect a backend.
        </li>
        <li>
          HTML and Astro use shared vanilla JS renderers; React-family templates
          share component structure with Next.
        </li>
      </DocsUl>
    </DocsProse>
  );
}
