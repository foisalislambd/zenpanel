import {
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsP,
  DocsProse,
  DocsUl,
} from "@/components/docs/docs-prose";

export default function DocsThemingPage() {
  return (
    <DocsProse>
      <DocsH1>Theming</DocsH1>
      <DocsLead>
        ZenPanel ships with light and dark modes and shared brand/gray tokens
        (Tailwind CSS v4).
      </DocsLead>

      <DocsH2 id="toggle">Toggle</DocsH2>
      <DocsUl>
        <li>Header and login screens include a theme control.</li>
        <li>
          Preference is stored in <DocsCode>localStorage</DocsCode> (commonly{" "}
          <DocsCode>zenpanel-theme</DocsCode> or via <DocsCode>next-themes</DocsCode>
          ).
        </li>
        <li>
          Dark mode applies a <DocsCode>dark</DocsCode> class on{" "}
          <DocsCode>&lt;html&gt;</DocsCode> (class strategy).
        </li>
      </DocsUl>

      <DocsH2 id="tokens">Design tokens</DocsH2>
      <DocsP>Brand colors live in the template CSS / <DocsCode>@theme</DocsCode> block:</DocsP>
      <DocsUl>
        <li>
          <DocsCode>brand-500</DocsCode> / <DocsCode>brand-600</DocsCode> — primary
          actions and active nav
        </li>
        <li>
          <DocsCode>gray-*</DocsCode> — surfaces, borders, muted text
        </li>
        <li>
          <DocsCode>success-*</DocsCode> / <DocsCode>error-*</DocsCode> — status
          accents
        </li>
      </DocsUl>
      <DocsUl>
        <li>
          <strong>Next.js / Vite:</strong>{" "}
          <DocsCode>src/app/globals.css</DocsCode> or{" "}
          <DocsCode>src/index.css</DocsCode>
        </li>
        <li>
          <strong>HTML:</strong> edit <DocsCode>src/css/input.css</DocsCode>, then{" "}
          <DocsCode>npm run build</DocsCode>
        </li>
        <li>
          <strong>Astro:</strong> edit <DocsCode>src/styles/global.css</DocsCode>
        </li>
      </DocsUl>

      <DocsH2 id="fonts">Fonts</DocsH2>
      <DocsP>
        Templates use <strong>Geist</strong> (UI) and <strong>Outfit</strong>{" "}
        (admin shell) from Google Fonts where applicable. Swap the{" "}
        <DocsCode>&lt;link&gt;</DocsCode> / CSS <DocsCode>--font-*</DocsCode>{" "}
        variables to rebrand typography.
      </DocsP>
    </DocsProse>
  );
}
