import {
  DocsCallout,
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsP,
  DocsProse,
  DocsTable,
  DocsUl,
} from "@/components/docs/docs-prose";
import { Link } from "react-router-dom";

export default function DocsCustomizationPage() {
  return (
    <DocsProse>
      <DocsH1>Customization</DocsH1>
      <DocsLead>
        Brand the shell, reshape the sidebar, and edit layout pieces without
        rewriting the whole admin.
      </DocsLead>

      <DocsH2 id="branding">Branding and navigation</DocsH2>
      <DocsP>Most templates use a single config file for brand + sidebar:</DocsP>
      <DocsTable
        headers={["Framework", "Config path"]}
        rows={[
          ["Next.js / React / Preact / Solid", <DocsCode>src/config/admin.config.ts</DocsCode>],
          ["Svelte / Vue", <DocsCode>src/config/admin.config.ts</DocsCode>],
          ["Angular", <DocsCode>src/app/core/admin.config.ts</DocsCode>],
          ["HTML", <DocsCode>src/js/config.js</DocsCode>],
          ["Astro", <DocsCode>src/scripts/config.js</DocsCode>],
        ]}
      />
      <DocsP>Typical fields:</DocsP>
      <DocsUl>
        <li>
          <DocsCode>brand.name</DocsCode>, <DocsCode>brand.tagline</DocsCode>,{" "}
          <DocsCode>brand.letter</DocsCode>
        </li>
        <li>
          <DocsCode>brand.siteUrl</DocsCode> (sidebar “View site”)
        </li>
        <li>Login description + feature bullets</li>
        <li>
          <DocsCode>adminNavItems</DocsCode> — sidebar links (
          <DocsCode>name</DocsCode>, <DocsCode>href</DocsCode>, icon)
        </li>
      </DocsUl>
      <DocsP>
        After changing nav hrefs, make sure matching routes/pages exist.
      </DocsP>

      <DocsH2 id="layout">Layout pieces</DocsH2>
      <DocsUl>
        <li>
          <strong>Sidebar / header</strong> — layout components under{" "}
          <DocsCode>components/admin/layout</DocsCode> (or HTML/Astro{" "}
          <DocsCode>layout.js</DocsCode>)
        </li>
        <li>
          <strong>Dashboard widgets</strong> —{" "}
          <DocsCode>components/admin/dashboard/*</DocsCode> or{" "}
          <DocsCode>dashboard.js</DocsCode>
        </li>
        <li>
          <strong>Resource empty states</strong> — resource list / page
          components
        </li>
        <li>
          <strong>Settings</strong> — account settings UI
        </li>
      </DocsUl>

      <DocsH2 id="preview-auth">Preview auth</DocsH2>
      <DocsCallout title="Demo only">
        Login accepts <DocsCode>admin</DocsCode> / <DocsCode>admin</DocsCode> for
        the UI demo. Replace with your auth provider (cookies, JWT, OAuth, etc.)
        before production. See{" "}
        <Link
          to="/docs/connecting-api"
          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          Connect your API
        </Link>
        .
      </DocsCallout>
    </DocsProse>
  );
}
