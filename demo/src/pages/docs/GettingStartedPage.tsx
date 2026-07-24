import {
  DocsCallout,
  DocsCode,
  DocsH1,
  DocsH2,
  DocsLead,
  DocsP,
  DocsPre,
  DocsProse,
  DocsTable,
} from "@/components/docs/docs-prose";
import { Link } from "react-router-dom";

export default function DocsGettingStartedPage() {
  return (
    <DocsProse>
      <DocsH1>Getting started</DocsH1>
      <DocsLead>
        ZenPanel is an admin UI shell (sidebar, dashboard, resources, login, dark
        mode). There is no backend — preview data is included so you can review
        the UI first.
      </DocsLead>

      <DocsH2 id="requirements">Requirements</DocsH2>
      <DocsP>
        <DocsCode>Node.js 20+</DocsCode> for most templates. The Astro template
        needs <DocsCode>Node.js 22.12+</DocsCode>.
      </DocsP>

      <DocsH2 id="create">Create a new project</DocsH2>
      <DocsPre>{`npm create zenpanel@latest`}</DocsPre>
      <DocsP>
        Same pattern as Vite (<DocsCode>npm create vite@latest</DocsCode>).
        Equivalent: <DocsCode>npx create-zenpanel@latest</DocsCode>.
      </DocsP>
      <DocsP>You will be prompted for a project name and framework. Or pass options up front:</DocsP>
      <DocsPre>{`npm create zenpanel@latest my-admin -- --framework nextjs`}</DocsPre>
      <DocsPre>{`cd my-admin
npm run dev`}</DocsPre>

      <DocsH2 id="login-urls">Admin login URLs</DocsH2>
      <DocsTable
        headers={["Framework", "URL"]}
        rows={[
          ["Next.js", "http://localhost:3000/admin/login"],
          ["React / Preact / Solid / Svelte / Vue / HTML", "http://localhost:5173/admin/login"],
          ["Astro", "http://localhost:4321/admin/login"],
          ["Angular", "http://localhost:4200/admin/login"],
        ]}
      />
      <DocsCallout title="Preview credentials">
        Use <DocsCode>admin</DocsCode> / <DocsCode>admin</DocsCode>. This is UI-only
        auth — not real authentication. Try it in this demo via{" "}
        <Link to="/admin/login" className="font-medium text-brand-600 hover:underline dark:text-brand-300">
          Admin sign in
        </Link>
        .
      </DocsCallout>

      <DocsH2 id="install-existing">Install into an existing app</DocsH2>
      <DocsP>If the current folder already has a <DocsCode>package.json</DocsCode>:</DocsP>
      <DocsPre>{`cd your-existing-app
npm create zenpanel@latest`}</DocsPre>
      <DocsP>Force install mode:</DocsP>
      <DocsPre>{`npx create-zenpanel@latest --install`}</DocsPre>
      <DocsP>
        Next:{" "}
        <Link to="/docs/cli" className="font-medium text-brand-600 hover:underline dark:text-brand-300">
          CLI reference
        </Link>{" "}
        and{" "}
        <Link
          to="/docs/customization"
          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          Customization
        </Link>
        .
      </DocsP>
    </DocsProse>
  );
}
